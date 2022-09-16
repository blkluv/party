import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, PartyBoxCreateServiceInput, getPostgresConnectionString } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

/**
 * @method POST
 * @description Create a new event service
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { name, description, price, imageUrl } = JSON.parse(event.body ?? "{}") as PartyBoxCreateServiceInput;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const connectionString = await getPostgresConnectionString(stage);
  const prisma = new PrismaClient({ datasources: { db: { url: connectionString } } });
  await prisma.$connect();

  try {
    const { sub } = decodeJwt(Authorization, ["admin"]);
    if (!sub) throw new Error("Missing sub");

    const newServiceData = await prisma.service.create({ data: { name, description, price, imageUrl } });

    return { statusCode: 201, body: JSON.stringify(newServiceData) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await prisma.$disconnect();
  }
};
