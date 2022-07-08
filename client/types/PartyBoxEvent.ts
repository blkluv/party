export interface PartyBoxEvent {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  max_tickets: number;
  owner_id: string;
  stripe_product_id: string;
  poster_url: string;
  data: null;
  ticket_price: null;
  thumbnail_url: string;
  prices: Price[];
}

export interface Price {
  id: string;
  name: string;
  payment_link: string;
}

export default PartyBoxEvent;
