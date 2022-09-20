import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, PartyBoxEvent, PartyBoxHost } from "@party-box/common";

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

  const sql = await getPostgresClient(stage);

  try {
    const [hostData] = await sql<PartyBoxHost[]>`
      SELECT * 
      FROM "hosts"
      WHERE "id" = ${Number(hostId)}
    `;

    if (!hostData) throw new Error("Host not found");

    console.info(`Found host: ${JSON.stringify(hostData)}`);

    const events = await sql<PartyBoxEvent[]>`
      select "id","name","description","startTime","endTime","published","thumbnail","hashtags","maxTickets"
      from "events"
      where "hostId" = ${Number(hostId)}
      order by "startTime" desc
    `;

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
  }
};
