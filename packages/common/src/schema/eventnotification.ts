import * as z from "zod";

export const EventNotificationModel = z.object({
  id: z.number().int(),
  messageTime: z.date(),
  message: z.string(),
  eventId: z.number().int(),
  sent: z.boolean(),
});
