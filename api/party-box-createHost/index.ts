import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresConnectionString } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

/**
 * Create a host entity within Postgres and add the creator as an admin
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const connectionString = await getPostgresConnectionString(stage);
  const prisma = new PrismaClient({ datasources: { db: { url: connectionString } } });
  await prisma.$connect();

  try {
    if (!event.body) throw new Error("Missing event body");

    const { name, description } = JSON.parse(event.body);

    const { sub: userId } = decodeJwt(Authorization, ["host"]);
    if (!userId) throw new Error("Missing userId");

    const newHostData = await prisma.host.create({
      data: {
        name,
        description,
        createdBy: userId,
      },
    });

    await prisma.hostRole.create({
      data: {
        hostId: newHostData.id,
        userId,
        role: "admin",
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(newHostData),
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
