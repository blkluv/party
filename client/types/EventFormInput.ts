export interface EventFormData {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxTickets: string;
  hashtags: string[];
  notifications: {
    days: string;
    hours: string;
    minutes: string;
    message: string;
  }[];
  prices: {
    id?: string;
    name: string;
    paymentLink?: string;
    paymentLinkId?: string;
    price: string;
  }[];
}
