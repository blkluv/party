import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, PartyBoxEvent, PartyBoxHost } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method GET
 * @description Get event with given ID from Postgres
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { eventId } = event.pathParameters as PathParameters;
  const { stage } = event.requestContext;

  const sql = await getPostgresClient(stage);

  try {
    const [eventData] = await sql<PartyBoxEvent[]>`
      SELECT
        "id",
        "name",
        "description",
        "startTime",
        "endTime",
        "maxTickets",
        "media",
        "thumbnail",
        "prices",
        "hashtags",
        "hostId"
      FROM "events"
      WHERE "id" = ${Number(eventId)}
    `;

    console.info(`Found event: ${JSON.stringify(eventData)}`);

    const [hostData] = await sql<PartyBoxHost[]>`
      SELECT
        "id",
        "name",
        "description",
        "imageUrl"
      FROM "hosts"
      WHERE "id" = ${eventData.hostId}
    `;

    console.info(`Found host: ${JSON.stringify(hostData)}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...eventData,
        host: hostData,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
