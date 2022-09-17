import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, PartyBoxEvent } from "@party-box/common";

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
        "hashtags"
      FROM events
      INNER JOIN "hosts" ON "hosts"."id" = "events"."hostId"
      WHERE "events"."id" = ${Number(eventId)}
    `;

    // const hostData = await prisma.host.findFirstOrThrow({
    //   where: { id: Number(eventData.hostId) },
    //   select: { name: true, imageUrl: true, description: true, id: true },
    // });

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...eventData,
        // host: hostData
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
