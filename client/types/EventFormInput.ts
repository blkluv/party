interface EventFormInput {
  name: string;
  description: string;
  start_time: string;
  end_time?: string;
  location: string;
  max_tickets: number;
  ticket_price: number;
  poster: {
    name: string;
    type: string;
    alt_text: string;
    data: Buffer;
  };
}

export default EventFormInput;
