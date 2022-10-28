import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, decodeJwt, verifyHostRoles, PartyBoxEventTicket, PartyBoxEvent } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
}

interface Body {
  value: boolean;
}

/**
 * @method POST
 * @description Create ticket within DynamoDB and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { stage } = event.requestContext;
  const { value } = JSON.parse(event.body ?? "{}") as Body;
  const { ticketId: stripeSessionId } = event.pathParameters as PathParameters;
  const { Authorization } = event.headers;

  const sql = await getPostgresClient(stage);

  try {
    const { sub: userId } = decodeJwt(Authorization, ["admin"]);
    if (!userId) throw new Error("Missing user id (sub) in JWT");

    // Temporary type to define the data we get back from the query below
    type TicketData = Pick<PartyBoxEventTicket, "used"> & Pick<PartyBoxEvent, "hostId">;

    // Get existing event data so we can verify host permissions
    const [{ hostId, used }] = await sql<TicketData[]>`
      SELECT 
        "events"."hostId", 
        "tickets"."used"
      FROM "tickets"
      WHERE "stripeSessionId" = ${stripeSessionId}
      INNER JOIN 
        "events" ON "tickets"."eventId" = "events"."id"
    `;

    // Check permissions
    const validRole = await verifyHostRoles(sql, userId, hostId, ["admin", "manager"]);
    if (!validRole) throw new Error("User is not authorized to update ticket usage");

    // Don't update ticket if we're just going to set it to the same value
    if (used !== value) {
      await sql`
      UPDATE "tickets"
      SET ${sql({ used: value })}
      WHERE "stripeSessionId" = ${stripeSessionId}
    `;
    }

    return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error }) };
  }finally{
    await sql.end();
  }
};
