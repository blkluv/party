import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { TicketScan } from "~/db/schema";
import { ticketScans } from "~/db/schema";
import { managerEventProcedure, router } from "./trpc/trpc-config";

export const ticketScansRouter = router({
  createTicketScan: managerEventProcedure
    .input(z.object({ ticketId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newTicketScan = await ctx.db
        .insert(ticketScans)
        .values({
          ticketId: input.ticketId,
          eventId: input.eventId,
          createdAt: new Date(),
          userId: ctx.auth.userId,
        })
        .returning()
        .get();

      return newTicketScan;
    }),
  deleteScan: managerEventProcedure
    .input(z.object({ ticketId: z.string(), ticketScanId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedTicketScan = await ctx.db
        .delete(ticketScans)
        .where(
          and(
            eq(ticketScans.ticketId, input.ticketId),
            eq(ticketScans.eventId, input.eventId),
            eq(ticketScans.id, input.ticketScanId)
          )
        )
        .returning()
        .get();

      return deletedTicketScan;
    }),
  getAllTicketScans: managerEventProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      const scans = await ctx.db.query.ticketScans.findMany({
        where: and(
          eq(ticketScans.ticketId, input.ticketId),
          eq(ticketScans.eventId, input.eventId)
        ),
        orderBy: desc(ticketScans.createdAt),
      });

      const users = await clerkClient.users.getUserList({
        userId: scans.map((e) => e.userId),
      });

      return scans
        .map((e) => ({
          ...e,
          user: users.find((u) => u.id === e.userId),
        }))
        .filter(
          (
            e
          ): e is TicketScan & {
            user: User;
          } => Boolean(e.user)
        );
    }),
});
