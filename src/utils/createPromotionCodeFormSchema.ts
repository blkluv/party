import { insertPromotionCodeSchema } from "~/db/schema";

export const createPromotionCodeFormSchema = insertPromotionCodeSchema.pick({
  code: true,
  maxUses: true,
  percentageDiscount: true,
  name: true,
});
