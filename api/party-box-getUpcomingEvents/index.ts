import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { APIGatewayEvent, APIGatewayEventRequestContextV2 } from "aws-lambda";

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent, context: APIGatewayEventRequestContextV2): Promise<unknown> => {
  console.log(JSON.stringify(event));
  console.log(JSON.stringify(context));
  try {
    const dynamo = DynamoDBDocument.from(new DynamoDB({}));
    const { stage } = event.requestContext;

    const { Items: events } = await dynamo.scan({
      TableName: `${stage}-party-box-events`,
      FilterExpression: "startTime > :st",
      ExpressionAttributeValues: {
        ":st": new Date().toISOString(),
      },
    });

    return events?.map((e) => ({ ...e, location: null }));
  } catch (error) {
    console.error(error);
  }
};
