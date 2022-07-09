import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
}

/**
 * @method POST
 * @description Retrieve ticket data from postgres and stripe given a session id (treated as ticketId)
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  console.log(event);

  const dynamo = DynamoDBDocument.from(new DynamoDB({}));

  try {
    const { ticketId } = event.pathParameters as PathParameters;

    const { Item: eventData } = await dynamo.get({
      TableName: "party-box-tickets",
      Key: {
        id: ticketId,
      },
    });

    return eventData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
