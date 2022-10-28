import { SNS } from "@aws-sdk/client-sns";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatEventNotification, getPostgresClient, PartyBoxEvent } from "@party-box/common";
import dayjs from "dayjs";

/**
 * @description Send out event notifications to all event ticket holders.
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const sns = new SNS({});
  const { stage } = event.requestContext;

  const sql = await getPostgresClient(stage);

  try {
    const notifications = await sql`
        select * from "eventNotifications" 
        join "events" 
          on "events"."id" = "eventNotifications"."eventId"
        where "messageTime" <= ${dayjs().subtract(4, "hour").format("YYYY-MM-DD HH:mm:ss")}
        and "sent" = false
    `;

    const eventIds = notifications.map((n) => n.eventId);

    const eventData = await sql<PartyBoxEvent[]>`
      select * from "events"
      where "id" in ${sql(eventIds)};
    `;

    if (notifications?.length === 0) throw new Error("No notifications to send.");

    const sentNotifications: number[] = [];

    // Send out notifcations using AWS SNS
    for (const { snsTopicArn, eventId, message, id } of notifications) {
      const e = eventData.find((e) => e.id === eventId);

      if (!e) throw new Error("Event not found.");

      await sns.publish({
        Message: formatEventNotification(message, {
          location: e.location,
          name: e.name,
          startTime: e.startTime.toString(),
        }),
        TopicArn: snsTopicArn,
      });

      sentNotifications.push(id);
      // Mark message as sent
      await sql`
        update "eventNotifications" where "id" = ${id}
        SET
          "sent" = true
      `;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "Success" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "No notifications to send" }),
    };
  } finally {
    await sql.end();
  }
};
