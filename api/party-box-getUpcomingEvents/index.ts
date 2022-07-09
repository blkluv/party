import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (): Promise<unknown> => {
  try {
    const dynamo = DynamoDBDocument.from(new DynamoDB({}));

    const { Items: events } = await dynamo.scan({
      TableName: "party-box-events",
      FilterExpression: "startTime > :st",
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
