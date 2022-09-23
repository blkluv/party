import { APIGatewayProxyEventStageVariables, APIGatewayProxyHandler } from "aws-lambda";
import { SNS } from "@aws-sdk/client-sns";
import {
  formatEventNotification,
  getPostgresClient,
  PartyBoxEvent,
  PartyBoxEventNotification,
  PartyBoxEventTicket,
} from "@party-box/common";
import zod from "zod";
import { randomUUID } from "crypto";

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

const bodySchema = zod.object({
  customerName: zod.string(),
  customerPhoneNumber: zod.string().min(10).max(12),
  ticketQuantity: zod.number().min(1).max(10),
});

const pathParametersSchema = zod.object({
  eventId: zod.string().transform((e) => Number(e)),
});

/**
 * @method POST
 * @description Handle a free ticket purchase
 */
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event);
  const { websiteUrl } = event.stageVariables as StageVariables;
  const { eventId } = pathParametersSchema.parse(event.pathParameters);
  const { stage } = event.requestContext;

  const sns = new SNS({ region: "us-east-1" });
  const sql = await getPostgresClient(stage);

  try {
    if (!event.body) throw new Error("No body");

    const { customerName, ticketQuantity, customerPhoneNumber } = bodySchema.parse(JSON.parse(event.body));

    const [ticketData] = await sql<PartyBoxEventTicket[]>`
      INSERT INTO "tickets"
      ${sql({
        customerName,
        ticketQuantity,
        customerPhoneNumber,
        purchasedAt: new Date().toISOString(),
        used: false,
        slug: randomUUID(),
      })}
      RETURNING *;
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
    } to ${eventData?.name}!\n\nView your ticket at ${websiteUrl}/tickets/${ticketData.id}`;

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
    `;

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

    return { statusCode: 201, body: JSON.stringify({ status: "Success" }) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
