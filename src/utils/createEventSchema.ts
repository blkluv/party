import { insertEventSchema, insertTicketPriceSchema } from "~/db/schema";

export const createEventSchema = insertEventSchema
  .omit({
    id: true,
    userId: true,
    stripeProductId: true,
    slug: true,
    updatedAt: true,
    createdAt: true,
  })
  .extend({
    ticketPrices: insertTicketPriceSchema
      .omit({
        eventId: true,
        id: true,
        stripePaymentLink: true,
        stripePaymentLinkId: true,
        stripePriceId: true,
      })
      .array(),
  });
