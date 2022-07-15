import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SNS } from "@aws-sdk/client-sns";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method DELETE
 * @description Delete event within Dynamo, Stripe, and SNS
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  console.log(event);

  const dynamo = DynamoDBDocument.from(new DynamoDB({}));
  const secretsManager = new SecretsManager({});
  const sns = new SNS({});

  try {
    const { stage } = event.requestContext;
    const { authorization } = event.headers;
    const { eventId } = event.pathParameters as PathParameters;

    if (!authorization) throw new Error("Authorization header was undefined.");

    const auth = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    if (!auth["cognito:groups"].includes("admin")) throw new Error("User is not an admin.");

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${stage}/party-box/stripe`,
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);

    // Get event from Dynamo
    const { Item: eventItem } = await dynamo.get({
      TableName: `${stage}-party-box-events`,
      Key: {
        id: eventId,
      },
    });
    if (!eventItem) throw new Error("Event was not found.");

    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    // Delete all stripe prices associated with this event
    // We can't actually delete them, but we can make them inactive
    for (const price of eventItem.prices) {
      try {
        await stripeClient.prices.update(price.id, { active: false });
        await stripeClient.paymentLinks.update(price.paymentLinkId, {
          active: false,
        });
      } catch (error) {
        continue;
      }
    }

    try {
      // Delete stripe product
      // We won't be able to delete it because we didn't actually delete the prices above
      // So we're also going to make this inactive
      await stripeClient.products.update(eventItem.stripeProductId, { active: false });
    } catch (error) {
      console.warn(error);
    }
    
    try {
      // Delete SNS topic
      await sns.deleteTopic({
        TopicArn: eventItem.snsTopicArn,
      });
    } catch (error) {
      console.warn(error);
    }

    await dynamo.delete({
      TableName: `${stage}-party-box-events`,
      Key: {
        id: eventId,
      },
    });

    // Get all event notifications and delete them
    const { Items: eventNotifications } = await dynamo.scan({
      TableName: `${stage}-party-box-event-notifications`,
      FilterExpression: "eventId = :eventId",
      ExpressionAttributeValues: {
        ":eventId": eventId,
      },
    });

    if (eventNotifications && eventNotifications?.length > 0) {
      for (const eventNotification of eventNotifications) {
        await dynamo.delete({
          TableName: `${stage}-party-box-event-notifications`,
          Key: {
            id: eventNotification.id,
          },
        });
      }
    }

    return { message: "Event deleted successfully." };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
