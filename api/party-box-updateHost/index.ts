import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, decodeJwt, PartyBoxHost, PartyBoxHostRole } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

/**
 * Update a host entity within Postgres
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;
  const { hostId } = event.pathParameters as PathParameters;

  const pg = await getPostgresClient(stage);

  try {
    if (!event.body) throw new Error("Missing event body");

    const { name, description, imageUrl } = JSON.parse(event.body);

    const { sub: userId } = decodeJwt(Authorization, ["admin", "user"]);

    // Check whether the user is an admin/manager of the host.
    const hostRole = await pg<PartyBoxHostRole>("hostRoles")
      .select("role")
      .where([["hostId", "=", hostId], ["userId", "=", userId]]).first();

    if (!hostRole) throw Error("Couldn't find host role record.");

    if (hostRole.role !== "admin" && hostRole.role !== "manager") throw new Error("User is not permitted to update this host.");

    const [newHostData] = await pg<PartyBoxHost>("hosts")
      .insert({
        name,
        description,
        imageUrl
      })
      .returning("*");

    return {
      statusCode: 200,
      body: JSON.stringify(newHostData),
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
