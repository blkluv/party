import { EventBridgeEvent } from "aws-lambda";
import { SNS } from "@aws-sdk/client-sns";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

interface EventNotification {
  timestamp: string;
  eventSnsTopicArn: string;
  message: string;
}

/**
 * @description Send out event notifications to all event ticket holders.
 */
export const handler = async (event: EventBridgeEvent<"SendEventNotifications", unknown>) => {
  console.log(event);

  const sns = new SNS({});
  const dynamo = DynamoDBDocument.from(new DynamoDB({}));

  try {
    // Get all notifications that are past due
    const { Items: notifications } = await dynamo.scan({
      TableName: "party-box-event-notifications",
      FilterExpression: "timestamp <= :now",
      ExpressionAttributeValues: {
        ":now": new Date().toISOString(),
      },
    });

    if (!notifications?.length) throw new Error("No notifications to send.");

    // Send out notifcations using AWS SNS
    for (const e of notifications as EventNotification[]) {
      await sns.publish({
        Message: e.message,
        TopicArn: e.eventSnsTopicArn,
      });
    }

    return {};
  } catch (error) {
    console.error(error);
    throw error;
  }
};
