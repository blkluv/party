import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import jwt, { JwtPayload } from "jsonwebtoken";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @description Send out event notifications to all event ticket holders.
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log(event);

    const dynamo = DynamoDBDocument.from(new DynamoDB({}));

    const { eventId } = event.pathParameters as PathParameters;
    const { Authorization } = event.headers;

    if (!Authorization) throw new Error("Authorization header was undefined.");

    const auth = jwt.decode(Authorization.replace("Bearer ", "")) as JwtPayload;

    if (!auth["cognito:groups"].includes("admin")) throw new Error("User is not an admin.");
    // Get all notifications that are past due
    const { Items: notifications } = await dynamo.scan({
      TableName: "party-box-event-notifications",
      FilterExpression: "eventId = :eventId",
      ExpressionAttributeValues: {
        ":eventId": eventId,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(notifications),
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
