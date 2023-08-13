import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { and, asc, eq, gt, like, lte, or, sql } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/config/env";
import type { Coupon, TicketPrice } from "~/db/schema";

import { MAX_EVENT_DURATION_HOURS } from "~/config/constants";
import {
  coupons,
  eventMedia,
  events,
  promotionCodes,
  ticketPrices,
  tickets,
} from "~/db/schema";
import { createCoupon } from "~/utils/createCoupon";
import { createEventSchema } from "~/utils/createEventSchema";
import { createTicketPrice } from "~/utils/createTicketPrice";
import { deleteImage } from "~/utils/images";
import { isTextSafe } from "~/utils/isTextSafe";
import { eventMediaRouter } from "./event-media-router";
import { eventPromotionCodesRouter } from "./event-promotion-codes-router";
import { eventRolesRouter } from "./event-roles-router";
import {
  adminEventProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./trpc/trpc-config";

export const eventsRouter = router({
  roles: eventRolesRouter,
  media: eventMediaRouter,
  promotionCodes: eventPromotionCodesRouter,

  getAllEvents: publicProcedure.query(async ({ ctx }) => {
    const foundEvents = await ctx.db.query.events.findMany({
      columns: {
        description: true,
        id: true,
        name: true,
        startTime: true,
      },
      where: gt(events.startTime, new Date()),
    });
    return foundEvents;
  }),
  createEvent: protectedProcedure
    .input(createEventSchema)
    .mutation(
      async ({
        ctx,
        input: {
          ticketPrices: ticketPricesInput,
          coupons: couponsInput,
          ...eventInput
        },
      }) => {
        // Check if any ticket prices are paid, and block if true
        // Non-admins aren't allowed to create paid events
        if (
          (ticketPricesInput.some((p) => !p.isFree) ||
            couponsInput.length > 0) &&
          !ctx.isPlatformAdmin
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You are not allowed to create paid events.",
          });
        }

        const [isNameSafe, isDescriptionSafe] = await Promise.all([
          isTextSafe(eventInput.name),
          isTextSafe(eventInput.description),
        ]);
        if (!isNameSafe) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Event name is inappropriate",
          });
        } else if (!isDescriptionSafe) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Event description is inappropriate",
          });
        }

        const eventId = createId();
        const product = await ctx.stripe.products.create({
          name: eventInput.name,
          description:
            eventInput.description === "" ? undefined : eventInput.description,
          metadata: { eventId },
        });

        const event = await ctx.db
          .insert(events)
          .values({
            ...eventInput,
            description: eventInput.description ?? "",
            id: eventId,
            userId: ctx.auth.userId,
            updatedAt: new Date(),
            createdAt: new Date(),
            stripeProductId: product.id,
            isFeatured: ctx.isPlatformAdmin ? eventInput.isFeatured : false,
          })
          .returning()
          .get();

        const createdTicketPrices: TicketPrice[] = [];

        for (const price of ticketPricesInput) {
          const p = await createTicketPrice({
            userId: ctx.auth.userId,
            eventId,
            data: price,
            productId: product.id,
          });

          createdTicketPrices.push(p);
        }

        const createdCoupons: Coupon[] = [];
        for (const c of couponsInput) {
          const coupon = await createCoupon({
            data: c,
            userId: ctx.auth.userId,
            eventId,
            productId: product.id,
          });

          createdCoupons.push(coupon);
        }

        return {
          ...event,
          ticketPrices: createdTicketPrices,
          coupons: createdCoupons,
        };
      }
    ),
  updateEvent: adminEventProcedure
    .input(z.object({ data: createEventSchema }))
    .mutation(
      async ({
        ctx,
        input: {
          data: {
            ticketPrices: ticketPricesInput,
            coupons: couponsInput,
            ...eventInput
          },
          eventId,
        },
      }) => {
        // Check if any ticket prices are paid, and block if true
        // Non-admins aren't allowed to create paid events
        if (
          (ticketPricesInput.some((p) => !p.isFree) ||
            couponsInput.length > 0) &&
          !ctx.isPlatformAdmin
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You are not allowed to create paid events.",
          });
        }

        const [isNameSafe, isDescriptionSafe] = await Promise.all([
          isTextSafe(eventInput.name),
          isTextSafe(eventInput.description),
        ]);
        if (!isNameSafe) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Event name is inappropriate",
          });
        } else if (!isDescriptionSafe) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Event description is inappropriate",
          });
        }
        const event = await ctx.db
          .update(events)
          .set({
            ...eventInput,
            description: eventInput.description ?? "",
            updatedAt: new Date(),
            isFeatured: ctx.isPlatformAdmin ? eventInput.isFeatured : false,
          })
          .where(
            and(eq(events.id, eventId), eq(events.userId, ctx.auth.userId))
          )
          .returning()
          .get();

        return {
          ...event,
        };
      }
    ),
  createTicketPurchaseUrl: protectedProcedure
    .input(z.object({ ticketPriceId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticketPriceData = await ctx.db.query.ticketPrices.findFirst({
        where: eq(ticketPrices.id, input.ticketPriceId),
        with: {
          event: {
            columns: {
              id: true,
              capacity: true,
            },
          },
        },
      });

      if (!ticketPriceData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ticket price not found",
        });
      }

      const { ticketsSold } = await ctx.db
        .select({ ticketsSold: sql<number>`count(*)` })
        .from(tickets)
        .where(
          and(
            eq(tickets.eventId, ticketPriceData.eventId),
            eq(tickets.status, "success")
          )
        )
        .get();

      if (ticketsSold >= ticketPriceData.event.capacity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Event is at capacity",
        });
      }

      // Does the user already have a ticket for this event?
      const existingTicket = await ctx.db.query.tickets.findFirst({
        where: and(
          eq(tickets.eventId, ticketPriceData.eventId),
          eq(tickets.userId, ctx.auth.userId),
          eq(tickets.status, "success")
        ),
      });

      // Send the user to their existing ticket
      if (existingTicket) {
        return `/events/${ticketPriceData.event.id}/tickets/${existingTicket.id}`;
      }

      const ticketId = createId();

      let stripeSessionId: string | null = null;

      // The URL the user will be redirected to for next steps
      // If the ticket price is free, this will be their ticket URL
      // If the ticket is paid, this will be a checkout URL
      let url = `/events/${ticketPriceData.event.id}/tickets/${ticketId}`;

      if (!ticketPriceData.isFree && ticketPriceData.stripePriceId) {
        const checkout = await ctx.stripe.checkout.sessions.create({
          success_url: `${env.NEXT_PUBLIC_WEBSITE_URL}/events/${ticketPriceData.event.id}/tickets/${ticketId}`,
          line_items: [
            {
              quantity: 1,
              adjustable_quantity: { enabled: true, minimum: 1 },
              price: ticketPriceData?.stripePriceId,
            },
          ],
          mode: "payment",
          allow_promotion_codes: true,
        });

        stripeSessionId = checkout.id;

        // If checkout.url is ever null, we have a problem
        if (checkout.url) {
          url = checkout.url;
        }
      }

      await ctx.db
        .insert(tickets)
        .values({
          id: ticketId,
          createdAt: new Date(),
          eventId: ticketPriceData.eventId,
          quantity: 1,
          updatedAt: new Date(),
          ticketPriceId: input.ticketPriceId,
          userId: ctx.auth.userId,
          stripeSessionId,
          status: ticketPriceData.isFree ? "success" : "pending",
        })
        .returning()
        .get();

      return url;
    }),
  deleteEvent: adminEventProcedure.mutation(async ({ ctx, input }) => {
    // Delete promo codes
    const event = await ctx.db.query.events.findFirst({
      where: and(
        eq(events.id, input.eventId),
        eq(events.userId, ctx.auth.userId)
      ),
      with: {
        coupons: {
          with: {
            promotionCodes: true,
          },
        },
        eventMedia: true,
        ticketPrices: true,
        tickets: true,
      },
    });

    if (!event) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Event does not exist",
      });
    }

    await ctx.db
      .delete(promotionCodes)
      .where(eq(promotionCodes.eventId, input.eventId))
      .run();

    await ctx.db
      .delete(coupons)
      .where(eq(coupons.eventId, input.eventId))
      .run();

    const media = await ctx.db
      .delete(eventMedia)
      .where(eq(eventMedia.eventId, input.eventId))
      .returning({ imageId: eventMedia.imageId })
      .all();

    await Promise.all(media.map((e) => deleteImage(e.imageId)));

    await ctx.db
      .delete(tickets)
      .where(eq(tickets.eventId, input.eventId))
      .run();

    await ctx.db
      .delete(ticketPrices)
      .where(eq(ticketPrices.eventId, input.eventId))
      .run();

    await ctx.db.delete(events).where(eq(events.id, input.eventId)).run();

    // Disable buying new tickets
    await ctx.stripe.products.update(event.stripeProductId, {
      active: false,
    });

    return event;
  }),

  searchEvents: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input, ctx }) => {
      const hoursStr = `-${MAX_EVENT_DURATION_HOURS} hours`;
      const results = await ctx.db.query.events.findMany({
        where: and(
          or(
            like(events.name, `%${input.query}%`),
            like(events.description, `%${input.query}%`)
          ),
          eq(events.isPublic, true),
          eq(events.isFeatured, false),
          lte(events.startTime, sql`datetime(datetime('now'),${hoursStr})`)
        ),
        columns: {
          id: true,
          name: true,
          description: true,
          startTime: true,
          location: true,
        },
        with: {
          eventMedia: {
            where: eq(eventMedia.isPoster, true),
          },
        },
        orderBy: asc(events.startTime),
        limit: 25,
      });

      return results.map((e) => ({ ...e, imageUrl: e.eventMedia[0].url }));
    }),
  getUpcomingPublicEvents: publicProcedure.query(async ({ ctx }) => {
    const hoursStr = `-${MAX_EVENT_DURATION_HOURS} hours`;
    const results = await ctx.db.query.events.findMany({
      where: and(
        eq(events.isPublic, true),
        eq(events.isFeatured, false),
        lte(events.startTime, sql`datetime(datetime('now'),${hoursStr})`)
      ),
      columns: {
        id: true,
        name: true,
        description: true,
        startTime: true,
        location: true,
      },
      with: {
        eventMedia: {
          where: eq(eventMedia.isPoster, true),
        },
      },
      orderBy: asc(events.startTime),
      limit: 25,
    });

    return results.map((e) => ({ ...e, imageUrl: e.eventMedia[0].url }));
  }),
});
