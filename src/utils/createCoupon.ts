import { createId } from "@paralleldrive/cuid2";
import type { z } from "zod";
import { getDb } from "~/db/client";
import { coupons } from "~/db/schema";
import type { createEventSchema } from "./createEventSchema";
import { getStripeClient } from "./stripe";

export const createCoupon = async (args: {
  data: z.infer<typeof createEventSchema>["coupons"][number];
  eventId: string;
  userId: string;
  productId: string;
}) => {
  const stripe = getStripeClient();
  const db = getDb();

  const stripeCoupon = await stripe.coupons.create({
    currency: "CAD",
    name: args.data.name,
    percent_off: args.data.percentageDiscount,
    applies_to: {
      products: [args.productId],
    },
  });

  const coupon = await db
    .insert(coupons)
    .values({
      id: createId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      eventId: args.eventId,
      name: args.data.name,
      percentageDiscount: args.data.percentageDiscount,
      stripeCouponId: stripeCoupon.id,
      userId: args.userId,
    })
    .returning()
    .get();

  return coupon;
};
