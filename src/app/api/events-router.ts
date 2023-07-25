import { gt } from "drizzle-orm";
import { db } from "~/db/client";
import { events } from "~/db/schema";
import { publicProcedure, router } from "./trpc/trpc-config";

export const eventsRouter = router({
  getAllEvents: publicProcedure.query(async () => {
    const foundEvents = await db.query.events.findMany({
      columns: {
        description: true,
        id: true,
        name: true,
        startTime: true,
      },
      where: gt(events.startTime, new Date()),
    });
    return foundEvents;
  }),
});
