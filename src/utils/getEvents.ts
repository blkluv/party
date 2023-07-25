import { and, eq, gt } from "drizzle-orm";
import { db } from "~/db/client";
import { eventMedia, events } from "~/db/schema";

export const getPublicEvents = async () => {
  const foundEvents = await db.query.events.findMany({
    columns: {
      description: true,
      id: true,
      name: true,
      startTime: true,
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
