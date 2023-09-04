import dayjs from "dayjs";
import { eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { MAX_EVENT_DURATION_HOURS } from "~/config/constants";
import { getDb } from "~/db/client";
import { events, tickets } from "~/db/schema";
import { refreshTicketStatus } from "~/utils/refreshTicketStatus";

export const GET = async () => {
  const db = getDb();

  // Get all upcoming events
  const foundEvents = await db.query.events.findMany({
    columns: {
      id: true,
    },
    where: gte(
      events.startTime,
      dayjs().subtract(MAX_EVENT_DURATION_HOURS, "hours").toDate()
    ),
    with: {
      tickets: {
        where: eq(tickets.status, "pending"),
        with: {
          price: true,
        },
      },
    },
  });

  // Refresh all tickets with status pending.
  for (const e of foundEvents) {
    for (const t of e.tickets) {
      const isRefreshed = await refreshTicketStatus(t);
      if (isRefreshed) {
        console.log(
          `Updated ticket id="${t.id}" to status="${isRefreshed.status}"`
        );
      }
    }
  }

  return NextResponse.json({});
};
