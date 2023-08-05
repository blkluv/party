import { z } from "zod";
import { selectEventSchema } from "~/db/schema";

export const usersIndexSchema = z.object({ id: z.string() });
export type UsersIndexDocument = z.infer<typeof usersIndexSchema>;

export const eventsIndexSchema = selectEventSchema
  .pick({
    id: true,
    name: true,
    description: true,
    capacity: true,
    userId: true,
  })
  .extend({ startTime: z.string() });

export type EventsIndexDocument = z.infer<typeof eventsIndexSchema>;

export const MEILISEARCH_INDEXES = {
  development: {
    users: { name: "users_dev", schema: usersIndexSchema },
    events: { name: "events_dev", schema: eventsIndexSchema },
  },
  test: {
    users: { name: "users_dev", schema: usersIndexSchema },
    events: { name: "events_dev", schema: eventsIndexSchema },
  },
  production: {
    users: { name: "users_prod", schema: usersIndexSchema },
    events: { name: "events_prod", schema: eventsIndexSchema },
  },
}[process.env.NODE_ENV];
