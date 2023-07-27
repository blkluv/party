"use client";

import Link from "next/link";
import { FC } from "react";
import { getPublicEvents } from "~/utils/getEvents";

export const EventsList: FC<{
  events: Awaited<ReturnType<typeof getPublicEvents>>;
}> = (props) => {
  return (
    <div>
      {props.events.map((e) => (
        <Link key={e.id} href={`/events/${e.slug}`}>
          {e.name}
        </Link>
      ))}
    </div>
  );
};
