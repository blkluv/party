import PartyBoxEventNotification from "./PartyBoxEventNotification";
import PartyBoxEventPrice from "./PartyBoxEventPrice";

interface PartyBoxEventInput {
  id?: number;
  name: string;
  description: string;

  // ISO date string
  startTime: string;

  // ISO date string
  endTime: string;

  // String containing address of the event
  location: string;

  maxTickets: number;

  // URLs to images/gifs
  media: string[];

  // URL to small image used for previews
  thumbnail: string;

  prices: Partial<PartyBoxEventPrice>[];
  ownerId: string;
  stripeProductId?: string;
  hashtags: string[];

  notifications?: PartyBoxEventNotification[];
}

export default PartyBoxEventInput;
