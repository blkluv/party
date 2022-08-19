import dayjs from "dayjs";
import { EventFormData } from "~/types/EventFormInput";

const defaultEventData: EventFormData = {
  name: "",
  description: "",
  published: false,
  hostId: "",
  startTime: {
    minute: dayjs().minute().toString(),
    hour: (dayjs().hour() % 12).toString(),
    day: dayjs().date().toString(),
    month: dayjs().month().toString(),
    year: dayjs().year().toString(),
    modifier: dayjs().hour() >= 12 ? "PM" : "AM",
  },
  endTime: {
    minute: dayjs().minute().toString(),
    hour: (dayjs().hour() % 12).toString(),
    day: dayjs().date().toString(),
    month: dayjs().month().toString(),
    year: dayjs().year().toString(),
    modifier: dayjs().hour() >= 12 ? "PM" : "AM",
  },
  prices: [
    {
      name: "Regular",
      price: "10",
    },
  ],
  location: "TBD",
  maxTickets: "100",
  hashtags: [],
  notifications: [
    {
      days: "0",
      hours: "6",
      minutes: "0",
      message: "{name} starts in 6h. Location is {location}",
    },
    {
      days: "0",
      hours: "3",
      minutes: "0",
      message: "{name} starts in 3h. Location is {location}",
    },
    {
      days: "0",
      hours: "0",
      minutes: "0",
      message: "{name} starts now. Location is {location}",
    },
  ],
};

export default defaultEventData;
