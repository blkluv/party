import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
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
      where: eq(tickets.eventId, input.eventId),
    });

    return foundTickets;
  }),
});
