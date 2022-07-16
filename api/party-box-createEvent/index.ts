import { APIGatewayEvent, APIGatewayProxyEventStageVariables, APIGatewayProxyResult } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { v4 as uuid } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SNS } from "@aws-sdk/client-sns";
import dayjs from "dayjs";

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
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const dynamoClient = new DynamoDB({});
  const dynamo = DynamoDBDocument.from(dynamoClient);
  const secretsManager = new SecretsManager({});
  const sns = new SNS({});

  try {
    const { name, description, startTime, endTime, location, maxTickets, ticketPrice } = JSON.parse(
      event.body ?? "{}"
    ) as Body;
    const { websiteUrl } = event.stageVariables as StageVariables;
    const { stage } = event.requestContext;
    const { Authorization } = event.headers;

    if (!Authorization) throw new Error("Authorization header was undefined.");

    const { sub, ...auth } = jwt.decode(Authorization.replace("Bearer ", "")) as JwtPayload;

    if (!auth["cognito:groups"].includes("admin")) throw new Error("User is not an admin.");

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${stage}/party-box/stripe`,
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    const eventId = uuid();

    // Create stripe product
    const stripeProduct = await stripeClient.products.create({
      name,
      description,
      metadata: {
        eventId,
      },
      unit_label: "ticket",
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
      metadata: {
        eventId,
      },
      phone_number_collection: {
        enabled: true,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${websiteUrl}/tickets/purchase-success?eventId=${eventId}`,
        },
      },
    });

    // Create topic in SNS for SMS messages
    const snsTopic = await sns.createTopic({
      Name: `${stage}-party-box-event-notifications-${eventId}`,
    });

    const eventData = {
      id: eventId,
      name,
      description,
      startTime,
      endTime,
      maxTickets,
      location,
      ownerId: sub,
      stripeProductId: stripeProduct.id,
      prices: [{ id: stripePrice.id, name: "Regular", paymentLink: paymentLink.url, paymentLinkId: paymentLink.id, price: ticketPrice }],
      snsTopicArn: snsTopic.TopicArn,
      ticketsSold: 0,
      published: false,
      media: [],
      thumbnail: "",
    };

    await dynamo.put({
      TableName: `${stage}-party-box-events`,
      Item: eventData,
    });

    // Schedule some messages
    await dynamo.put({
      TableName: "party-box-event-notifications",
      Item: {
        id: uuid(),
        messageTime: dayjs(startTime).toISOString(),
        message: `${name} starts now! Location is ${location}.`,
        eventSnsTopicArn: snsTopic.TopicArn,
      },
    });
    await dynamo.put({
      TableName: "party-box-event-notifications",
      Item: {
        id: uuid(),
        messageTime: dayjs(startTime).subtract(1, "hour").toISOString(),
        message: `${name} is starting in 1h! Location is ${location}.`,
        eventSnsTopicArn: snsTopic.TopicArn,
      },
    });
    await dynamo.put({
      TableName: "party-box-event-notifications",
      Item: {
        id: uuid(),
        messageTime: dayjs(startTime).subtract(4, "hour").toISOString(),
        message: `${name} is starting in 4h! Location is ${location}.`,
        eventSnsTopicArn: snsTopic.TopicArn,
      },
    });

    return { statusCode: 201, body: JSON.stringify(eventData) };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
