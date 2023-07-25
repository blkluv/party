"use client";

import { FC } from "react";
import { getPublicEvents } from "~/utils/getEvents";

export const EventsList: FC<{
  events: Awaited<ReturnType<typeof getPublicEvents>>;
}> = (props) => {
  return (
    <div>
      {props.events.map((e) => (
        <p key={e.id}>{e.name}</p>
      ))}
    </div>
  );
};
