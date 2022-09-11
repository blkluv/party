import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresConnectionString } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

/**
 * @method GET
 * @description Returns all event services
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { stage } = event.requestContext;

  const prisma = new PrismaClient({ datasources: { db: { url: await getPostgresConnectionString(stage) } } });

  try {
    const eventServices = await prisma.service.findMany();

    return { statusCode: 200, body: JSON.stringify(eventServices) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await prisma.$disconnect();
  }
};
