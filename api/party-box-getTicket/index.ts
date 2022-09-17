import { APIGatewayProxyEventPathParameters, APIGatewayProxyHandler } from "aws-lambda";
import { getPostgresClient, getStripeClient } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
}

/**
 * @method POST
 * @description Retrieve ticket data from postgres and stripe given a session id (treated as ticketId)
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event);

  const { ticketId: stripeSessionId } = event.pathParameters as PathParameters;

  const { stage } = event.requestContext;
  const sql = await getPostgresClient(stage);

  const stripe = await getStripeClient(stage);

  try {
    const [ticketData] = await sql`
      SELECT *
      FROM "tickets"
      WHERE "stripeSessionId" = ${stripeSessionId}
    `;
    if (!ticketData) throw new Error("Ticket not found");

    const [eventData] = await sql`
      SELECT ${sql([
        "id",
        "name",
        "description",
        "startTime",
        "endTime",
        "published",
        "thumbnail",
        "hashtags",
        "maxTickets",
      ])}
      FROM "events"
      WHERE "id" = ${ticketData.eventId}
    `;

    if (!eventData) throw new Error("Event not found");

    const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
    const paymentIntent = await stripe.paymentIntents.retrieve(session?.payment_intent?.toString() ?? "");

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...ticketData,
        status: paymentIntent?.status ?? "pending",
        event: eventData,
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
