import { APIGatewayEvent, APIGatewayProxyEventStageVariables, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { SNS } from "@aws-sdk/client-sns";
import { PartyBoxCreateEventInput, getStripeClient, decodeJwt, getPostgresConnectionString } from "@party-box/common";

import { PrismaClient } from "@party-box/prisma";

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  const {
    name,
    description,
    startTime,
    endTime,
    location,
    maxTickets,
    prices,
    hashtags,
    notifications = [],
    hostId,
    published,
  } = JSON.parse(event.body ?? "{}") as PartyBoxCreateEventInput;
  const { websiteUrl } = event.stageVariables as StageVariables;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const sns = new SNS({});
  const db = await getPostgresConnectionString(stage);
  const prisma = new PrismaClient({ datasources: { db: { url: db } } });
  await prisma.$connect();

  try {
    const { sub } = decodeJwt(Authorization, ["admin"]);
    if (!sub) throw new Error("Missing sub");

    const stripeClient = await getStripeClient(stage);

    // Check if the user is an admin of the given host

    const hostToVerify = await prisma.hostRole.findFirst({
      where: {
        hostId,
        userId: sub,
        role: "admin",
      },
    });
    if (!hostToVerify) throw new Error("User is not an admin of the host");

    const { id: eventId } = await prisma.event.create({
      data: {
        hostId: Number(hostId),
        name,
        description,
        maxTickets: Number(maxTickets),
        startTime,
        endTime,
        location,
        published,
        media: [],
        thumbnail: "",
        hashtags,
      },
    });

    console.log(`Created event with id ${eventId}`);

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
    const newPrices = [];
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
          allow_promotion_codes: true,
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
    // We push to this topic whenever we want to send out notifications to all ticket holders.
    const snsTopic = await sns.createTopic({
      Name: `${stage}-party-box-event-notifications-${eventId}`,
    });

    // Update the event with data created above
    // We store prices as JSON because we don't actually care about indexing them.
    // Having another table is overkill.
    const eventData = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        stripeProductId: stripeProduct.id,
        prices: newPrices,
        snsTopicArn: snsTopic.TopicArn,
      },
    });

    // Schedule some messages
    await prisma.eventNotification.createMany({
      data: notifications.map((n) => ({
        messageTime: n.messageTime,
        message: n.message,
        eventId,
      })),
    });

    return { statusCode: 201, body: JSON.stringify(eventData) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await prisma.$disconnect();
  }
};
