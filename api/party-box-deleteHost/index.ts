import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, decodeJwt, getS3Client, getPostgresConnectionString } from "@party-box/common";
import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { PrismaClient } from "@party-box/prisma";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  hostId: string;
}

/**
 * Update a host entity within Postgres
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;
  const { hostId } = event.pathParameters as PathParameters;

  const connectionString = await getPostgresConnectionString(stage);
  const prisma = new PrismaClient({ datasources: { db: { url: connectionString } } });

  const s3 = await getS3Client();
  const pg = await getPostgresClient(stage);

  try {
    const { sub: userId } = decodeJwt(Authorization, ["admin", "user"]);
    if (!userId) throw new Error("User ID missing.");

    // Check whether the user is an admin of the host.
    const { role: userRoleOfHost } = await prisma.hostRole.findFirstOrThrow({
      where: { hostId: Number(hostId), userId },
      select: { role: true },
    });

    if (userRoleOfHost !== "manager" && userRoleOfHost !== "admin") {
      throw new Error(`Invalid role to update host. User has role: "${userRoleOfHost}"`);
    }

    await prisma.hostRole.deleteMany({ where: { hostId: Number(hostId) } });
    await prisma.host.delete({ where: { id: Number(hostId) } });

    const objects = await s3.send(
      new ListObjectsV2Command({
        Bucket: "party-box-bucket",
        Prefix: `${stage}/${hostId}/`,
      })
    );

    if (objects.Contents && objects.Contents.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: "party-box-bucket",
          Delete: {
            Objects: objects.Contents.map(({ Key }) => ({ Key })),
          },
        })
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "Host deleted." }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  } finally {
    await pg.destroy();
  }
};
