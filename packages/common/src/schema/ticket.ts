import * as z from "zod";

export const TicketModel = z.object({
  id: z.number().int(),
  eventId: z.number().int(),
  stripeSessionId: z.string().nullish(),
  stripeChargeId: z.string().nullish(),
  receiptUrl: z.string().nullish(),
  customerName: z.string(),
  customerPhoneNumber: z.string(),
  customerEmail: z.string().nullish(),
  userId: z.string().nullish(),
  ticketQuantity: z.number().int(),
  used: z.boolean(),
  purchasedAt: z.string(),
  slug: z.string(),
  ticketPriceId: z.number().int().nullish(),
  status: z.enum(["failed", "processing", "succeeded"]).nullish(),
});

