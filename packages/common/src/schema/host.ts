import * as z from "zod";
import {
  CompleteEvent,
  RelatedEventModel,
  CompleteHostRole,
  RelatedHostRoleModel,
  CompleteUser,
  RelatedUserModel,
} from "./index";

export const HostModel = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullish(),
  createdBy: z.string(),
  imageUrl: z.string().nullish(),
});

export interface CompleteHost extends z.infer<typeof HostModel> {
  events: CompleteEvent[];
  hostRoles: CompleteHostRole[];
  creator: CompleteUser;
}

export const RelatedHostModel: z.ZodSchema<CompleteHost> = z.lazy(() =>
  HostModel.extend({
    events: RelatedEventModel.array(),
    hostRoles: RelatedHostRoleModel.array(),
    creator: RelatedUserModel,
  })
);

