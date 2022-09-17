import * as z from "zod"
import { CompleteTicket, RelatedTicketModel, CompleteEventNotification, RelatedEventNotificationModel, CompleteHost, RelatedHostModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const EventModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullish(),
  published: z.boolean(),
  prices: jsonSchema.array(),
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
}))
