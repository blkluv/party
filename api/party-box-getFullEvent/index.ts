import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresClient, PartyBoxEvent, PartyBoxEventPrice, verifyHostRoles } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method GET
 * @description Get event with given ID from Postgres
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { eventId } = event.pathParameters as PathParameters;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const sql = await getPostgresClient(stage);

  try {
    const { sub: userId } = decodeJwt(Authorization);
    if (!userId) throw new Error("Missing userId");

    const [eventData] = await sql<PartyBoxEvent[]>`
      select * from "events" 
      where "id" = ${Number(eventId)}
    `;

    const validRole = await verifyHostRoles(sql, userId, eventData.hostId, ["admin", "manager"]);
    if (!validRole) throw new Error("Invalid role");

    const notificationData = await sql`
      select * from "eventNotifications" 
      where "eventId" = ${Number(eventId)}
    `;

    const priceData = await sql<PartyBoxEventPrice[]>`
      SELECT *
      FROM "ticketPrices"
      WHERE "eventId" = ${eventData.id}
    `;

    console.info(`Found prices: ${JSON.stringify(priceData)}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ ...eventData, notifications: notificationData, prices: priceData }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
