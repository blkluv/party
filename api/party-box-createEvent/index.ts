import { APIGatewayEvent, APIGatewayProxyEventStageVariables } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";

interface Body {
  name: string;
  description: string;
  startTime: string;
  endTime?: string;
  location: string;
  maxTickets: string;
  ticketPrice: number;
}

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Create event within DynamoDB and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  console.log(event);
  console.log(event.requestContext);
  console.log(event.requestContext.authorizer);

  const dynamoClient = new DynamoDB({});
  const dynamo = DynamoDBDocument.from(dynamoClient);

  const secretsManager = new SecretsManager({});

  try {
    const { name, description, startTime, endTime, location, maxTickets, ticketPrice } = JSON.parse(
      event.body ?? "{}"
    ) as Body;
    const { websiteUrl } = event.stageVariables as StageVariables;
    const { stage } = event.requestContext;
    const { authorization } = event.headers;

    if (!authorization) throw new Error("Authorization header was undefined.");

    const { sub, ...auth } = jwt.decode(authorization.replace("Bearer ", "")) as JwtPayload;

    if (!auth["cognito:groups"].includes("admin")) throw new Error("User is not an admin.");

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${stage}/party-box/stripe`,
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    // Create stripe product
    const stripeProduct = await stripeClient.products.create({
      name,
      description,
    });

    const stripePrice = await stripeClient.prices.create({
      product: stripeProduct.id,
      unit_amount: ticketPrice,
      currency: "CAD",
      nickname: "Regular",
    });

    const paymentLink = await stripeClient.paymentLinks.create({
      line_items: [
        {
          price: stripePrice.id,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: 1,
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${websiteUrl}/tickets/{CHECKOUT_SESSION_ID}`,
        },
      },
    });

    const { Attributes: eventData } = await dynamo.put({
      TableName: "party-box-events",
      Item: {
        id: uuid(),
        name,
        description,
        startTime,
        endTime,
        maxTickets,
        location,
        ownerId: sub,
        stripeProductId: stripeProduct.id,
        prices: [{ id: stripePrice.id, name: "Regular", paymentLink: paymentLink.url }],
      },
      ReturnValues: "ALL_OLD",
    });

    return eventData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
