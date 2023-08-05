import dayjs from "dayjs";
import {
  MAX_EVENT_DURATION_HOURS,
  SHOW_LOCATION_HOURS_THRESHOLD,
} from "~/config/constants";

export const isEventOver = (startTime: Date) => {
  return dayjs(startTime)
    .add(MAX_EVENT_DURATION_HOURS, "hour")
    .isBefore(dayjs());
};

export const isLocationVisible = (startTime: Date) => {
  return dayjs().add(SHOW_LOCATION_HOURS_THRESHOLD, "hour").isAfter(startTime);
};
