import { z } from "zod";
import { insertEventSchema, insertTicketPriceSchema } from "~/db/schema";

export const TIME_SPECIFIERS = ["days", "hours", "minutes"] as const;
export type TimeSpecifier = (typeof TIME_SPECIFIERS)[number];

export const createTicketPriceFormSchema = insertTicketPriceSchema
  .omit({
    eventId: true,
    userId: true,
    stripePriceId: true,
  })
  .extend({ id: z.string().nullish() });

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
    ticketPrices: createTicketPriceFormSchema.array(),
  });
