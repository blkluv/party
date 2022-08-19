import { Knex } from "knex";
import { PartyBoxHostRole, Role } from "../types";

const verifyHostRoles = async (client: Knex, userId: string, hostId: number, roles: Role[]) => {
  const hostRole = await client<PartyBoxHostRole>("hostRoles")
    .select("role")
    .where([["hostId", "=", hostId], ["userId", "=", userId]]).first();

  if (!hostRole) return false;

  return roles.includes(hostRole.role);
};

export default verifyHostRoles;