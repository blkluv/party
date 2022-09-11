import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { decodeJwt, getPostgresConnectionString, Role } from "@party-box/common";
import { PrismaClient } from "@party-box/prisma";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

interface Body {
  email: string;
  role: Role;
}

/**
 * @method GET
 * @description Get all user roles for a given host
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { hostId } = event.pathParameters as PathParameters;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const connectionString = await getPostgresConnectionString(stage);
  const prisma = new PrismaClient({ datasources: { db: { url: connectionString } } });

  try {
    if (!event.body) throw new Error("Missing body");
    const body = JSON.parse(event.body) as Body;

    // Verify that the requesting user has permission to view this host
    const { sub: userId } = decodeJwt(Authorization);
    if (!userId) throw new Error("Missing userId");

    const { role: userRoleOfHost } = await prisma.hostRole.findFirstOrThrow({
      where: { hostId: Number(hostId), userId },
      select: { role: true },
    });

    if (userRoleOfHost !== "manager" && userRoleOfHost !== "admin") {
      throw new Error(`Invalid role to update host. User has role: "${userRoleOfHost}"`);
    }

    const { id } = await prisma.user.findFirstOrThrow({ where: { email: body.email }, select: { id: true } });

    const newHostRole = await prisma.hostRole.create({
      data: {
        hostId: Number(hostId),
        userId: id,
        role: body.role,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(newHostRole),
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
