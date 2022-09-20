import * as z from "zod"

export const ArtistModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  price: z.number().int(),
  phoneNumber: z.string().nullish(),
  email: z.string().nullish(),
  website: z.string().nullish(),
  genres: z.string().array(),
})
