import { APIGatewayEvent, APIGatewayProxyEventStageVariables } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { SNS } from "@aws-sdk/client-sns";

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Create ticket within DynamoDB and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  console.log(event);
  
  const secretsManager = new SecretsManager({});
  const dynamo = DynamoDBDocument.from(new DynamoDB({}));
  const sns = new SNS({});

  try {
    const { stage } = event.requestContext;
    const { websiteUrl } = event.stageVariables as StageVariables;
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
    const session = await stripeClient.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      expand: ["data.line_items"],
    });

    const eventId = session?.data[0]?.metadata?.eventId;
    const customerPhoneNumber = session.data[0].customer_details?.phone;
    const ticketQuantity = session.data[0].line_items?.data[0].quantity;

    // Create ticket in DynamoDB
    const ticketData = {
      id: session.data[0].id,
      eventId,
      stripeChargeId: chargeId,
      receiptUrl,
      customerName,
      customerEmail,
      customerPhoneNumber,
      timestamp: new Date().toISOString(),
      ticketQuantity,
      used: 0,
    };

    await dynamo.put({
      TableName: `${stage}-party-box-tickets`,
      Item: ticketData,
    });

    // Subscribe customerPhoneNumber to the event's SNS topic
    const { Item: eventData } = await dynamo.get({
      TableName: `${stage}-party-box-events`,
      Key: {
        id: eventId,
      },
    });

    if (!eventData) throw new Error("Couldn't find event data");

    await sns.subscribe({
      TopicArn: eventData?.snsTopicArn,
      Protocol: "sms",
      Endpoint: customerPhoneNumber?.toString(),
    });

    await sns.publish({
      Message: `
      Thank you for purchasing ${ticketQuantity} ticket${ticketQuantity ?? 0 > 1 ? "s" : ""} to ${eventData?.name}!

      View your ticket at ${websiteUrl}/tickets/${ticketData.id}

      Receipt: ${receiptUrl}
      `,
      PhoneNumber: eventData?.phoneNumber,
    });

    return {};
  } catch (error) {
    console.error(error);
    throw error;
  }
};
