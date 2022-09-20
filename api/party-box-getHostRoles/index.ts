import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresClient, PartyBoxHostRole, PartyBoxUser, verifyHostRoles } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

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
    // Verify that the requesting user has permission to view this host
    const { sub: userId } = decodeJwt(Authorization);
    if (!userId) throw new Error("Missing userId");

    const validRole = await verifyHostRoles(sql, userId, Number(hostId), ["admin", "manager"]);

    if (!validRole) {
      throw new Error(`Invalid role to update host."`);
    }

    const users = await sql<(Pick<PartyBoxHostRole, "role"> & PartyBoxUser)[]>`
      SELECT 
        "hostRoles"."role",
        "users"."id",
        "users"."name",
        "users"."email"
      FROM "hostRoles"
      INNER JOIN 
        "users" ON "users"."id" = "hostRoles"."userId"
      WHERE 
        "hostRoles"."hostId" = ${Number(hostId)}
      `;

    return {
      body: JSON.stringify(users),
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
