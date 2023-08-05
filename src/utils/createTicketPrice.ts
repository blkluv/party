import { createId } from "@paralleldrive/cuid2";
import type { z } from "zod";
import { getDb } from "~/db/client";
import type { NewTicketPrice } from "~/db/schema";
import { ticketPrices } from "~/db/schema";
import type { createEventSchema } from "./createEventSchema";
import { getStripeClient } from "./stripe";

export const createTicketPrice = async (args: {
  data: z.infer<typeof createEventSchema>["ticketPrices"][number];
  eventId: string;
  userId: string;
  productId: string;
}) => {
  const db = getDb();
  const stripe = getStripeClient();
  const priceData: NewTicketPrice = {
    id: createId(),
    eventId: args.eventId,
    name: args.data.name,
    price: args.data.price,
    isFree: args.data.isFree,
    userId: args.userId,
  };

  // Not free, must create a Stripe price to accept payment
  if (!args.data.isFree) {
    const newPrice = await stripe.prices.create({
      product: args.productId,
      currency: "CAD",
      nickname: args.data.name,
      unit_amount: args.data.price * 100,
    });

    priceData.stripePriceId = newPrice.id;
  }

  const p = await db.insert(ticketPrices).values(priceData).returning().get();

  return p;
};
