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
    console.info(dayjs().format("YYYY-MM-DD HH:mm:ss"));

    const notifications = await sql`
        select 
          "eventNotifications"."message",
          "eventNotifications"."id",
          "eventNotifications"."eventId",
          "events"."name",
          "events"."startTime",
          "events"."location",
          "events"."snsTopicArn"
        from "eventNotifications" 
        join "events" 
          on "events"."id" = "eventNotifications"."eventId"
        where "messageTime" <= ${dayjs().format("YYYY-MM-DD HH:mm:ss")}
        and "sent" = false
    `;

    console.info(`Found ${notifications.length} notifications`);

    if (notifications?.length === 0) {
      throw new Error("No notifications to send.");
    }

    const eventIds = notifications.map((n) => n.eventId);

    const eventData = await sql<PartyBoxEvent[]>`
      select * from "events"
      where "id" in ${sql(eventIds)};
    `;

    // Send out notifcations using AWS SNS
    for (const { snsTopicArn, eventId, message, id } of notifications) {
      const e = eventData.find((e) => e.id === eventId);

      if (!e) {
        console.warn(`Could not find event with id ${eventId} for notification ${id}`);
        continue;
      }

      await sns.publish({
        Message: formatEventNotification(message, {
          location: e.location,
          name: e.name,
          startTime: e.startTime.toString(),
        }),
        TopicArn: snsTopicArn,
      });

      // Mark message as sent
      await sql`
        update "eventNotifications" 
        set "sent" = true
        where "id" = ${id}
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
