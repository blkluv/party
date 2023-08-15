import { z } from "zod";
import { insertEventSchema, insertTicketPriceSchema } from "~/db/schema";

export const createEventSchema = insertEventSchema
  .omit({
    id: true,
    userId: true,
    stripeProductId: true,
    updatedAt: true,
    createdAt: true,
    isPublic: true,
    isFeatured: true,
  })
  .extend({
    ticketPrices: insertTicketPriceSchema
      .omit({
        eventId: true,
        userId: true,
        stripePriceId: true,
      })
      .extend({ id: z.string().nullish() })
      .array(),
  });
