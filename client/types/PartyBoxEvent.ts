export interface PartyBoxEvent {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxTickets: number;
  ownerId: string;
  stripeProductId: string;
  posterUrl: string;
  ticketPrice: null;
  thumbnailUrl: string;
  prices: Price[];
}

export interface Price {
  id: string;
  name: string;
  paymentLink: string;
}

export default PartyBoxEvent;
