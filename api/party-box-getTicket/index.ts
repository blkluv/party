import { APIGatewayProxyEventPathParameters, APIGatewayProxyHandler } from "aws-lambda";
import { getPostgresClient, getStripeClient, PartyBoxEvent, PartyBoxEventTicket } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
}

/**
 * @method POST
 * @description Retrieve ticket data from postgres and stripe given a session id (treated as ticketId)
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event);

  const { ticketId } = event.pathParameters as PathParameters;

  const { stage } = event.requestContext;
  const sql = await getPostgresClient(stage);

  const stripe = await getStripeClient(stage);

  try {
    const [ticketData] = await sql<PartyBoxEventTicket[]>`
      SELECT *
      FROM "tickets"
      WHERE "slug" = ${ticketId}
    `;
    if (!ticketData) throw new Error("Ticket not found");

    const [eventData] = await sql<PartyBoxEvent[]>`
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

    const response: PartyBoxEventTicket & { event: PartyBoxEvent } = {
      ...ticketData,
      status: "succeeded",
      event: eventData,
    };

    // If there is a price associated with this ticket
    if (ticketData.stripeSessionId) {
      const session = await stripe.checkout.sessions.retrieve(ticketData.stripeSessionId);
      const paymentIntent = await stripe.paymentIntents.retrieve(session?.payment_intent?.toString() ?? "");
      if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
        response.status = paymentIntent.status;
      } else {
        response.status = "failed";
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } finally {
    await sql.end();
  }
};
