import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, decodeJwt, PartyBoxHost, PartyBoxHostRole } from "@party-box/common";

/**
 * Get hosts that a user has relationships with
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const pg = await getPostgresClient(stage);

  try {
    const { sub: userId } = decodeJwt(Authorization, ["admin", "user"]);

    if (!userId) throw new Error("Missing userId");

    const [hosts] = await pg<PartyBoxHostRole>("hostRoles")
      .select("*")
      .where("userId", "=", userId)
      .innerJoin<PartyBoxHost>("hosts", "hostRoles.hostId", "hosts.id");

    return {
      statusCode: 200,
      body: JSON.stringify(hosts),
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