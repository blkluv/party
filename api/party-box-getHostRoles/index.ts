import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresConnectionString } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

/**
 * @method GET
 * @description Get all user roles for a given host
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { hostId } = event.pathParameters as PathParameters;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const prisma = new PrismaClient({ datasources: { db: { url: await getPostgresConnectionString(stage) } } });
  await prisma.$connect();

  try {
    // Verify that the requesting user has permission to view this host
    const { sub: userId } = decodeJwt(Authorization, ["host"]);

    if (!userId) throw new Error("Missing userId");

    const { role: userRoleOfHost } = await prisma.hostRole.findFirstOrThrow({
      where: { hostId: Number(hostId), userId },
      select: { role: true },
    });

    if (userRoleOfHost !== "manager" && userRoleOfHost !== "admin") {
      throw new Error(`Invalid role to update host. User has role: "${userRoleOfHost}"`);
    }

    const hostUsers = await prisma.hostRole.findMany({
      select: { role: true, user: { select: { id: true, email: true, name: true } } },
      where: { hostId: Number(hostId) },
    });

    return {
      body: JSON.stringify(hostUsers.map((e) => ({ ...e, ...e.user }))),
      statusCode: 200,
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
