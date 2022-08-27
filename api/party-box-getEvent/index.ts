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

  const pg = await getPostgresClient(stage);

  try {
    const [eventData] = await pg<PartyBoxEvent>("events")
      .select("id", "startTime", "endTime", "name", "description", "hashtags", "thumbnail", "media", "prices", "hostId")
      .where("id", "=", Number(eventId));

    if (!eventData) throw new Error("Event not found");

    const [hostData] = await pg<PartyBoxHost>("hosts").select("name", "imageUrl", "id", "description").where("id", "=", Number(eventData.hostId));

    if (!hostData) throw new Error("Host not found");

    return {
      statusCode: 200,
      body: JSON.stringify({ ...eventData, host: hostData }),
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
