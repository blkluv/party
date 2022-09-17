import { Sql } from "postgres";
import zod from "zod";

const verifyHostRoles = async (sql: Sql<Record<string, unknown>>, userId: string, hostId: number, roles: string[]) => {
  const schema = zod.object({
    role: zod.string(),
  });

  const [record] = await sql`
      select "role"
      from "hostRoles"
      where "hostId" = ${hostId}
      and "userId" = ${userId}`;

  const { role } = schema.parse(record);

  return roles.includes(role);
};

export default verifyHostRoles;
