import { getPostgresClient, PartyBoxEvent } from "@party-box/common";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { stage } = event.requestContext;
  const pg = await getPostgresClient(stage);
  try {
    const events = await pg<PartyBoxEvent>("events")
      .select("id","startTime", "endTime", "name", "description", "hashtags", "maxTickets", "thumbnail")
      .where("published", "=", true)
      .andWhere("startTime", ">", new Date().toISOString());

    return { statusCode: 200, body: JSON.stringify(events) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await pg.destroy();
  }
};
