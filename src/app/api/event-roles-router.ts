import { clerkClient } from "@clerk/nextjs";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { and, eq, not } from "drizzle-orm";
import { z } from "zod";
import { EVENT_ROLES, eventRoles } from "~/db/schema";
import {
  adminEventProcedure,
  protectedProcedure,
  router,
} from "./trpc/trpc-config";

export const eventRolesRouter = router({
  createEventRole: adminEventProcedure
    .input(z.object({ userId: z.string(), role: z.enum(EVENT_ROLES) }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.auth.userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot modify own permissions",
        });
      }

      const newRole = await ctx.db
        .insert(eventRoles)
        .values({
          ...input,
          id: createId(),
          updatedAt: new Date(),
          createdAt: new Date(),
        })
        .returning()
        .get();

      return newRole;
    }),
  getAllEventRoles: adminEventProcedure.query(async ({ ctx, input }) => {
    const roles = await ctx.db.query.eventRoles.findMany({
      where: and(
        eq(eventRoles.eventId, input.eventId),
        not(eq(eventRoles.userId, ctx.auth.userId))
      ),
    });

    const users = await clerkClient.users.getUserList({
      userId: roles.map((e) => e.userId),
    });

    return roles.map((e) => {
      const user = users.find((u) => u.id === e.userId);

      return {
        ...e,
        userName: `${user?.firstName} ${user?.lastName}`,
        userImageUrl: user?.imageUrl ?? "",
      };
    });
  }),
  updateEventRole: adminEventProcedure
    .input(z.object({ roleId: z.string(), role: z.enum(EVENT_ROLES) }))
    .mutation(async ({ ctx, input }) => {
      const updatedRole = await ctx.db
        .update(eventRoles)
        .set({ role: input.role })
        .where(eq(eventRoles.id, input.roleId))
        .returning()
        .get();

      return updatedRole;
    }),
  deleteRole: adminEventProcedure
    .input(z.object({ roleId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.eventRole !== "admin") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You're not allowed to do this",
        });
      }
      const deletedRole = await ctx.db
        .delete(eventRoles)
        .where(eq(eventRoles.id, input.roleId))
        .returning()
        .get();

      return deletedRole;
    }),
  getUserEventRole: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      const role = await ctx.db.query.eventRoles.findFirst({
        where: and(
          eq(eventRoles.eventId, input.eventId),
          eq(eventRoles.userId, ctx.auth.userId)
        ),
        with: {
          event: {
            columns: {
              userId: true,
            },
          },
        },
      });

      if (role?.event.userId === ctx.auth.userId) {
        return "admin" as const;
      }

      return role?.role;
    }),
});
