"use client";

import { ClockIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "~/utils/shadcn-ui";

export const EventSearchInput = () => {
  return (
    <input
      className="px-4 py-2 text-lg rounded-full bg-black text-white ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mx-auto w-full max-w-lg"
      placeholder="Search for events"
    />
  );
};

const getTimeUntil = (date: Date) => {
  const hours = dayjs(date).diff(dayjs(), "hour");

  if (hours <= 0) {
    const mins = dayjs(date).diff(dayjs(), "minute");

    if (mins <= 0) {
      return {
        label: "Now" as const,
        value: null,
      };
    }

    return {
      label: "m",
      value: mins,
    };
  }

  if (hours === 0) {
    return {
      label: "m" as const,
      value: dayjs(date).diff(dayjs(), "minute"),
    };
  }

  return { label: "h" as const, value: hours };
};

export const EventTimer: FC<{ startTime: Date }> = (props) => {
  const [timeUntil, setTimeUntil] = useState<ReturnType<typeof getTimeUntil>>({
    value: 0,
    label: "h",
  });

  const colour = useMemo(() => {
    if (timeUntil.label === "h") {
      if (timeUntil.value >= 24) {
        return "text-green-500";
      } else if (timeUntil.value >= 3) {
        return "text-yellow-500";
      }
    }

    return "text-red-500";
  }, [timeUntil]);

  useEffect(() => {
    setTimeUntil(getTimeUntil(props.startTime));
    const interval = setInterval(() => {
      setTimeUntil(getTimeUntil(props.startTime));
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [props.startTime]);

  return (
    <div className={cn(colour, "flex flex-row items-center gap-1")}>
      <ClockIcon className={cn("w-5 h-5")} />
      <p className="font-bold text-sm tabular-nums w-8">
        {timeUntil.value}
        {timeUntil.label}
      </p>
    </div>
  );
};
