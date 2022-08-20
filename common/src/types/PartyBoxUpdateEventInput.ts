import PartyBoxCreateNotificationInput from "./PartyBoxCreateNotificationInput";
import PartyBoxEventPrice from "./PartyBoxEventPrice";
import PartyBoxUpdateNotificationInput from "./PartyBoxUpdateNotificationInput";

interface PartyBoxUpdateEventInput {
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

  prices: PartyBoxEventPrice[];
  hashtags: string[];
  published: boolean;
  notifications?: (PartyBoxCreateNotificationInput | PartyBoxUpdateNotificationInput)[];
}

export default PartyBoxUpdateEventInput;
