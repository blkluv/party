import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import {
  coupons,
  insertPromotionCodeSchema,
  promotionCodes,
} from "~/db/schema";
import { managerEventProcedure, router } from "./trpc/trpc-config";
export const eventPromotionCodesRouter = router({
  getAllCoupons: managerEventProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.query.coupons.findMany({
      where: eq(coupons.eventId, input.eventId),
      columns: {
        id: true,
        name: true,
        percentageDiscount: true,
        updatedAt: true,
      },
    });
  }),
  getAllPromotionCodes: managerEventProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.query.promotionCodes.findMany({
      where: and(eq(promotionCodes.eventId, input.eventId)),
      columns: {
        id: true,
        code: true,
        couponId: true,
        createdAt: true,
      },
      with: {
        coupon: {
          columns: {
            percentageDiscount: true,
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
    });
  }),
  createPromotionCode: managerEventProcedure
    .input(
      insertPromotionCodeSchema.pick({
        couponId: true,
        code: true,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const foundCoupon = await ctx.db.query.coupons.findFirst({
        where: and(eq(coupons.id, input.couponId)),
      });

      if (!foundCoupon) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Coupon does not exist",
        });
      }

      const newPromotionCode = await ctx.stripe.promotionCodes.create({
        coupon: foundCoupon?.stripeCouponId,
        code: input.code,
      });

      return await ctx.db
        .insert(promotionCodes)
        .values({
          id: createId(),
          code: newPromotionCode.code,
          couponId: input.couponId,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: ctx.auth.userId,
          eventId: input.eventId,
          name: "Promotion Code",
          stripePromotionCodeId: newPromotionCode.id,
        })
        .returning()
        .get();
    }),
});
