import type { User } from "@clerk/nextjs/server";
import type { EventRole } from "~/db/schema";
import { getUser } from "./getUser";
import { getUserEventRole } from "./getUserEventRole";

type PermissionResource =
  | "PROMOTION_CODES"
  | "EVENTS"
  | "EVENT_ROLES"
  | "DISCUSSION"
  | "TICKETS";
type PermissionOperation =
  | "CREATE"
  | "DELETE"
  | "UPDATE"
  | "READ"
  | "SCAN"
  | "JOIN";

type PermissionValue = `${PermissionResource}_${PermissionOperation}`;

const adminPermissions: PermissionValue[] = [
  "PROMOTION_CODES_CREATE",
  "PROMOTION_CODES_DELETE",
  "PROMOTION_CODES_UPDATE",
];
const managerPermissions: PermissionValue[] = [
  "PROMOTION_CODES_READ",
  "TICKETS_READ",
  "TICKETS_SCAN",
  "DISCUSSION_JOIN",
];
const promoterPermissions: PermissionValue[] = [];

const permissions: Record<EventRole["role"], Set<PermissionValue>> = {
  admin: new Set([
    ...adminPermissions,
    ...managerPermissions,
    ...promoterPermissions,
  ]),
  manager: new Set([...managerPermissions, ...promoterPermissions]),
  promoter: new Set([...promoterPermissions]),
};

const isUserPlatformAdmin = async (
  args: { userId: string | null } | { user: User | null }
) => {
  let user: User | null;

  if ("user" in args) {
    if (!args.user) {
      return false;
    }

    user = args.user;
  } else {
    if (!args.userId) {
      return false;
    }

    user = await getUser(args.userId);
  }

  if (user?.publicMetadata.platformRole === "admin") {
    return true;
  }
};

/**
 * SERVER ONLY
 * @param args
 * @returns
 */
export const isUserAllowed = async (
  args: {
    action: PermissionValue | PermissionValue[];
    eventId?: string;
  } & ({ userId: string | null } | { user: User | null })
) => {
  // Valiates against the platform
  if (
    await isUserPlatformAdmin(
      "userId" in args ? { userId: args.userId } : { user: args.user }
    )
  ) {
    return true;
  }

  // Validates against the event
  if (args.eventId) {
    const role = await getUserEventRole(args.eventId);
    return isRoleAllowed(role, args.action);
  }

  return false;
};

export const isRoleAllowed = (
  role: EventRole["role"] | null,
  action: PermissionValue | PermissionValue[]
): role is NonNullable<typeof role> => {
  if (!role) {
    return false;
  }

  if (Array.isArray(action)) {
    return action.every((v) => permissions[role].has(v));
  }

  return permissions[role].has(action);
};
