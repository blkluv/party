import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import superjson from "superjson";
import { z } from "zod";
import type { EVENT_ROLES, EventRole } from "~/db/schema";
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
      const event = await ctx.db.query.events.findFirst({
        where: eq(events.id, input.eventId),
        with: {
          roles: {
            where: eq(eventRoles.userId, ctx.auth.userId),
          },
        },
      });

      if (!event) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This event does not exist",
        });
      }

      const role: EventRole | undefined = event.roles[0];

      // User must be event admin or event owner
      if (event.userId !== ctx.auth.userId) {
        if (!role || !allowedRoles.includes(role.role)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "You are not allowed to perform this operation on this event.",
          });
        }
      }

      return next({
        ctx: {
          ...ctx,
          event,
          eventRole: role ? { ...role, role: "admin" as const } : null,
        },
      });
    });

export const adminEventProcedure = roleProtectedEventProcedure(["admin"]);
export const managerEventProcedure = roleProtectedEventProcedure([
  "admin",
  "manager",
]);
