import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresConnectionString } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

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

  const prisma = new PrismaClient({ datasources: { db: { url: await getPostgresConnectionString(stage) } } });
  await prisma.$connect();

  try {
    decodeJwt(Authorization, ["admin"]);

    const eventData = await prisma.event.findFirstOrThrow({ where: { id: Number(eventId) } });
    const notificationData = await prisma.eventNotification.findMany({ where: { eventId: Number(eventId) } });

    return {
      statusCode: 200,
      body: JSON.stringify({ ...eventData, notifications: notificationData }),
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
