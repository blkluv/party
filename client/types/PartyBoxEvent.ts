export interface PartyBoxEvent {
  id: string;
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

  prices: Price[];
  ownerId: string;
  stripeProductId: string;
}

export interface Price {
  id: string;
  name: string;
  paymentLink: string;
  price: number;
}

export default PartyBoxEvent;
