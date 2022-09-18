import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresClient, PartyBoxHostRole, Role, verifyHostRoles } from "@party-box/common";
import zod from "zod";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

const bodySchema = zod.object({
  email: zod.string(),
  role: zod.enum(["admin", "manager", "user"]),
});

/**
 * @method GET
 * @description Get all user roles for a given host
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { hostId } = event.pathParameters as PathParameters;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const sql = await getPostgresClient(stage);

  try {
    if (!event.body) throw new Error("Missing body");
    const body = bodySchema.parse(event.body);

    // Verify that the requesting user has permission to view this host
    const { sub: userId } = decodeJwt(Authorization);
    if (!userId) throw new Error("Missing userId");

    const validRole = await verifyHostRoles(sql, userId, Number(hostId), ["admin", "manager"]);
    if (!validRole) throw new Error("User is not permitted to update this host");

    const [{ id }] = await sql`
      SELECT "id" FROM "users" WHERE "email" = ${body.email}
    `;

    const [newHostRole] = await sql<PartyBoxHostRole[]>`
      INSERT INTO "hostRoles" ${sql({
        hostId: Number(hostId),
        userId: Number(id),
        role: body.role,
      })}
    `;

    return {
      statusCode: 200,
      body: JSON.stringify(newHostRole),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } finally {
    await sql.end();
  }
};
