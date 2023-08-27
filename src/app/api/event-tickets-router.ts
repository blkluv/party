import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import type { Ticket } from "~/db/schema";
import { tickets } from "~/db/schema";
import { createTicketPurchaseUrl } from "~/utils/createTicketPurchaseUrl";
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
  getAllTickets: managerEventProcedure.query(async ({ ctx, input }) => {
    const foundTickets = await ctx.db.query.tickets.findMany({
      where: and(
        eq(tickets.eventId, input.eventId),
        eq(tickets.status, "success")
      ),
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: foundTickets.map((e) => e.userId),
      })
    ).map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName }));

    return foundTickets
      .map((e) => ({
        ...e,
        user: users.find((u) => u.id === e.userId),
      }))
      .filter(
        (
          e
        ): e is Ticket & {
          user: Pick<User, "id" | "firstName" | "lastName">;
        } => Boolean(e.user)
      )
      .sort((a, b) =>
        `${a.user.firstName} ${a.user.lastName}`.localeCompare(
          `${b.user.firstName} ${b.user.lastName}`
        )
      );
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
});
