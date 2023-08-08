import dayjs from "dayjs";
import { and, asc, eq, gte } from "drizzle-orm";
import { cache } from "react";
import { MAX_EVENT_DURATION_HOURS } from "~/config/constants";
import { getDb } from "~/db/client";
import { eventMedia, events } from "~/db/schema";

export const getUpcomingPublicEvents = cache(async () => {
  const db = getDb();
  const results = await db.query.events.findMany({
    where: and(
      eq(events.isPublic, true),
      eq(events.isFeatured, false),
      gte(
        events.startTime,
        dayjs().subtract(MAX_EVENT_DURATION_HOURS, "hours").toDate()
      )
    ),
    columns: {
      id: true,
      name: true,
      description: true,
      startTime: true,
      location: true,
    },
    with: {
      eventMedia: {
        where: eq(eventMedia.isPoster, true),
      },
    },
    orderBy: asc(events.startTime),
    limit: 25,
  });

  return results.map((e) => ({ ...e, imageUrl: e.eventMedia[0].url }));
});
