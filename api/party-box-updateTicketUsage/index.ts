import { APIGatewayEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import jwt, { JwtPayload } from "jsonwebtoken";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

interface Body {
  value: string;
}

/**
 * @method POST
 * @description Create ticket within DynamoDB and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  console.log(event);

  const dynamo = DynamoDBDocument.from(new DynamoDB({}));

  try {
    const { stage } = event.requestContext;
    const { value } = JSON.parse(event.body ?? "{}") as Body;
    const { eventId } = event.pathParameters as PathParameters;
    const { authorization } = event.headers;

    if (!authorization) throw new Error("Authorization header was undefined.");

    const auth = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    if (!auth["cognito:groups"].includes("admin")) throw new Error("User is not an admin.");

    // Subscribe customerPhoneNumber to the event's SNS topic
    await dynamo.update({
      TableName: `${stage}-party-box-tickets`,
      Key: {
        id: eventId,
      },
      AttributeUpdates: {
        used: {
          Value: value,
        },
      },
    });

    return {};
  } catch (error) {
    console.error(error);
    throw error;
  }
};
