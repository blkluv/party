import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method GET
 * @description Get event with given ID from DynamoDB
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
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

    if (!eventData) throw new Error("Event not found");

    return {
      statusCode: 200,
      body: JSON.stringify({
        name: eventData.name,
        description: eventData.description,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        prices:eventData.prices,
        ticketsSold: eventData.ticketsSold,
        media: eventData.media,
        thumbnail: eventData.thumbnail,
      }),
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
