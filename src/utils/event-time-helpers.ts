import dayjs from "dayjs";
import {
  MAX_EVENT_DURATION_HOURS,
  SHOW_CHAT_HOURS_THRESHOLD,
  SHOW_LOCATION_HOURS_THRESHOLD,
} from "~/config/constants";

export const isEventOver = (startTime: Date) => {
  return dayjs(startTime)
    .add(MAX_EVENT_DURATION_HOURS, "hour")
    .isBefore(dayjs());
};

export const isLocationVisible = (startTime: Date, hideLocation: boolean) => {
  return hideLocation
    ? dayjs().add(SHOW_LOCATION_HOURS_THRESHOLD, "hour").isAfter(startTime)
    : true;
};

export const isChatVisible = (startTime: Date) => {
  return (
    dayjs().add(SHOW_CHAT_HOURS_THRESHOLD, "hour").isAfter(startTime) &&
    !isEventOver(startTime)
  );
};
