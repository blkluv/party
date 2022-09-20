import { APIGatewayEvent, APIGatewayProxyEventStageVariables, APIGatewayProxyResult } from "aws-lambda";
import {
  getStripeClient,
  formatEventNotification,
  getPostgresClient,
  PartyBoxEventTicket,
  PartyBoxEvent,
  PartyBoxEventNotification,
} from "@party-box/common";
import { SNS } from "@aws-sdk/client-sns";

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
  const sql = await getPostgresClient(stage);
  const stripeClient = await getStripeClient(stage);

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

    // Create ticket in Postgres
    const [ticketData] = await sql<PartyBoxEventTicket[]>`
      INSERT INTO "tickets"
      ${sql({
        eventId: Number(eventId),
        stripeSessionId: session?.data?.at(0)?.id ?? "",
        stripeChargeId: chargeId,
        receiptUrl,
        customerName,
        customerEmail,
        customerPhoneNumber: customerPhoneNumber ?? "",
        purchasedAt: new Date().toISOString(),
        ticketQuantity: Number(ticketQuantity),
        used: false,
      })}
      RETURNING *
    `;
    const [eventData] = await sql<PartyBoxEvent[]>`
      SELECT * FROM "events" WHERE "id" = ${eventId}
      `;

    if (!eventData) throw new Error("Could not find event");

    // Return count of tickets purchased for current event
    const [{ count: ticketsSold = 0 }] = await sql<{ count: number }[]>`
      SELECT COUNT("ticketQuantity") FROM "tickets" WHERE "eventId" = ${eventId}
    `;

    console.info(`Found ticket quantity of: ${ticketsSold}`);

    // Once enough stock is sold, disable product on stripe
    if (ticketsSold >= eventData?.maxTickets && eventData.stripeProductId) {
      await stripeClient.products.update(eventData.stripeProductId, {
        active: false,
      });
      console.info("Disabled product on Stripe");
    }

    // Subscribe customerPhoneNumber to the event's SNS topic
    if (eventData.snsTopicArn) {
      await sns.subscribe({
        TopicArn: eventData?.snsTopicArn,
        Protocol: "sms",
        Endpoint: customerPhoneNumber?.toString(),
      });
    }

    // Create a temp topic to send a one-time sms message to the customer
    const tempTopic = await sns.createTopic({
      Name: `${stage}-party-box-ticket-temp-${ticketData.id}`,
    });

    await sns.subscribe({
      TopicArn: tempTopic.TopicArn,
      Protocol: "sms",
      Endpoint: customerPhoneNumber?.toString(),
    });

    if (ticketQuantity === null || ticketQuantity === undefined) throw new Error("Ticket quantity was undefined");
    if (!customerPhoneNumber) throw new Error("Customer phone number was undefined");

    const ticketPurchaseMessage = `Thank you for purchasing ${ticketQuantity} ticket${
      ticketQuantity > 1 ? "s" : ""
    } to ${eventData?.name}!\n\nView your ticket at ${websiteUrl}/tickets/${
      ticketData.stripeSessionId
    }\n\nReceipt: ${receiptUrl}`;

    await sns.publish({
      Message: ticketPurchaseMessage,
      TopicArn: tempTopic.TopicArn,
    });

    // Check if this user should be recieving any event notifications
    // If so, get the latest one and send it to them
    const [latestEventNotification] = await sql<PartyBoxEventNotification[]>`
      SELECT * FROM "eventNotifications" 
      WHERE "eventId" = ${eventId} 
      AND "messageTime" <= ${new Date().toISOString()}
      ORDER BY "messageTime" DESC
    `

    if (latestEventNotification) {
      await sns.publish({
        Message: formatEventNotification(latestEventNotification.message, {
          location: eventData.location,
          startTime: eventData.startTime.toString(),
          name: eventData.name,
        }),
        TopicArn: tempTopic.TopicArn,
      });
    }

    await sns.deleteTopic({
      TopicArn: tempTopic.TopicArn,
    });

    return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await sql.end();
  }
};
