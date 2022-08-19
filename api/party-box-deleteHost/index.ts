import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import {
  getPostgresClient,
  decodeJwt,
  PartyBoxHost,
  verifyHostRoles,
  getS3Client,
  PartyBoxHostRole,
} from "@party-box/common";
import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

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

  const s3 = await getS3Client();
  const pg = await getPostgresClient(stage);

  try {
    const { sub: userId } = decodeJwt(Authorization, ["admin", "user"]);
    if (!userId) throw new Error("User ID missing.");

    // Check whether the user is an admin of the host.
    const validRole = await verifyHostRoles(pg, userId, Number(hostId), ["admin"]);
    if (!validRole) throw new Error("User is not permitted to update this host.");

    await pg<PartyBoxHostRole>("hostRoles").where("hostId", "=", Number(hostId)).del();
    await pg<PartyBoxHost>("hosts").where("id", "=", Number(hostId)).del();

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
