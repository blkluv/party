import * as z from "zod";
import { PartyBoxEventTicket } from "../types";
import { CompleteEventNotification, CompleteHost, CompleteTicketPrice } from "./index";

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
  tickets: PartyBoxEventTicket[];
  notifications: CompleteEventNotification[];
  host: CompleteHost;
  prices: CompleteTicketPrice[];
}

