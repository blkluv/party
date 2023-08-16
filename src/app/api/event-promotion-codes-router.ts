import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";

import { promotionCodes } from "~/db/schema";
import { createPromotionCodeFormSchema } from "~/utils/createPromotionCodeFormSchema";
import { managerEventProcedure, router } from "./trpc/trpc-config";
export const eventPromotionCodesRouter = router({
  getAllPromotionCodes: managerEventProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.query.promotionCodes.findMany({
      where: and(
        eq(promotionCodes.eventId, input.eventId),
        ctx.eventRole !== "admin"
          ? eq(promotionCodes.userId, ctx.auth.userId)
          : undefined
      ),
      columns: {
        id: true,
        code: true,
        createdAt: true,
        percentageDiscount: true,
        name: true,
      },
    });
  }),
  createPromotionCode: managerEventProcedure
    .input(createPromotionCodeFormSchema)
    .mutation(async ({ ctx, input }) => {
      const stripeCoupon = await ctx.stripe.coupons.create({
        currency: "CAD",
        name: input.name,
        percent_off: input.percentageDiscount,
        applies_to: {
          products: [ctx.event.stripeProductId],
        },
      });

      const stripePromotionCode = await ctx.stripe.promotionCodes.create({
        coupon: stripeCoupon.id,
        code: input.code,
      });

      const newPromotionCode = await ctx.db
        .insert(promotionCodes)
        .values({
          id: createId(),
          code: stripePromotionCode.code,
          stripeCouponId: stripeCoupon.id,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: ctx.auth.userId,
          eventId: input.eventId,
          name: "Promotion Code",
          stripePromotionCodeId: stripePromotionCode.id,
          percentageDiscount: input.percentageDiscount,
        })
        .returning()
        .get();

      return newPromotionCode;
    }),
});
