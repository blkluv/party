import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { decodeJwt, getPostgresClient, getS3Client } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  serviceId: string;
}

interface Body {
  name: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { stage } = event.requestContext;
  const { serviceId } = event.pathParameters as PathParameters;
  const { name } = JSON.parse(event.body ?? "{}") as Body;
  const { Authorization } = event.headers;
  const pg = await getPostgresClient(stage);

  try {
    const { sub: userId } = decodeJwt(Authorization);
    if (!userId) throw new Error("Missing userId");

    const s3 = await getS3Client();
    const uploadKey = `${stage}/services/${serviceId}/${uuid()}-${name}`;

    const command = new PutObjectCommand({
      Bucket: "party-box-bucket",
      Key: uploadKey,
      ContentType: "multipart/form-data",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 120 });

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl,
        downloadUrl: `https://party-box-bucket.s3.us-east-1.amazonaws.com/${uploadKey}`,
      }),
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await pg.destroy();
  }
};