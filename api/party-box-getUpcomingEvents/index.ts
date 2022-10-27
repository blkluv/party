import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import dayjs from "dayjs";
import { getPostgresClient } from "@party-box/common";

/**
 * @method POST
 * @description Get all events with a timestamp greater than the current time
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { stage } = event.requestContext;
  const sql = await getPostgresClient(stage);

  try {
    const latestStartTime = dayjs().add(6, "hour").toDate();
    const now = dayjs().toDate();

    // Get events that have yet to begin or have begun within the past 6 hours
    const records = await sql`
      select "id","name","description","startTime","endTime","thumbnail","hashtags","maxTickets"
      from events 
      where "startTime" > ${now} and "startTime" < ${latestStartTime} 
      and "published" = true
      order by "startTime" asc 
      limit 10;
    `;

    return { statusCode: 200, body: JSON.stringify(records) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  }finally{
    await sql.end();
  }
};
