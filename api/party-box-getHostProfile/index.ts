import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, PartyBoxEvent, decodeJwt, PartyBoxHost } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

/**
 * @method GET
 * @description Get event with given ID from Postgres
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { hostId } = event.pathParameters as PathParameters;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const pg = await getPostgresClient(stage);

  try {
    decodeJwt(Authorization, ["admin"]);

    const [hostData] = await pg<PartyBoxHost>("hosts").select("*").where("id", "=", Number(hostId));
    const events = await pg<PartyBoxEvent>("events").select("*").where("hostId", "=", Number(hostId));

    return {
      statusCode: 200,
      body: JSON.stringify({ ...hostData, events }),
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
