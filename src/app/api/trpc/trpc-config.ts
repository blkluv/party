import { initTRPC, TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import superjson from "superjson";
import { z } from "zod";
import type { EVENT_ROLES } from "~/db/schema";
import { eventRoles, events } from "~/db/schema";
import { isUserPlatformAdmin } from "~/utils/isUserPlatformAdmin";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

// check if the user is signed in, otherwise throw a UNAUTHORIZED CODE
const isAuthed = t.middleware(async ({ next, ctx }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      isPlatformAdmin: await isUserPlatformAdmin(),
      auth: ctx.auth,
    },
  });
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);

// Throws if the requesting user is not an admin of the event or the event does not exist
export const roleProtectedEventProcedure = (
  allowedRoles: (typeof EVENT_ROLES)[number][]
) =>
  protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .use(async ({ ctx, next, input }) => {
      const [event, role] = await Promise.all([
        ctx.db.query.events.findFirst({
          where: eq(events.id, input.eventId),
        }),
        ctx.db.query.eventRoles.findFirst({
          columns: {
            role: true,
          },
          where: and(
            eq(eventRoles.eventId, input.eventId),
            eq(eventRoles.userId, ctx.auth.userId)
          ),
        }),
      ]);

      if (!event) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This event does not exist",
        });
      }

      let eventRole = role?.role;
      // Is the event owner or platform admin. Override any set roles
      const hasRoleOverride =
        event.userId === ctx.auth.userId || ctx.isPlatformAdmin;

      if (hasRoleOverride) {
        eventRole = "admin";
      } else if (!eventRole || !allowedRoles.includes(eventRole)) {
        // Role not found or role not allowed for this procedure
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You are not allowed to perform this operation on this event.",
        });
      }

      return next({
        ctx: {
          ...ctx,
          event,
          eventRole,
        },
      });
    });

export const adminEventProcedure = roleProtectedEventProcedure(["admin"]);
export const managerEventProcedure = roleProtectedEventProcedure([
  "admin",
  "manager",
]);
