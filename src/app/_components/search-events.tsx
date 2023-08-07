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

const getHoursUntil = (date: Date) =>
  Math.abs(dayjs(date).diff(dayjs(), "hour"));

export const EventTimer: FC<{ startTime: Date }> = (props) => {
  const [hoursUntil, setHoursUntil] = useState(0);

  const colour = useMemo(() => {
    if (hoursUntil >= 24) {
      return "text-green-500";
    } else if (hoursUntil >= 3) {
      return "text-yellow-500";
    }

    return "text-red-500";
  }, [hoursUntil]);

  useEffect(() => {
    setHoursUntil(getHoursUntil(props.startTime));
    const interval = setInterval(() => {
      setHoursUntil(getHoursUntil(props.startTime));
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [props.startTime]);

  return (
    <div className={cn(colour, "flex flex-row items-center gap-1")}>
      <ClockIcon className={cn("w-5 h-5")} />
      <p className="font-bold text-sm">{hoursUntil}h</p>
    </div>
  );
};
