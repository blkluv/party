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

export const RelatedEventNotificationModel: z.ZodSchema<CompleteEventNotification> = z.lazy(() => EventNotificationModel.extend({
  event: RelatedEventModel,
}))
