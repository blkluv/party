import { z } from "zod";

export const createPromotionCodeFormSchema = z.object({
  name: z.string().min(3, { message: "Min " }),
  code: z.string().min(3, { message: "Code must be longer than 3 characters" }),
  percentageDiscount: z.coerce.number(),
});
