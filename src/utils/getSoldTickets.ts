import { and, eq, sql } from "drizzle-orm";
import { getDb } from "~/db/client";
import { tickets } from "~/db/schema";

/**
 * SERVER ONLY. Gets the number of tickets sold for an event;
 * @param eventId
 * @returns
 */
export const getSoldTickets = async (eventId: string) => {
  const db = getDb();
  const { ticketsSold } = await db
    .select({ ticketsSold: sql<number>`count(*)` })
    .from(tickets)
    .where(and(eq(tickets.eventId, eventId), eq(tickets.status, "success")))
    .get();

  return ticketsSold;
};
