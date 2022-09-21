import * as z from "zod"
import { CompleteEvent, RelatedEventModel, CompleteUser, RelatedUserModel, CompleteTicketPrice, RelatedTicketPriceModel } from "./index"

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
})

export interface CompleteTicket extends z.infer<typeof TicketModel> {
  event: CompleteEvent
  user?: CompleteUser | null
  ticketPriceurn?: CompleteTicketPrice | null
}

/**
 * RelatedTicketModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketModel: z.ZodSchema<CompleteTicket> = z.lazy(() => TicketModel.extend({
  event: RelatedEventModel,
  user: RelatedUserModel.nullish(),
  ticketPriceurn: RelatedTicketPriceModel.nullish(),
}))
