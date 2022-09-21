import * as z from "zod";
import { PartyBoxEventTicket } from "../types";
import { CompleteEvent } from "./index";

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

export interface CompleteTicketPrice extends z.infer<typeof TicketPriceModel> {
  event: CompleteEvent;
  ticket: PartyBoxEventTicket[];
}

