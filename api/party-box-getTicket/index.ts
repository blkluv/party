import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, getStripeClient, PartyBoxEvent, PartyBoxEventTicket } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
}

/**
 * @method POST
 * @description Retrieve ticket data from postgres and stripe given a session id (treated as ticketId)
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  const { ticketId } = event.pathParameters as PathParameters;

  const { stage } = event.requestContext;

  const pg = await getPostgresClient(stage);
  const stripe = await getStripeClient(stage);

  try {
    const [ticketData] = await pg<PartyBoxEventTicket>("tickets").where("id", Number(ticketId));
    const [eventData] = await pg<PartyBoxEvent>("events")
      .select("name", "description", "id", "startTime", "endTime", "hashtags")
      .where("id", ticketData.eventId);

    const session = await stripe.checkout.sessions.retrieve(ticketId);
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
      body: JSON.stringify({ error }),
    };
  } finally {
    await pg.destroy();
  }
};
