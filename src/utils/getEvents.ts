import { and, eq, gt } from "drizzle-orm";
import { getDb } from "~/db/client";
import { eventMedia, events } from "~/db/schema";

export const getPublicEvents = async () => {
  const db = getDb();
  const foundEvents = await db.query.events.findMany({
    columns: {
      description: true,
      id: true,
      name: true,
      startTime: true,
      slug: true,
    },
    with: {
      eventMedia: {
        where: eq(eventMedia.isPoster, true),
      },
    },
    where: and(gt(events.startTime, new Date()), eq(events.isPublic, true)),
  });

  return foundEvents;
};
