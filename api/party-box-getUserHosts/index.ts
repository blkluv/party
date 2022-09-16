import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresConnectionString } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

/**
 * Get hosts that a user has relationships with
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const prisma = new PrismaClient({ datasources: { db: { url: await getPostgresConnectionString(stage) } } });
  await prisma.$connect();

  try {
    const { sub: userId } = decodeJwt(Authorization);

    if (!userId) throw new Error("Missing userId");

    const hosts = await prisma.hostRole.findMany({
      where: {
        userId,
      },
      select: {
        role: true,
        host: {
          select: {
            name: true,
            description: true,
            imageUrl: true,
            id: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(hosts.map(({ host, role }) => ({ ...host, role }))),
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
