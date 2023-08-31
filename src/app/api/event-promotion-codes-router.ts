import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";

import { z } from "zod";
import { promotionCodes } from "~/db/schema";
import { createPromotionCodeFormSchema } from "~/utils/createPromotionCodeFormSchema";
import {
  adminEventProcedure,
  managerEventProcedure,
  router,
} from "./trpc/trpc-config";
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
        maxUses: true,
      },
    });
  }),
  createPromotionCode: adminEventProcedure
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
          name: input.name,
          stripePromotionCodeId: stripePromotionCode.id,
          percentageDiscount: input.percentageDiscount,
        })
        .returning()
        .get();

      return newPromotionCode;
    }),
  updatePromotionCode: managerEventProcedure
    .input(
      z.object({
        promotionCodeId: z.string(),
        data: createPromotionCodeFormSchema.pick({ maxUses: true, name: true }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedPromotionCode = await ctx.db
        .update(promotionCodes)
        .set({
          updatedAt: new Date(),
          name: input.data.name,
          maxUses: input.data.maxUses,
        })
        .where(
          and(
            eq(promotionCodes.id, input.promotionCodeId),
            eq(promotionCodes.eventId, input.eventId),
            ctx.eventRole === "admin"
              ? undefined
              : eq(promotionCodes.userId, ctx.auth.userId)
          )
        )
        .returning()
        .get();

      return updatedPromotionCode;
    }),
  deletePromotionCode: managerEventProcedure
    .input(z.object({ promotionCodeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Make sure this user owns the promo code or is an admin when we're deleting
      const deletedPromotionCode = await ctx.db
        .delete(promotionCodes)
        .where(
          and(
            eq(promotionCodes.id, input.promotionCodeId),
            ctx.eventRole === "admin"
              ? undefined
              : eq(promotionCodes.userId, ctx.auth.userId)
          )
        )
        .returning()
        .get();

      if (deletedPromotionCode?.stripeCouponId) {
        await ctx.stripe.coupons.del(deletedPromotionCode?.stripeCouponId);
      }

      return deletedPromotionCode;
    }),
});
