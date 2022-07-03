import { APIGatewayEvent, APIGatewayProxyResultV2, APIGatewayProxyEventPathParameters } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
  console.log(event);
  const secretsManager = new AWS.SecretsManager({ region: "us-east-1" });

  try {
    const { eventId } = event.pathParameters as PathParameters;

    // const headers = event.headers;

    // Get access keys for S3 login
    const { SecretString: s3SecretString } = await secretsManager.getSecretValue({ SecretId: "party-box/access-keys" });
    if (!s3SecretString) throw new Error("Access keys string was undefined.");
    const { accessKeyId, secretAccessKey } = JSON.parse(s3SecretString);

    const s3 = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const uploadKey = `events/${eventId}/${uuid()}.jpg`;

    const command = new PutObjectCommand({
      Bucket: "party-box-bucket",
      Key: uploadKey,
      ContentType: "multipart/form-data",
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 120 });

    return { uploadUrl, downloadUrl: `https://party-box-bucket.s3.us-east-1.amazonaws.com/${uploadKey}` };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
