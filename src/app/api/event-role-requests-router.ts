import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import type { EventRoleRequest } from "~/db/schema";
import {
  eventRoleRequests,
  eventRoles,
  selectEventRoleRequestSchema,
} from "~/db/schema";
import {
  adminEventProcedure,
  protectedProcedure,
  router,
} from "./trpc/trpc-config";

export const eventRoleRequestsRouter = router({
  createEventRoleRequest: protectedProcedure
    .input(z.object({ eventId: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingRequest = await ctx.db.query.eventRoleRequests.findFirst({
        where: and(
          eq(eventRoleRequests.userId, ctx.auth.userId),
          eq(eventRoleRequests.eventId, input.eventId)
        ),
      });

      if (existingRequest) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This user already has a pending request",
        });
      }

      const newEventRoleRequest = await ctx.db
        .insert(eventRoleRequests)
        .values({
          userId: ctx.auth.userId,
          message: input.message,
          eventId: input.eventId,
          createdAt: new Date(),
          requestedRole: "manager",
          status: "pending",
        });

      return newEventRoleRequest;
    }),
  updateRequestStatus: adminEventProcedure
    .input(
      selectEventRoleRequestSchema.pick({
        status: true,
        userId: true,
        id: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const foundRequest = await ctx.db.query.eventRoleRequests.findFirst({
        where: and(
          eq(eventRoleRequests.userId, input.userId),
          eq(eventRoleRequests.eventId, input.eventId),
          eq(eventRoleRequests.id, input.id)
        ),
      });

      if (!foundRequest) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Request does not exist",
        });
      }

      const updatedRoleRequest = await ctx.db
        .update(eventRoleRequests)
        .set({
          status: input.status,
        })
        .where(
          and(
            eq(eventRoleRequests.userId, input.userId),
            eq(eventRoleRequests.eventId, input.eventId),
            eq(eventRoleRequests.id, input.id)
          )
        )
        .returning()
        .get();

      if (input.status === "approved") {
        // Assign role
        await ctx.db.insert(eventRoles).values({
          role: updatedRoleRequest.requestedRole,
          createdAt: new Date(),
          eventId: input.eventId,
          userId: input.userId,
          updatedAt: new Date(),
        });
      }

      return updatedRoleRequest;
    }),
  getRoleRequest: protectedProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      // We only expect a user to have one request for a given event
      const foundRequest = await ctx.db.query.eventRoleRequests.findFirst({
        where: and(
          eq(eventRoleRequests.userId, ctx.auth.userId),
          eq(eventRoleRequests.eventId, input.eventId)
        ),
      });

      if (!foundRequest) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Request does not exist",
        });
      }

      return foundRequest;
    }),
  getAllEventRoleRequests: adminEventProcedure.query(async ({ ctx, input }) => {
    const requests = await ctx.db.query.eventRoleRequests.findMany({
      where: eq(eventRoleRequests.eventId, input.eventId),
    });

    const users = await clerkClient.users.getUserList({
      userId: requests.map((e) => e.userId),
    });

    return requests
      .map((e) => ({
        ...e,
        user: users.find((u) => u.id === e.userId),
      }))
      .filter(
        (
          e
        ): e is EventRoleRequest & {
          user: User;
        } => Boolean(e.user)
      );
  }),
});
