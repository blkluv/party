import { getPostgresConnectionString } from "@party-box/common";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import dayjs from "dayjs";
import { PrismaClient } from "@party-box/prisma";

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { stage } = event.requestContext;
  const db = await getPostgresConnectionString(stage);
  const prisma = new PrismaClient({ datasources: { db: { url: db } } });
  await prisma.$connect();
  try {
    const events = await prisma.event.findMany({
      where: {
        startTime: {
          lte: dayjs().add(6, "hour").toISOString(),
        },
        published: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        startTime: true,
        endTime: true,
        published: true,
        hashtags: true,
        thumbnail: true,
        maxTickets: true,
      },
    });

    return { statusCode: 200, body: JSON.stringify(events) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await prisma.$disconnect();
  }
};
