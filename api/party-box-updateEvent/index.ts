import { APIGatewayEvent, APIGatewayEventRequestContext, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import jwt, { JwtPayload } from "jsonwebtoken";

interface Body {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  maxTickets: string;
  ticketPrice: number;
  posterUrl: string;
  thumbnailUrl: string;
}

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method POST
 * @description Update event in Dynamo and Stripe
 */
export const handler = async (event: APIGatewayEvent, context: APIGatewayEventRequestContext): Promise<unknown> => {
  console.log(event);
  const secretsManager = new SecretsManager({});
  const dynamo = DynamoDBDocument.from(new DynamoDB({}));

  try {
    const body = JSON.parse(event.body ?? "{}") as Body;
    const { eventId } = event.pathParameters as PathParameters;
    const { authorization } = event.headers;

    if (!authorization) throw new Error("Authorization header was undefined.");

    const auth = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    if (!auth["cognito:groups"].includes("admin")) throw new Error("User is not an admin.");

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${context.stage}/party-box/stripe`,
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);

    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    const { Attributes: eventData } = await dynamo.update({
      TableName: "party-box-events",
      Key: {
        id: eventId,
      },
      AttributeUpdates: {
        name: {
          Value: body.name,
        },
        description: {
          Value: body.description,
        },
        location: {
          Value: body.location,
        },
        startTime: {
          Value: body.startTime,
        },
        endTime: {
          Value: body.endTime,
        },
        maxTickets: {
          Value: body.maxTickets,
        },
        posterUrl: {
          Value: body.posterUrl,
        },
        thumbnailUrl: {
          Value: body.thumbnailUrl,
        },
      },
      ReturnValues: "ALL_NEW",
    });

    if (!eventData) throw new Error("Event was not found.");

    await stripeClient.products.update(eventData.stripeProductId, {
      name: body.name,
      description: body.description,
      images: [body.posterUrl],
    });

    return eventData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
