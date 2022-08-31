import { APIGatewayEvent, APIGatewayProxyEventStageVariables, APIGatewayProxyResult } from "aws-lambda";
import {
  getPostgresClient,
  getStripeClient,
  PartyBoxEvent,
  PartyBoxEventTicket,
  PartyBoxCreateTicketInput,
} from "@party-box/common";
import { SNS } from "@aws-sdk/client-sns";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import twilio from "twilio";

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Create ticket within DynamoDB and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const { stage } = event.requestContext;
  const { websiteUrl } = event.stageVariables as StageVariables;
  const {
    data: { object: data },
  } = JSON.parse(event.body ?? "{}");

  const sns = new SNS({});
  const pg = await getPostgresClient(stage);
  const stripeClient = await getStripeClient(stage);
  const secretsManager = new SecretsManager({});

  try {
    const chargeId = data.id;
    const customerName = data.billing_details.name;
    const customerEmail = data.billing_details.email;
    const receiptUrl = data.receipt_url;

    const paymentIntent = await stripeClient.paymentIntents.retrieve(data.payment_intent);
    const session = await stripeClient.checkout.sessions.list({
      payment_intent: paymentIntent.id,
      expand: ["data.line_items"],
    });

    const eventId = session?.data[0]?.metadata?.eventId ?? "";
    const customerPhoneNumber = session.data[0].customer_details?.phone;
    const ticketQuantity = Number(session.data[0].line_items?.data[0].quantity);

    const newTicketData = {
      eventId,
      stripeSessionId: session?.data?.at(0)?.id ?? "",
      stripeChargeId: chargeId,
      receiptUrl,
      customerName,
      customerEmail,
      customerPhoneNumber: customerPhoneNumber ?? "",
      purchasedAt: new Date().toISOString(),
      ticketQuantity: Number(ticketQuantity),
      used: false,
    };

    // Create ticket in DynamoDB
    const [ticketData] = await pg<PartyBoxEventTicket>("tickets")
      .insert<PartyBoxCreateTicketInput>(newTicketData)
      .returning("*");

    const [eventData] = await pg<PartyBoxEvent>("events").where("id", "=", Number(eventId));
    const [ticketsSold] = await pg<PartyBoxEventTicket>("tickets")
      .where("eventId", "=", Number(eventId))
      .sum("ticketQuantity");

    console.log(ticketsSold);

    // Once enough stock is sold, disable product on stripe
    if (ticketsSold >= eventData?.maxTickets) {
      await stripeClient.products.update(eventData?.stripeProductId, {
        active: false,
      });
    }

    if (!eventData) throw new Error("Couldn't find event data");

    // Subscribe customerPhoneNumber to the event's SNS topic
    await sns.subscribe({
      TopicArn: eventData?.snsTopicArn,
      Protocol: "sms",
      Endpoint: customerPhoneNumber?.toString(),
    });

    // Create a temp topic to send a one-time sms message to the customer
    // const tempTopic = await sns.createTopic({
    //   Name: `${stage}-party-box-ticket-temp-${ticketData.id}`,
    // });

    // await sns.subscribe({
    //   TopicArn: tempTopic.TopicArn,
    //   Protocol: "sms",
    //   Endpoint: customerPhoneNumber?.toString(),
    // });

    if (ticketQuantity === null || ticketQuantity === undefined) throw new Error("Ticket quantity was undefined");
    if (!customerPhoneNumber) throw new Error("Customer phone number was undefined");

    // Get Twilio client
    const { SecretString: twilioSecretString } = await secretsManager.getSecretValue({
      SecretId: "dev/conor/twilio",
    });
    if (!twilioSecretString) throw new Error("Twilio secret was undefined.");
    const { sid, token, phoneNumber } = JSON.parse(twilioSecretString);

    const twilioClient = twilio(sid, token);

    const ticketPurchaseMessage = `Thank you for purchasing ${ticketQuantity} ticket${
      ticketQuantity > 1 ? "s" : ""
    } to ${eventData?.name}!\n\nView your ticket at ${websiteUrl}/tickets/${
      ticketData.stripeSessionId
    }\n\nReceipt: ${receiptUrl}`;

    await twilioClient.messages.create({
      body: ticketPurchaseMessage,
      to: customerPhoneNumber,
      from: phoneNumber,
    });

    // await sns.publish({
    //   Message: ticketPurchaseMessage,
    //   TopicArn: tempTopic.TopicArn,
    // });

    // await sns.deleteTopic({
    //   TopicArn: tempTopic.TopicArn,
    // });

    return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await pg.destroy();
  }
};
