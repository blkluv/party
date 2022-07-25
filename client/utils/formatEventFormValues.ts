import dayjs from "dayjs";
import { EventFormData } from "~/types/EventFormInput";
import PartyBoxEvent from "~/types/PartyBoxEvent";
import PartyBoxEventNotification from "~/types/PartyBoxEventNotification";

const formatNotificationTime = (startTime: string, messageTime: string) => {
  const days = dayjs(startTime).diff(messageTime, "day");
  const hours = dayjs(startTime).subtract(days, "day").diff(messageTime, "hour");
  const minutes = dayjs(startTime).subtract(days, "day").subtract(hours, "hour").diff(messageTime, "minute");
  return { days: days.toString(), hours: hours.toString(), minutes: minutes.toString() };
};

const formatEventFormValues = (initialValues: {
  event: PartyBoxEvent;
  notifications: PartyBoxEventNotification[];
}): EventFormData => {
  const { name, description, startTime, endTime, location, maxTickets, hashtags, prices } = initialValues.event;
  return {
    name,
    description,
    hashtags,
    location,
    maxTickets: maxTickets.toString(),
    startTime: dayjs(startTime).subtract(dayjs().utcOffset(), "minutes").format("YYYY-MM-DDTHH:mm"),
    endTime: dayjs(endTime).subtract(dayjs().utcOffset(), "minutes").format("YYYY-MM-DDTHH:mm"),
    notifications: initialValues.notifications.map((e) => ({
      ...e,
      ...formatNotificationTime(initialValues.event.startTime, e.messageTime),
    })),
    prices: prices.map((e) => ({
      ...e,
      price: e.price.toString(),
    })),
  };
};

export default formatEventFormValues;
