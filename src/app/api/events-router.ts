import { gt } from "drizzle-orm";
import { NewTicketPrice, TicketPrice, events, ticketPrices } from "~/db/schema";
import { createEventSchema } from "~/utils/createEventSchema";
import { generateSlug } from "~/utils/generateSlug";
import { getStripeClient } from "~/utils/stripe";
import {
  protectedProcedure,
  publicProcedure,
  router,
} from "./trpc/trpc-config";

export const eventMediaRouter = router({
  createUploadUrl: protectedProcedure.mutation(() => {
    return;
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
              unit_amount: price.price,
            });

            const paymentLink = await stripe.paymentLinks.create({
              line_items: [
                {
                  price: newPrice.id,
                  adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                  },
                  quantity: 1,
                },
              ],
              metadata: {
                eventSlug,
              },
              allow_promotion_codes: true,
              phone_number_collection: {
                enabled: true,
              },
              after_completion: {
                type: "hosted_confirmation",
              },
            });

            priceData.stripePaymentLink = paymentLink.url;
            priceData.stripePaymentLinkId = paymentLink.id;
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
});
