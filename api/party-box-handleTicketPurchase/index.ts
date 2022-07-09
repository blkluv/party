import { APIGatewayEvent } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

/**
 * @method POST
 * @description Create ticket within DynamoDB and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  console.log(event);
  const secretsManager = new SecretsManager({});
  const dynamo = DynamoDBDocument.from(new DynamoDB({}));

  try {
    const { stage } = event.requestContext;
    const {
      data: { object: data },
    } = JSON.parse(event.body ?? "{}");

    const chargeId = data.id;
    const customerName = data.billing_details.name;
    const customerEmail = data.billing_details.email;
    const receiptUrl = data.receipt_url;

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${stage}/party-box/stripe`,
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    const paymentIntent = await stripeClient.paymentIntents.retrieve(data.payment_intent);
    const session = await stripeClient.checkout.sessions.list({ payment_intent: paymentIntent.id });

    console.log(paymentIntent);
    console.log(session);

    const eventId = paymentIntent.metadata.eventId;
    const customerPhoneNumber = session.data[0].customer_details?.phone;

    const ticketData = {
      id: session.data[0].id,
      eventId,
      stripeChargeId: chargeId,
      receiptUrl,
      customerName,
      customerEmail,
      customerPhoneNumber,
      timestamp: new Date().toISOString(),
    };

    console.log(ticketData);

    await dynamo.put({
      TableName: "party-box-tickets",
      Item: ticketData,
    });

    return {};
  } catch (error) {
    console.error(error);
    throw error;
  }
};
