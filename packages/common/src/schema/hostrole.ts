import * as z from "zod";
import { CompleteHost, CompleteUser } from "./index";

export const HostRoleModel = z.object({
  hostId: z.number().int(),
  userId: z.string(),
  role: z.string(),
});

export interface CompleteHostRole extends z.infer<typeof HostRoleModel> {
  host: CompleteHost;
  user: CompleteUser;
}

