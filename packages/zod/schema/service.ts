import * as z from "zod"

export const ServiceModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  price: z.number(),
})
