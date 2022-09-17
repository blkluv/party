import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { AuthorizationErrorException, SNS } from "@aws-sdk/client-sns";
import {
  decodeJwt,
  getPostgresClient,
  getStripeClient,
  PartyBoxEvent,
  PartyBoxEventPrice,
  verifyHostRoles,
} from "@party-box/common";
import { DeleteObjectsCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method DELETE
 * @description Delete event within Dynamo, Stripe, and SNS
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;
  const { eventId } = event.pathParameters as PathParameters;

  const sql = await getPostgresClient(stage);

  const sns = new SNS({ region: "us-east-1" });
  const secretsManager = new SecretsManager({ region: "us-east-1" });

  const stripeClient = await getStripeClient(stage);

  try {
    const { sub: userId } = decodeJwt(Authorization);
    if (!userId) throw new Error("Missing user id (sub) in JWT");

    // Get event from the Postgres
    const [{ prices, snsTopicArn, stripeProductId,hostId }] = await sql<PartyBoxEvent[]>`
      SELECT 
        "prices",
        "stripeProductId",
        "snsTopicArn",
        "hostId"
      FROM "events"
      WHERE "id" = ${Number(eventId)};
    `;

    // Check if the user is an admin of the given host
    const validRole = await verifyHostRoles(sql, userId, Number(hostId), ["admin", "manager"]);
    if (!validRole) throw new Error("User does not have permission to delete an event for this host");

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


    // Delete all stripe prices associated with this event
    // We can't actually delete them, but we can make them inactive
    for (const price of prices) {
      try {
        if (!price) continue;

        // I don't know how to have price typed by default without creating an entity for it
        // This works in place of the above approach
        // I use the `valueOf` function to cast to object so that I can then cast to PartyBoxEventPrice
        const typedPrice = price.valueOf() as PartyBoxEventPrice;

        if (typedPrice.paymentLinkId) {
          await stripeClient.prices.update(typedPrice.id, { active: false });
          await stripeClient.paymentLinks.update(typedPrice.paymentLinkId, {
            active: false,
          });
        }
      } catch (error) {
        continue;
      }
    }

    try {
      // Delete stripe product
      // We won't be able to delete it because we didn't actually delete the prices above
      // So we're also going to make this inactive
      if (stripeProductId) {
        await stripeClient.products.update(stripeProductId, { active: false });
      }
    } catch (error) {
      console.warn(error);
    }

    try {
      // Delete SNS topic
      if (snsTopicArn) {
        await sns.deleteTopic({
          TopicArn: snsTopicArn,
        });
      }
    } catch (error) {
      console.warn(error);
    }

    // Delete each object one by one from the s3 folder associated with this event
    // I don't know how to bulk delete, so this works instead
    try {
      const objects = await s3.send(
        new ListObjectsCommand({
          Bucket: "party-box-bucket",
          Prefix: `${stage}/${eventId}/`,
        })
      );
      if (objects?.Contents) {
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: "party-box-bucket",
            Delete: {
              Objects: objects.Contents.map((c) => ({ Key: c.Key })),
            },
          })
        );
      }
    } catch (error) {
      console.warn(error);
    }

    // Clean up all the other resources associated with this event
    await sql`
      DELETE FROM "tickets"
      WHERE "eventId" = ${Number(eventId)};
    `;
    await sql`
      DELETE FROM "eventNotifications"
      WHERE "eventId" = ${Number(eventId)};
    `;
    await sql`
      DELETE FROM "events"
      WHERE "id" = ${Number(eventId)};
    `;

    return { statusCode: 200, body: JSON.stringify({ message: "Event deleted." }) };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};
