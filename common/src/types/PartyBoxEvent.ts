import PartyBoxEventPrice from "./PartyBoxEventPrice";

interface PartyBoxEvent {
  id: string;
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

  // URL to small image used for previews
  thumbnail: string;

  prices: PartyBoxEventPrice[];
  ownerId: string;
  stripeProductId: string;
  hashtags: string[];
}

export default PartyBoxEvent;
