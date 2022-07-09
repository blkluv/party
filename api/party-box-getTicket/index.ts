import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
}

/**
 * @method POST
 * @description Retrieve ticket data from postgres and stripe given a session id (treated as ticketId)
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
  console.log(event);

  const secretsManager = new SecretsManager({});
  const dynamo = DynamoDBDocument.from(new DynamoDB({}));

  try {
    const { stage } = event.requestContext;
    const { ticketId } = event.pathParameters as PathParameters;

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${stage}/party-box/stripe`,
    });

    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    const session = await stripeClient.checkout.sessions.retrieve(ticketId);
    const paymentIntent = await stripeClient.paymentIntents.retrieve(session?.payment_intent?.toString() ?? "");

    const { Item: eventData } = await dynamo.get({
      TableName: "party-box-events",
      Key: {
        id: session?.metadata?.eventId,
      },
    });

    return {
      status: paymentIntent?.status ?? "pending",
      customerPhoneNumber: session.customer_details?.phone,
      customerName: session.customer_details?.name,
      ticketQuantity: session.line_items?.data[0].quantity,
      event: eventData,
      used: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
