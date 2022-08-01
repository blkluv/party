import {
  APIGatewayEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventStageVariables,
  APIGatewayProxyResult,
} from "aws-lambda";
import { v4 as uuid } from "uuid";
import {
  decodeJwt,
  getPostgresClient,
  getStripeClient,
  PartyBoxCreateNotificationInput,
  PartyBoxEvent,
  PartyBoxEventNotification,
  PartyBoxUpdateEventInput,
} from "@party-box/common";

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method POST
 * @description Update event in Dynamo and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  const { notifications = [], ...body } = JSON.parse(event.body ?? "{}") as PartyBoxUpdateEventInput;
  const { eventId } = event.pathParameters as PathParameters;
  const { Authorization } = event.headers;
  const { stage } = event.requestContext;
  const { websiteUrl } = event.stageVariables as StageVariables;

  try {
    const { sub: _sub } = decodeJwt(Authorization, ["admin"]);

    const stripeClient = await getStripeClient(stage);
    const pg = await getPostgresClient(stage);

    const [newEventData] = await pg<PartyBoxEvent>("events")
      .where("id", "=", Number(eventId))
      .update<PartyBoxUpdateEventInput>(body)
      .returning("*");

    if (!newEventData.stripeProductId) throw new Error("Missing Stripe product id");

    await stripeClient.products.update(newEventData.stripeProductId, {
      name: body.name,
      description: body.description,
      images: body.media,
    });

    // Add price to price array and Stirpe if it doesn't have an ID
    const newPrices = [];
    for (const price of body.prices) {
      if (!price?.id) {
        if (price.price > 0.5) {
          const stripePrice = await stripeClient.prices.create({
            product: newEventData.stripeProductId,
            unit_amount: price.price * 100,
            currency: "CAD",
            nickname: price.name,
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
            name: price.name,
            paymentLink: paymentLink.url,
            paymentLinkId: paymentLink.id,
            price: price.price,
          });
        } else {
          newPrices.push({
            id: uuid(),
            name: price.name,
            price: price.price,
          });
        }
      } else {
        newPrices.push(price);
      }
    }

    const newNotifications: PartyBoxEventNotification[] = [];
    for (const n of notifications) {
      if ("id" in n) {
        const [newNotificationData] = await pg<PartyBoxEventNotification>("eventNotifications")
          .where("id", "=", n.id)
          .update(n)
          .returning("*");

        newNotifications.push(newNotificationData);
      } else {
        const [newNotificationData] = await pg<PartyBoxEventNotification>("eventNotifications")
          .insert<PartyBoxCreateNotificationInput>({
            ...n,
            eventId: Number(eventId),
          })
          .returning("*");
        newNotifications.push(newNotificationData);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ...newEventData, notifications: newNotifications }),
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
