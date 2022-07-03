import { APIGatewayEvent, APIGatewayProxyResultV2, APIGatewayProxyEventPathParameters } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import Busboy from "busboy";

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
    const body = event.body;
    if (!body) throw new Error("Missing body");
    const { eventId } = event.pathParameters as PathParameters;

    const headers = event.headers;

    const busboy = Busboy({ headers });

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

    let uploadUrl = "";

    busboy.on("file", async (_fieldName, file, { filename }) => {
      console.log(filename);
      const uploadKey = `events/${eventId}/${uuid()}-${filename}.jpg`;

      uploadUrl = `https://party-box-bucket.s3.amazonaws.com/${uploadKey}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: "party-box-bucket",
          Key: uploadKey,
          ContentType: "multipart/form-data",
          Body: file,
        })
      );
    });

    return { url: uploadUrl };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
