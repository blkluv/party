import { APIGatewayEvent, APIGatewayProxyEventStageVariables, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { SNS } from "@aws-sdk/client-sns";
import dayjs from "dayjs";
import {
  PartyBoxEvent,
  PartyBoxEventInput,
  PartyBoxEventPrice,
  getStripeClient,
  getPostgresClient,
  decodeJwt,
} from "@party-box/common";

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Create event within DynamoDB and Stripe
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
  } = JSON.parse(event.body ?? "{}") as PartyBoxEventInput;
  const { websiteUrl } = event.stageVariables as StageVariables;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const sns = new SNS({});
  const pg = await getPostgresClient(stage);

  try {
    const { sub } = decodeJwt(Authorization, ["admin"]);
    const stripeClient = await getStripeClient(stage);

    const [{ id: eventId }] = await pg<PartyBoxEvent>("events")
      .insert<PartyBoxEventInput>({
        ownerId: sub,
        name,
        description,
        maxTickets: Number(maxTickets),
        startTime,
        endTime,
        location,
        published: false,
        media: [],
        thumbnail: "",
        hashtags,
      })
      .returning("*");

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
    const [eventData] = await pg<PartyBoxEvent>("events")
      .where("id", "=", eventId)
      .update<Partial<PartyBoxEventInput>>({
        stripeProductId: stripeProduct.id,
        prices: newPrices,
        snsTopicArn: snsTopic.TopicArn,
      })
      .returning("*");

    // Schedule some messages
    await pg("eventNotifications").insert(
      notifications.map((n) => ({
        messageTime: dayjs(startTime)
          .subtract(n.days, "day")
          .subtract(n.hours, "hour")
          .subtract(n.minutes, "minute")
          .toISOString(),
        message: n.message,
        eventId,
      }))
    );

    return { statusCode: 201, body: JSON.stringify(eventData) };
  } catch (error) {
    console.error(error);
    await pg.destroy();

    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
