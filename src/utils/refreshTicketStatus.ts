import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "~/db/client";
import type { Ticket, TicketPrice } from "~/db/schema";
import { tickets } from "~/db/schema";
import { getStripeClient } from "./stripe";

const paymentValidationSchema = z
  .object({ status: z.literal("succeeded") })
  .strip();

type Data = Pick<
  Ticket,
  "stripeSessionId" | "quantity" | "status" | "eventId" | "id"
> & { price: Pick<TicketPrice, "isFree"> };

export const refreshTicketStatus = async <T extends Data>(ticketData: T) => {
  const stripe = getStripeClient();
  const db = getDb();
  // Update status of ticket if pending
  if (ticketData.status === "pending" && ticketData.price.isFree === false) {
    if (!ticketData.stripeSessionId) {
      return undefined;
    }

    const session = await stripe.checkout.sessions.retrieve(
      ticketData.stripeSessionId,
      {
        expand: ["payment_intent", "line_items"],
      }
    );

    const paymentIntentStatus = paymentValidationSchema.safeParse(
      session.payment_intent
    );

    const ticketLineItem = session.line_items?.data[0];

    if (paymentIntentStatus.success && ticketLineItem?.quantity) {
      await db
        .update(tickets)
        .set({ status: "success", quantity: ticketLineItem.quantity })
        .where(eq(tickets.id, ticketData.id))
        .run();

      return { quantity: ticketLineItem.quantity, status: "success" as const };
    }
  }
};
