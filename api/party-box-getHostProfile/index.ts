import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresConnectionString } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

/**
 * @method GET
 * @description Get event with given ID from Postgres
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { hostId } = event.pathParameters as PathParameters;
  const { stage } = event.requestContext;

  const prisma = new PrismaClient({ datasources: { db: { url: await getPostgresConnectionString(stage) } } });
  await prisma.$connect();

  try {
    const hostData = await prisma.host.findFirstOrThrow({ where: { id: Number(hostId) } });
    const events = await prisma.event.findMany({ where: { hostId: Number(hostId) } });

    return {
      statusCode: 200,
      body: JSON.stringify({ ...hostData, events }),
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
