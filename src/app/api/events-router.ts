import { TRPCError } from "@trpc/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/config/env";
import {
  Coupon,
  NewTicketPrice,
  TicketPrice,
  coupons,
  eventMedia,
  events,
  insertEventMediaSchema,
  insertPromotionCodeSchema,
  promotionCodes,
  ticketPrices,
  tickets,
} from "~/db/schema";
import { createEventSchema } from "~/utils/createEventSchema";
import { generateSlug } from "~/utils/generateSlug";
import { createUploadUrls, deleteImage } from "~/utils/images";
import {
  protectedEventProcedure,
  protectedProcedure,
  publicProcedure,
  router,
} from "./trpc/trpc-config";

export const eventMediaRouter = router({
  createUploadUrls: protectedProcedure
    .input(z.object({ count: z.number().gt(0) }))
    .mutation(async ({ input }) => {
      const urls = await createUploadUrls(input.count);
      return urls;
    }),
  createEventMedia: protectedProcedure
    .input(
      insertEventMediaSchema
        .pick({
          isPoster: true,
          order: true,
          eventId: true,
          url: true,
          imageId: true,
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      const media = await ctx.db
        .insert(eventMedia)
        .values(input.map((e) => ({ ...e, userId: ctx.auth.userId })))
        .returning()
        .get();

      return media;
    }),
});

export const eventsRouter = router({
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

        const eventSlug = generateSlug();
        const product = await ctx.stripe.products.create({
          name: eventInput.name,
          description: eventInput.description,
          metadata: { eventSlug },
        });

        const event = await ctx.db
          .insert(events)
          .values({
            ...eventInput,
            userId: ctx.auth.userId,
            slug: eventSlug,
            updatedAt: new Date(),
            createdAt: new Date(),
            stripeProductId: product.id,
          })
          .returning()
          .get();

        const createdTicketPrices: TicketPrice[] = [];

        for (const price of ticketPricesInput) {
          let priceData: NewTicketPrice = {
            eventId: event.id,
            name: price.name,
            price: price.price,
            isFree: price.isFree,
            userId: ctx.auth.userId,
          };

          // Not free, must create a Stripe price to accept payment
          if (!price.isFree) {
            const newPrice = await ctx.stripe.prices.create({
              product: product.id,
              currency: "CAD",
              nickname: price.name,
              unit_amount: price.price * 100,
            });

            priceData.stripePriceId = newPrice.id;
          }

          const p = await ctx.db
            .insert(ticketPrices)
            .values(priceData)
            .returning()
            .get();

          createdTicketPrices.push(p);
        }

        const createdCoupons: Coupon[] = [];
        for (const c of couponsInput) {
          const stripeCoupon = await ctx.stripe.coupons.create({
            currency: "CAD",
            name: c.name,
            percent_off: c.percentageDiscount,
            applies_to: {
              products: [product.id],
            },
          });

          const coupon = await ctx.db
            .insert(coupons)
            .values({
              createdAt: new Date(),
              updatedAt: new Date(),
              eventId: event.id,
              name: c.name,
              percentageDiscount: c.percentageDiscount,
              stripeCouponId: stripeCoupon.id,
              userId: ctx.auth.userId,
            })
            .returning()
            .get();

          createdCoupons.push(coupon);
        }

        return {
          ...event,
          ticketPrices: createdTicketPrices,
          coupons: createdCoupons,
        };
      }
    ),
  media: eventMediaRouter,
  createTicketCheckoutSession: protectedProcedure
    .input(z.object({ ticketPriceId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const ticketPriceData = await ctx.db.query.ticketPrices.findFirst({
        where: eq(ticketPrices.id, input.ticketPriceId),
        with: {
          event: {
            columns: {
              slug: true,
              capacity: true,
            },
          },
        },
      });

      if (!ticketPriceData || !ticketPriceData?.stripePriceId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ticket data not found or does not have a Stripe price ID",
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

      const ticketSlug = generateSlug();

      const checkout = await ctx.stripe.checkout.sessions.create({
        success_url: `${
          env.NEXT_PUBLIC_VERCEL_URL ?? env.NEXT_PUBLIC_WEBSITE_URL
        }/events/${ticketPriceData.event.slug}/tickets/${ticketSlug}`,
        line_items: [
          {
            quantity: 1,
            adjustable_quantity: { enabled: true, minimum: 1 },
            price: ticketPriceData?.stripePriceId,
          },
        ],
        mode: "payment",
        allow_promotion_codes: true,
        automatic_tax: {
          enabled: process.env.NODE_ENV === "production",
        },
      });

      await ctx.db
        .insert(tickets)
        .values({
          createdAt: new Date(),
          eventId: ticketPriceData.eventId,
          quantity: 1,
          slug: ticketSlug,
          updatedAt: new Date(),
          ticketPriceId: input.ticketPriceId,
          userId: ctx.auth.userId,
          stripeSessionId: checkout.id,
          status: "pending",
        })
        .returning()
        .get();

      return checkout.url;
    }),
  deleteEvent: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
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

      const deletedEvent = await ctx.db
        .delete(events)
        .where(eq(events.id, input.eventId))
        .returning()
        .get();

      // Disable buying new tickets
      if (deletedEvent) {
        await ctx.stripe.products.update(deletedEvent?.stripeProductId, {
          active: false,
        });
      }

      return event;
    }),
  getAllCoupons: protectedEventProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.query.coupons.findMany({
      where: eq(coupons.eventId, input.eventId),
      columns: {
        id: true,
        name: true,
        percentageDiscount: true,
        updatedAt: true,
      },
    });
  }),
  getAllPromotionCodes: protectedEventProcedure.query(
    async ({ ctx, input }) => {
      return await ctx.db.query.promotionCodes.findMany({
        where: and(
          eq(promotionCodes.eventId, input.eventId),
          eq(promotionCodes.userId, ctx.auth.userId)
        ),
        columns: {
          id: true,
          name: true,
          updatedAt: true,
        },
      });
    }
  ),
  createPromotionCode: protectedEventProcedure
    .input(
      insertPromotionCodeSchema.pick({
        name: true,
        couponId: true,
        code: true,
      })
    )
    .query(async ({ ctx, input }) => {
      const foundCoupon = await ctx.db.query.coupons.findFirst({
        where: and(
          eq(coupons.id, input.couponId),
          eq(coupons.userId, ctx.auth.userId)
        ),
      });

      if (!foundCoupon) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Coupon does not exist",
        });
      }

      const newPromotionCode = await ctx.stripe.promotionCodes.create({
        coupon: foundCoupon?.stripeCouponId,
        code: input.code,
      });

      return await ctx.db
        .insert(promotionCodes)
        .values({
          code: newPromotionCode.code,
          couponId: input.couponId,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: ctx.auth.userId,
          eventId: input.eventId,
          name: input.name,
          stripePromotionCodeId: newPromotionCode.id,
        })
        .returning()
        .get();
    }),
});
