import { currentUser } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { getDb } from "~/db/client";
import { eventRoles } from "~/db/schema";
import { isUserPlatformAdmin } from "./isUserPlatformAdmin";

/**
 * SERVER ONLY
 * @param eventId
 * @returns
 */
export const getUserEventRole = async (eventId: string) => {
  const user = await currentUser();

  if (!user?.id) {
    return null;
  }

  const db = getDb();

  // Platform admins are admins of all events
  if (await isUserPlatformAdmin(user)) {
    return "admin" as const;
  }

  const role = await db.query.eventRoles.findFirst({
    where: and(eq(eventRoles.eventId, eventId), eq(eventRoles.userId, user.id)),
    with: {
      event: {
        columns: {
          userId: true,
        },
      },
    },
  });

  if (role?.event.userId === user.id) {
    return "admin" as const;
  }

  return role?.role ?? null;
};
