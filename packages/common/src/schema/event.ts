import * as z from "zod";
import {
  CompleteTicket,
  RelatedTicketModel,
  CompleteEventNotification,
  RelatedEventNotificationModel,
  CompleteHost,
  RelatedHostModel,
  CompleteTicketPrice,
  RelatedTicketPriceModel,
} from "./index";

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
  startTime: z.string(),
  endTime: z.date(),
  hostId: z.number().int(),
});

export interface CompleteEvent extends z.infer<typeof EventModel> {
  tickets: CompleteTicket[];
  notifications: CompleteEventNotification[];
  host: CompleteHost;
  prices: CompleteTicketPrice[];
}

export const RelatedEventModel: z.ZodSchema<CompleteEvent> = z.lazy(() =>
  EventModel.extend({
    tickets: RelatedTicketModel.array(),
    notifications: RelatedEventNotificationModel.array(),
    host: RelatedHostModel,
    prices: RelatedTicketPriceModel.array(),
  })
);

