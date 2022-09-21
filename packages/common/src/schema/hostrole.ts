import * as z from "zod";
import { CompleteHost, RelatedHostModel, CompleteUser, RelatedUserModel } from "./index";

export const HostRoleModel = z.object({
  hostId: z.number().int(),
  userId: z.string(),
  role: z.string(),
});

export interface CompleteHostRole extends z.infer<typeof HostRoleModel> {
  host: CompleteHost;
  user: CompleteUser;
}

export const RelatedHostRoleModel: z.ZodSchema<CompleteHostRole> = z.lazy(() =>
  HostRoleModel.extend({
    host: RelatedHostModel,
    user: RelatedUserModel,
  })
);

