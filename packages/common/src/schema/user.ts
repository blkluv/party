import * as z from "zod";
import { PartyBoxEventTicket } from "../types";
import { CompleteHostRole, CompleteHost } from "./index";

export const UserModel = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullish(),
  roles: z.string().array(),
});

export interface CompleteUser extends z.infer<typeof UserModel> {
  hostRoles: CompleteHostRole[];
  tickets: PartyBoxEventTicket[];
  hosts: CompleteHost[];
}

