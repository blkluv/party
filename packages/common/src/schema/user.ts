import * as z from "zod";

export const UserModel = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullish(),
  roles: z.string().array(),
});

