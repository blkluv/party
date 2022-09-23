import * as z from "zod";

export const HostRoleModel = z.object({
  hostId: z.number().int(),
  userId: z.string(),
  role: z.string(),
});
