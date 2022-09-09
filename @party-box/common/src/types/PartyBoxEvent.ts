import PartyBoxEventNotification from "./PartyBoxEventNotification";
import PartyBoxEventPrice from "./PartyBoxEventPrice";
import PartyBoxHost from "./PartyBoxHost";

interface PartyBoxEvent {
  id: number;
  name: string;
  description: string;

  // SNS topic where notifications about this event are sent to
  snsTopicArn?: string;

  // ISO date string
  startTime: string;

  // ISO date string
  endTime: string;

  // String containing address of the event
  location: string;

  maxTickets: number;

  // URLs to images/gifs
  media: string[];

  hostId: number;
  host?: PartyBoxHost;

  // URL to small image used for previews
  thumbnail: string;

  prices: PartyBoxEventPrice[];
  stripeProductId: string;
  hashtags: string[];
  published: boolean;
  notifications?: PartyBoxEventNotification[];
}

export default PartyBoxEvent;
