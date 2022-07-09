import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (): Promise<unknown> => {
  try {
    const dynamo = DynamoDBDocument.from(new DynamoDB({}));

    const { Items: events } = await dynamo.query({
      TableName: "party-box-events",
      KeyConditionExpression: "startTime > :st",
      ExpressionAttributeValues: {
        ":st": new Date().toISOString(),
      },
    });

    return events;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
