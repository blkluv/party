import { TRPCError } from "@trpc/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { env } from "~/config/env";
import {
  NewTicketPrice,
  TicketPrice,
  eventMedia,
  events,
  insertEventMediaSchema,
  ticketPrices,
  tickets,
} from "~/db/schema";
import { createEventSchema } from "~/utils/createEventSchema";
import { createUploadUrls } from "~/utils/createUploadUrls";
import { generateSlug } from "~/utils/generateSlug";
import { getStripeClient } from "~/utils/stripe";
import {
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
          eventId: true,
          order: true,
          url: true,
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      const media = await ctx.db
        .insert(eventMedia)
        .values(input)
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
        input: { ticketPrices: ticketPricesInput, ...eventInput },
      }) => {
        const stripe = getStripeClient();

        const eventSlug = generateSlug();
        const product = await stripe.products.create({
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
          };

          if (!price.isFree) {
            const newPrice = await stripe.prices.create({
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

        return { ...event, ticketPrices: createdTicketPrices };
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
});
