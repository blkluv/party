import { SNS } from "@aws-sdk/client-sns";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { getPostgresClient, PartyBoxEvent, PartyBoxEventNotification } from "@party-box/common";

/**
 * @description Send out event notifications to all event ticket holders.
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const sns = new SNS({});
  const { stage } = event.requestContext;

  const pg = await getPostgresClient(stage);

  try {
    const notifications = await pg<PartyBoxEventNotification>("eventNotifications")
      .select("*")
      .where("messageTime", "<=", "now()")
      .join<PartyBoxEvent>("events", "events.id", "=", "eventNotifications.eventId");

    if (notifications?.length === 0) throw new Error("No notifications to send.");

    // Send out notifcations using AWS SNS
    for (const e of notifications) {
      await sns.publish({
        Message: e.message,
        TopicArn: e.snsTopicArn,
      });
    }

    // Delete all selected messages
    await pg<PartyBoxEventNotification>("eventNotifications").whereIn(
      "id",
      notifications.map((e) => e.id)
    );

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
    await pg.destroy();
  }
};
