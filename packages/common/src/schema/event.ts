import * as z from "zod"
import { CompleteTicket, RelatedTicketModel, CompleteEventNotification, RelatedEventNotificationModel, CompleteHost, RelatedHostModel, CompleteTicketPrice, RelatedTicketPriceModel } from "./index"

export const EventModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullish(),
  published: z.boolean(),
  media: z.string().array(),
  thumbnail: z.string().nullish(),
  hashtags: z.string().array(),
  maxTickets: z.number().int(),
  location: z.string(),
  stripeProductId: z.string().nullish(),
  snsTopicArn: z.string().nullish(),
  startTime: z.date(),
  endTime: z.date(),
  hostId: z.number().int(),
})

export interface CompleteEvent extends z.infer<typeof EventModel> {
  tickets: CompleteTicket[]
  eventNotifications: CompleteEventNotification[]
  host: CompleteHost
  prices: CompleteTicketPrice[]
}

/**
 * RelatedEventModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEventModel: z.ZodSchema<CompleteEvent> = z.lazy(() => EventModel.extend({
  tickets: RelatedTicketModel.array(),
  eventNotifications: RelatedEventNotificationModel.array(),
  host: RelatedHostModel,
  prices: RelatedTicketPriceModel.array(),
}))
