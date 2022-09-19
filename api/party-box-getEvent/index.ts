import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import {
  getPostgresClient,
  PartyBoxEvent,
  PartyBoxEventPrice,
  PartyBoxHost,
  RelatedEventModel,
} from "@party-box/common";

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

    const priceData = await sql<PartyBoxEventPrice[]>`
      SELECT *
      FROM "ticketPrices"
      WHERE "eventId" = ${eventData.id}
    `;

    console.info(`Found prices: ${JSON.stringify(priceData)}`);

    // Validate response
    const response = RelatedEventModel.parse({
      ...eventData,
      tisketPrices: priceData,
      host: hostData,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
