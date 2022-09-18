import * as z from "zod"
import { CompleteEvent, RelatedEventModel } from "./index"

export const EventNotificationModel = z.object({
  id: z.number().int(),
  messageTime: z.date(),
  message: z.string(),
  eventId: z.number().int(),
  sent: z.boolean(),
})

export interface CompleteEventNotification extends z.infer<typeof EventNotificationModel> {
  event: CompleteEvent
}

/**
 * RelatedEventNotificationModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedEventNotificationModel: z.ZodSchema<CompleteEventNotification> = z.lazy(() => EventNotificationModel.extend({
  event: RelatedEventModel,
}))
