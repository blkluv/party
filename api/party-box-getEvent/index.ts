import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, PartyBoxEvent } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method GET
 * @description Get event with given ID from DynamoDB
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { eventId } = event.pathParameters as PathParameters;
  const { stage } = event.requestContext;
  const pg = await getPostgresClient(stage);
  try {
    const [eventData] = await pg<PartyBoxEvent>("events")
      .select("id", "startTime", "endTime", "name", "description", "hashtags", "thumbnail", "media", "prices")
      .where("id", "=", Number(eventId));

    if (!eventData) throw new Error("Event not found");

    return {
      statusCode: 200,
      body: JSON.stringify(eventData),
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
