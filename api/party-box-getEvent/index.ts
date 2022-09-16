import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresConnectionString } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method GET
 * @description Get event with given ID from Postgres
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { eventId } = event.pathParameters as PathParameters;
  const { stage } = event.requestContext;

  const prisma = new PrismaClient({ datasources: { db: { url: await getPostgresConnectionString(stage) } } });
  await prisma.$connect();

  try {
    const eventData = await prisma.event.findFirstOrThrow({
      where: { id: Number(eventId) },
      select: {
        startTime: true,
        endTime: true,
        id: true,
        name: true,
        description: true,
        media: true,
        prices: true,
        hostId: true,
        thumbnail: true,
        hashtags: true,
      },
    });

    const hostData = await prisma.host.findFirstOrThrow({
      where: { id: Number(eventData.hostId) },
      select: { name: true, imageUrl: true, description: true, id: true },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ...eventData, host: hostData }),
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
