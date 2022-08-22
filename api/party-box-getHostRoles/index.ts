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

  const pg = await getPostgresClient(stage);

  try {
    // Verify that the requesting user has permission to view this host
    const { sub: userId } = decodeJwt(Authorization, ["host"]);

    if (!userId) throw new Error("Missing userId");

    const validRole = await verifyHostRoles(pg, userId, Number(hostId), ["admin", "manager"]);

    if (!validRole) throw new Error("User does not have permission to get roles for this host");

    const hostUsers = await pg<PartyBoxHostRole>("hostRoles")
      .select("hostRoles.role", "users.id", "users.email", "users.name")
      .where("hostId", "=", Number(hostId))
      .innerJoin<PartyBoxUser>("users", "hostRoles.userId", "users.id");

    return {
      statusCode: 200,
      body: JSON.stringify(hostUsers),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } finally {
    await pg.destroy();
  }
};
