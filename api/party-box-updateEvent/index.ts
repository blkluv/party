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
  verifyHostRoles,
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
  const { notifications = [], prices = [], ...body } = JSON.parse(event.body ?? "{}") as PartyBoxUpdateEventInput;
  const { eventId } = event.pathParameters as PathParameters;
  const { Authorization } = event.headers;
  const { stage } = event.requestContext;
  const { websiteUrl } = event.stageVariables as StageVariables;

  try {
    const { sub: userId } = decodeJwt(Authorization, ["host"]);

    if (!userId) throw Error("Missing userId");

    const stripeClient = await getStripeClient(stage);
    const pg = await getPostgresClient(stage);

    const validRoles = await verifyHostRoles(pg, userId, Number(body.hostId), ["admin", "manager"]);

    if (!validRoles) throw Error("User is not authorized to update event");

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
    for (const price of prices) {
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

    // Clear all existing notifications
    await pg<PartyBoxEventNotification>("eventNotifications").where("eventId", "=", Number(eventId)).del();

    for (const n of notifications) {
      const tmp = {
        ...n,
        eventId: Number(eventId),
      };

      const [newNotificationData] = await pg<PartyBoxEventNotification>("eventNotifications")
        .insert<PartyBoxCreateNotificationInput>(tmp)
        .returning("*");

      newNotifications.push(newNotificationData);
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
