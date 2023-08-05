import { z } from "zod";
import {
  insertCouponSchema,
  insertEventSchema,
  insertTicketPriceSchema,
} from "~/db/schema";

export const createEventSchema = insertEventSchema
  .omit({
    id: true,
    userId: true,
    stripeProductId: true,
    updatedAt: true,
    createdAt: true,
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
    coupons: insertCouponSchema
      .pick({ name: true, percentageDiscount: true })
      .extend({ id: z.string().nullish() })
      .array(),
  });
