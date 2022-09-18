import * as z from "zod"
import { CompleteEvent, RelatedEventModel, CompleteTicket, RelatedTicketModel } from "./index"

export const TicketPriceModel = z.object({
  id: z.number().int(),
  name: z.string(),
  price: z.number().int(),
  eventId: z.number().int(),
  free: z.boolean().nullish(),
  paymentLink: z.string().nullish(),
  paymentLinkId: z.string().nullish(),
})

export interface CompleteTicketPrice extends z.infer<typeof TicketPriceModel> {
  event: CompleteEvent
  Ticket: CompleteTicket[]
}

/**
 * RelatedTicketPriceModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTicketPriceModel: z.ZodSchema<CompleteTicketPrice> = z.lazy(() => TicketPriceModel.extend({
  event: RelatedEventModel,
  Ticket: RelatedTicketModel.array(),
}))
