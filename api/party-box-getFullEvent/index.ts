import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import jwt, { JwtPayload } from "jsonwebtoken";

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
    const { Authorization } = event.headers;

    if (!Authorization) throw new Error("Authorization header was undefined.");

    const auth = jwt.decode(Authorization.replace("Bearer ", "")) as JwtPayload;

    if (!auth["cognito:groups"].includes("admin")) throw new Error("Insufficient permissions");

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
      body: JSON.stringify(eventData),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error,
      }),
    };
  }
};
