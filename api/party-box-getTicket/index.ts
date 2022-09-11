import { APIGatewayProxyEventPathParameters, APIGatewayProxyHandler } from "aws-lambda";
import { getPostgresConnectionString, getStripeClient } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

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
  const prisma = new PrismaClient({ datasources: { db: { url: await getPostgresConnectionString(stage) } } });
  await prisma.$connect();

  const stripe = await getStripeClient(stage);

  try {
    const ticketData = await prisma.ticket.findFirstOrThrow({ where: { stripeSessionId } });
    const eventData = await prisma.event.findFirstOrThrow({
      where: { id: ticketData.eventId },
      select: { name: true, description: true, id: true, startTime: true, endTime: true, hashtags: true },
    });

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
  } finally {
    await prisma.$disconnect();
  }
};
