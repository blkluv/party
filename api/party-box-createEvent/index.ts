import { APIGatewayEvent, APIGatewayProxyEventStageVariables, APIGatewayProxyResult } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";
import { v4 as uuid } from "uuid";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SNS } from "@aws-sdk/client-sns";
import dayjs from "dayjs";
import knex from "knex";
import { PartyBoxEvent, PartyBoxEventInput, PartyBoxEventPrice } from "@party-box/common";

interface Body {
  name: string;
  description: string;
  startTime: string;
  endTime?: string;
  location: string;
  maxTickets: string;
  prices: {
    price: number;
    name: string;
  }[];
  hashtags: string[];
  notifications: {
    days: number;
    hours: number;
    minutes: number;
    message: string;
  }[];
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

  const secretsManager = new SecretsManager({});
  const sns = new SNS({});

  try {
    const { name, description, startTime, endTime, location, maxTickets, prices, hashtags, notifications } = JSON.parse(
      event.body ?? "{}"
    ) as Body;
    const { websiteUrl } = event.stageVariables as StageVariables;
    const { stage } = event.requestContext;
    const { Authorization } = event.headers;

    // Check if the user has a admin permissions
    if (!Authorization) throw new Error("Authorization header was undefined.");
    const { sub, ...auth } = jwt.decode(Authorization.replace("Bearer ", "")) as JwtPayload;
    if (!auth["cognito:groups"].includes("admin")) throw new Error("Insufficient permissions");

    // Get stripe access keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${stage}/party-box/stripe`,
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    // Get Postgres access
    const { SecretString: pgSecretString } = await secretsManager.getSecretValue({
      SecretId: "prod/party-box/pg",
    });
    if (!pgSecretString) throw new Error("Postgres secret was undefined.");
    const pgAccess = JSON.parse(pgSecretString);

    const pg = knex({
      client: "pg",
      connection: {
        user: pgAccess.username,
        password: pgAccess.password,
        host: pgAccess.host,
        port: pgAccess.port,
        database: stage,
      },
    });

    const { id: eventId } = await pg("events")
      .insert<PartyBoxEventInput>({
        ownerId: sub,
        name,
        description,
        maxTickets: Number(maxTickets),
        startTime,
        endTime,
        location,
        ticketsSold: 0,
        published: false,
        media: [],
        thumbnail: "",
        hashtags,
      })
      .returning<PartyBoxEvent>("*");

    // Create stripe product
    const stripeProduct = await stripeClient.products.create({
      name,
      description,
      metadata: {
        eventId,
      },
      unit_label: "ticket",
    });

    // Upload price data
    const newPrices: PartyBoxEventPrice[] = [];
    for (const price of prices) {
      if (price.price > 0.5) {
        const stripePrice = await stripeClient.prices.create({
          product: stripeProduct.id,
          unit_amount: price.price * 100,
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

        newPrices.push({
          id: stripePrice.id,
          name: "Regular",
          paymentLink: paymentLink.url,
          paymentLinkId: paymentLink.id,
          price: price.price,
          free: false,
        });
      } else {
        newPrices.push({
          id: uuid(),
          name: "Regular",
          price: price.price,
          free: true,
        });
      }
    }

    // Create topic in SNS for SMS messages
    const snsTopic = await sns.createTopic({
      Name: `${stage}-party-box-event-notifications-${eventId}`,
    });

    // Update the event with data created above
    const eventData = await pg("events")
      .where("id", eventId)
      .update<PartyBoxEventInput>({
        stripeProductId: stripeProduct.id,
        prices: newPrices,
        snsTopicArn: snsTopic.TopicArn,
      })
      .returning<PartyBoxEvent>("*");

    // Schedule some messages
    await pg("notifications").insert(
      notifications.map((n) => ({
        id: uuid(),
        messageTime: dayjs(startTime)
          .subtract(n.days, "day")
          .subtract(n.hours, "hour")
          .subtract(n.minutes, "minute")
          .toISOString(),
        message: n.message.replace("{location}", location).replace("{startTime}", startTime).replace("{name}", name),
        eventSnsTopicArn: snsTopic.TopicArn,
        eventId,
      }))
    );

    return { statusCode: 201, body: JSON.stringify(eventData) };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
