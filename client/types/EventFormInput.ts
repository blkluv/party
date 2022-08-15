export interface EventFormData {
  name: string;
  description: string;
  startTime: EventFormDate;
  endTime: EventFormDate;
  location: string;
  hostId: string;
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
  published: boolean;
}

export interface EventFormDate {
  day: string;
  month: string;
  year: string;
  minute: string;
  hour: string;
  modifier: "AM" | "PM";
}
