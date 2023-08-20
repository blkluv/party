import dayjs from "dayjs";
import { match } from "ts-pattern";
import {
  MAX_EVENT_DURATION_HOURS,
  SHOW_CHAT_HOURS_THRESHOLD,
  SHOW_LOCATION_HOURS_THRESHOLD,
} from "~/config/constants";
import type { EventType } from "~/db/schema";

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

export const isChatVisible = (args: {
  startTime: Date;
  eventType: EventType;
}): boolean => {
  return (
    match(args.eventType)
      // Event chat rooms are visible as long as the event isn't over
      .with("event", () => !isEventOver(args.startTime))
      .with(
        "discussion",
        () =>
          dayjs()
            .add(SHOW_CHAT_HOURS_THRESHOLD, "hour")
            .isAfter(args.startTime) && !isEventOver(args.startTime)
      )
      .exhaustive()
  );
};
