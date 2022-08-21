import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, decodeJwt, PartyBoxHost, PartyBoxHostRole } from "@party-box/common";

/**
 * Create a host entity within Postgres and add the creator as an admin
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const pg = await getPostgresClient(stage);

  try {
    if (!event.body) throw new Error("Missing event body");

    const { name, description } = JSON.parse(event.body);

    const { sub: userId } = decodeJwt(Authorization, ["host"]);

    const [newHostData] = await pg<PartyBoxHost>("hosts")
      .insert({
        name,
        description,
        createdBy: userId,
      })
      .returning("*");

    await pg<PartyBoxHostRole>("hostRoles").insert({
      hostId: newHostData.id,
      userId,
      role: "admin",
    });

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
