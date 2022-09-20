import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import dayjs from "dayjs";
import { getPostgresClient } from "@party-box/common";

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { stage } = event.requestContext;
  const sql = await getPostgresClient(stage);

  try {
    const lastStartTime = dayjs().add(6, "hour").toISOString();

    const records = await sql`
      select "id","name","description","startTime","endTime","published","thumbnail","hashtags","maxTickets"
      from events 
      where "startTime" > ${lastStartTime} 
      order by "startTime" asc 
      limit 10;
    `;
    
    return { statusCode: 200, body: JSON.stringify(records) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
