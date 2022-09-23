import * as z from "zod";

export const HostModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullish(),
  createdBy: z.string(),
  imageUrl: z.string().nullish(),
});

