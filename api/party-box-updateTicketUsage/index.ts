import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import jwt, { JwtPayload } from "jsonwebtoken";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
}

interface Body {
  value: string;
}

/**
 * @method POST
 * @description Create ticket within DynamoDB and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const dynamo = DynamoDBDocument.from(new DynamoDB({}));

  try {
    const { stage } = event.requestContext;
    const { value } = JSON.parse(event.body ?? "{}") as Body;
    const { ticketId } = event.pathParameters as PathParameters;
    const { Authorization } = event.headers;

    if (!Authorization) throw new Error("Authorization header was undefined.");

    const auth = jwt.decode(Authorization.replace("Bearer ", "")) as JwtPayload;

    if (!auth["cognito:groups"].includes("admin")) throw new Error("User is not an admin.");

    // Subscribe customerPhoneNumber to the event's SNS topic
    await dynamo.update({
      TableName: `${stage}-party-box-tickets`,
      Key: {
        id: ticketId,
      },
      AttributeUpdates: {
        used: {
          Value: value,
        },
      },
    });

    return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
