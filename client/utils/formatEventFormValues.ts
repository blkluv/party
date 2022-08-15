import dayjs from "dayjs";
import { EventFormData } from "~/types/EventFormInput";
import { PartyBoxEvent } from "@party-box/common";

const formatNotificationTime = (startTime: string, messageTime: string) => {
  const days = dayjs(startTime).diff(messageTime, "day");
  const hours = dayjs(startTime).subtract(days, "day").diff(messageTime, "hour");
  const minutes = dayjs(startTime).subtract(days, "day").subtract(hours, "hour").diff(messageTime, "minute");
  return { days: days.toString(), hours: hours.toString(), minutes: minutes.toString() };
};

const formatEventFormValues = (initialValues: PartyBoxEvent): EventFormData => {
  const { name, description, startTime, endTime, location, maxTickets, hashtags, prices, notifications, hostId, published } =
    initialValues;
  return {
    name,
    description,
    hashtags,
    location,
    hostId,
    published,
    maxTickets: maxTickets.toString(),
    startTime: {
      day: dayjs(startTime).date().toString(),
      hour: (dayjs(startTime).hour() % 12).toString(),
      minute: dayjs(startTime).minute().toString(),
      month: dayjs(startTime).month().toString(),
      year: dayjs(startTime).year().toString(),
      modifier: dayjs(startTime).hour() >= 12 ? "PM" : "AM",
    },
    endTime: {
      day: dayjs(endTime).date().toString(),
      hour: (dayjs(endTime).hour() % 12).toString(),
      minute: dayjs(endTime).minute().toString(),
      month: dayjs(endTime).month().toString(),
      year: dayjs(endTime).year().toString(),
      modifier: dayjs(endTime).hour() >= 12 ? "PM" : "AM",
    },
    notifications: notifications.map((e) => ({
      ...e,
      ...formatNotificationTime(initialValues.startTime, e.messageTime),
    })),
    prices: prices.map((e) => ({
      ...e,
      price: e.price.toString(),
    })),
  };
};

export default formatEventFormValues;
