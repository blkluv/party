import FormDateValues from "./FormDateValues";

export interface EventFormData {
  name: string;
  description: string;
  startTime: FormDateValues;
  endTime: FormDateValues;
  location: string;
  hostId: string;
  maxTickets: string;
  hashtags: string[];
  notifications: {
    id?: number;
    days: string;
    hours: string;
    minutes: string;
    message: string;
  }[];
  prices: {
    id?: number;
    name: string;
    paymentLink?: string;
    paymentLinkId?: string;
    price: string;
  }[];
  published: boolean;
}
