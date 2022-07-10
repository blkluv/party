import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method GET
 * @description Get event with given ID from DynamoDB
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  try {
    const { eventId } = event.pathParameters as PathParameters;

    const dynamo = DynamoDBDocument.from(new DynamoDB({}));
    const { stage } = event.requestContext;

    const { Item: eventData } = await dynamo.get({
      TableName: `${stage}-party-box-events`,
      Key: {
        id: eventId,
      },
    });

    return { ...eventData, location: null };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
