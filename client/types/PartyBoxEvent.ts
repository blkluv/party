export interface PartyBoxEvent {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxTickets: number;
  ownerId: string;
  stripeProductId: string;
  media: string[];
  ticketPrice: null;
  thumbnail: string;
  prices: Price[];
}

export interface Price {
  id: string;
  name: string;
  paymentLink: string;
}

export default PartyBoxEvent;
