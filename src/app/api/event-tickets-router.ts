import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { tickets } from "~/db/schema";
import { createTicketPurchaseUrl } from "~/utils/createTicketPurchaseUrl";
import { refreshTicketStatus } from "~/utils/refreshTicketStatus";
import { ticketScansRouter } from "./ticket-scans-router";
import {
  managerEventProcedure,
  protectedProcedure,
  router,
} from "./trpc/trpc-config";

export const eventTicketsRouter = router({
  createTicketPurchaseUrl: protectedProcedure
    .input(
      z.object({
        ticketPriceId: z.string(),
        promotionCode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const url = await createTicketPurchaseUrl({
          userId: ctx.auth.userId,
          ticketPriceId: input.ticketPriceId,
          promotionCode: input.promotionCode,
        });

        return url;
      } catch (e) {
        if (e instanceof Error) {
          throw new TRPCError({ code: "BAD_REQUEST", message: e.message });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unknown error",
        });
      }
    }),
  getAllTickets: managerEventProcedure
    .input(
      z.object({
        filters: z.object({ scanned: z.boolean().optional() }).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const foundTickets = await ctx.db.query.tickets.findMany({
        where: and(
          eq(tickets.eventId, input.eventId),
          eq(tickets.status, "success")
        ),
        with: {
          scans: true,
        },
      });

      console.log(`Found ${foundTickets.length} ticket rows`);

      const userIds = Array.from(new Set(foundTickets.map((e) => e.userId)));

      console.log(`Found ${userIds.length} unique users`);

      const users = (
        await clerkClient.users.getUserList({
          userId: userIds,
          limit: 500,
        })
      ).map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
      }));

      console.log(`Found ${users.length} users for the ticket rows`);

      // type TicketWithUser = (typeof foundTickets)[number] & {
      //   user: Pick<User, "id" | "firstName" | "lastName">;
      // };

      const ticketsWithUser = foundTickets
        .map((e) => ({
          ...e,
          user: users.find((u) => u.id === e.userId) ?? {
            id: e.userId,
            firstName: "Unknown",
            lastName: "User",
          },
        }))
        .filter((e) => {
          const isTicketScanned = e.scans.length > 0;

          if (
            input.filters?.scanned !== undefined &&
            isTicketScanned !== input.filters.scanned
          ) {
            return false;
          }

          return true;
        })
        .sort((a, b) =>
          `${a.user.firstName} ${a.user.lastName}`.localeCompare(
            `${b.user.firstName} ${b.user.lastName}`
          )
        );

      return ticketsWithUser;
    }),
  refundTicket: managerEventProcedure
    .input(z.object({ ticketId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ticketData = await ctx.db.query.tickets.findFirst({
        where: and(
          eq(tickets.id, input.ticketId),
          eq(tickets.eventId, input.eventId),
          eq(tickets.status, "success")
        ),
      });

      if (!ticketData) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ticket not found",
        });
      } else if (!ticketData.stripeSessionId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ticket is missing Stripe checkout session ID",
        });
      }

      const session = await ctx.stripe.checkout.sessions.retrieve(
        ticketData.stripeSessionId
      );

      const paymentIntentId = session.payment_intent;

      if (!paymentIntentId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payment intent ID not found",
        });
      } else if (typeof paymentIntentId !== "string") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Payment intent ID is not string",
        });
      }

      const refund = await ctx.stripe.refunds.create({
        payment_intent: paymentIntentId,
        reason: "requested_by_customer",
      });

      if (!refund) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Stripe refund unsuccessful",
        });
      }

      const refundedTicket = await ctx.db
        .update(tickets)
        .set({ status: "refunded" })
        .where(
          and(
            eq(tickets.id, input.ticketId),
            eq(tickets.eventId, input.eventId),
            eq(tickets.status, "success")
          )
        )
        .returning()
        .get();

      return refundedTicket;
    }),
  sync: managerEventProcedure.mutation(async ({ ctx, input }) => {
    const pendingTickets = await ctx.db.query.tickets.findMany({
      where: and(
        eq(tickets.eventId, input.eventId),
        eq(tickets.status, "pending")
      ),
      with: {
        price: true,
      },
    });

    await Promise.all(pendingTickets.map((t) => refreshTicketStatus(t)));

    return {};
  }),

  scans: ticketScansRouter,
});
