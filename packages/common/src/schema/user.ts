import * as z from "zod";
import {
  CompleteHostRole,
  RelatedHostRoleModel,
  CompleteTicket,
  RelatedTicketModel,
  CompleteHost,
  RelatedHostModel,
} from "./index";

export const UserModel = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullish(),
  roles: z.string().array(),
});

export interface CompleteUser extends z.infer<typeof UserModel> {
  hostRoles: CompleteHostRole[];
  tickets: CompleteTicket[];
  hosts: CompleteHost[];
}

export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() =>
  UserModel.extend({
    hostRoles: RelatedHostRoleModel.array(),
    tickets: RelatedTicketModel.array(),
    hosts: RelatedHostModel.array(),
  })
);

