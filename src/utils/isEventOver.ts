import dayjs from "dayjs";
import { MAX_EVENT_DURATION_HOURS } from "~/config/constants";

export const isEventOver = (startTime: Date) => {
  return dayjs(startTime)
    .add(MAX_EVENT_DURATION_HOURS, "hour")
    .isBefore(dayjs());
};
