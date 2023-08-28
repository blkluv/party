"use client";

import type { FC } from "react";
import { trpc } from "~/utils/trpc";

export const TicketScansList: FC<{ ticketId: string; eventId: string }> = (
  props
) => {
  const { data: scans = [] } =
    trpc.events.tickets.scans.getAllTicketScans.useQuery({
      eventId: props.eventId,
      ticketId: props.ticketId,
    });

  return (
    <div>
      {scans.map((e) => (
        <div key={e.id}>{e.id}</div>
      ))}
    </div>
  );
};
