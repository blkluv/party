import { Sql } from "postgres";

const verifyHostRoles = async (sql: Sql<Record<string, unknown>>, userId: string, hostId: number, roles: string[]) => {
  const [record] = await sql<{ role: string }[]>`
      select 
        "role"
      from  "hostRoles"
      where 
        "hostId" = ${hostId}
      and 
        "userId" = ${userId}`;

  const { role } = record;

  return roles.includes(role);
};

export default verifyHostRoles;
