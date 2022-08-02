import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { decodeJwt } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
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

  const secretsManager = new SecretsManager({});
  const { stage } = event.requestContext;
  const { eventId } = event.pathParameters as PathParameters;
  const { name } = JSON.parse(event.body ?? "{}") as Body;
  const { Authorization } = event.headers;

  try {
    const _auth = decodeJwt(Authorization, ["admin"]);

    // Get access keys for S3 login
    const { SecretString: s3SecretString } = await secretsManager.getSecretValue({ SecretId: "party-box/access-keys" });
    if (!s3SecretString) throw new Error("Access keys string was undefined.");
    const { accessKeyId, secretAccessKey } = JSON.parse(s3SecretString);

    const s3 = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const uploadKey = `${stage}/events/${eventId}/${uuid()}-${name}`;

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
  }
};
