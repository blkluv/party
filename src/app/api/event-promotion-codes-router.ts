import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";

import { coupons, promotionCodes } from "~/db/schema";
import { createCoupon } from "~/utils/createCoupon";
import { createPromotionCodeFormSchema } from "~/utils/createPromotionCodeFormSchema";
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
    .input(createPromotionCodeFormSchema)
    .mutation(async ({ ctx, input }) => {
      const newCoupon = await createCoupon({
        data: {
          id: createId(),
          name: input.name,
          percentageDiscount: input.percentageDiscount,
        },
        userId: ctx.auth.userId,
        eventId: input.eventId,
        productId: ctx.event.stripeProductId,
      });

      const stripePromotionCode = await ctx.stripe.promotionCodes.create({
        coupon: newCoupon?.stripeCouponId,
        code: input.code,
      });

      const newPromotionCode = await ctx.db
        .insert(promotionCodes)
        .values({
          id: createId(),
          code: stripePromotionCode.code,
          couponId: newCoupon.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: ctx.auth.userId,
          eventId: input.eventId,
          name: "Promotion Code",
          stripePromotionCodeId: stripePromotionCode.id,
        })
        .returning()
        .get();

      return {
        promotionCode: newPromotionCode,
        coupon: newCoupon,
      };
    }),
});
