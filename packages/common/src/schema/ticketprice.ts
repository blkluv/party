import * as z from "zod";

export const TicketPriceModel = z.object({
  id: z.number().int(),
  name: z.string(),
  price: z.number().int(),
  eventId: z.number().int(),
  free: z.boolean().nullish(),
  paymentLink: z.string().nullish(),
  paymentLinkId: z.string().nullish(),
  stripePriceId: z.string().nullish(),
});

