import { Sql } from "postgres";

const verifyHostRoles = async (sql: Sql<Record<string, unknown>>, userId: string, hostId: number, roles: string[]) => {
  
  const [record] = await sql`
      select "role"
      from "hostRoles"
      where "hostId" = ${hostId}
      and "userId" = ${userId}`;

  if (!record) return false;

  const { role }= record;

  return roles.includes(role);
};

export default verifyHostRoles;
