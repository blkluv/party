import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
}

/**
 * @method POST
 * @description Retrieve ticket data from postgres and stripe given a session id (treated as ticketId)
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  console.log(event);

  const dynamo = DynamoDBDocument.from(new DynamoDB({}));
  const secretsManager = new SecretsManager({});

  try {
    const { ticketId } = event.pathParameters as PathParameters;
    const { stage } = event.requestContext;

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${stage}/party-box/stripe`,
    });

    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    const { Item: ticketData } = await dynamo.get({
      TableName: "party-box-tickets",
      Key: {
        id: ticketId,
      },
    });

    console.log(ticketData);

    const { Item: eventData } = await dynamo.get({
      TableName: "party-box-events",
      Key: {
        id: ticketData?.eventId,
      },
    });

    const session = await stripeClient.checkout.sessions.retrieve(ticketId);
    const paymentIntent = await stripeClient.paymentIntents.retrieve(session?.payment_intent?.toString() ?? "");

    return { ...ticketData, status: paymentIntent?.status ?? "pending", event: eventData };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
