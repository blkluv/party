import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresClient, PartyBoxHostRole, PartyBoxUser, Role, verifyHostRoles } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

interface Body {
  email: string;
  role: Role;
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
    if (!event.body) throw new Error("Missing body");
    const body = JSON.parse(event.body) as Body;

    // Verify that the requesting user has permission to view this host
    const { sub: userId } = decodeJwt(Authorization);

    if (!userId) throw new Error("Missing userId");

    const validRole = await verifyHostRoles(pg, userId, Number(hostId), ["admin", "manager"]);

    if (!validRole) throw new Error("User does not have permission to get roles for this host");

    const userData = await pg<PartyBoxUser>("users").select("id").where("email", "=", body.email).first();

    if (!userData) throw new Error("User does not exist");

    const hostUsers = await pg<PartyBoxHostRole>("hostRoles")
      .insert({
        hostId: Number(hostId),
        userId: userData.id,
        role: body.role,
      })
      .returning("*");

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
