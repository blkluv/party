import { APIGatewayEvent, APIGatewayProxyEventStageVariables, APIGatewayProxyResult } from "aws-lambda";
 import { SNS } from "@aws-sdk/client-sns";
import {
  PartyBoxCreateEventInput,
  getStripeClient,
  decodeJwt,
  getPostgresClient,
  verifyHostRoles,
  PartyBoxEvent,
} from "@party-box/common";

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

  const sns = new SNS({ region: "us-east-1" });
  const sql = await getPostgresClient(stage);

  try {
    const { sub } = decodeJwt(Authorization, ["admin"]);
    if (!sub) throw new Error("Missing sub");

    const stripeClient = await getStripeClient(stage);

    // Check if the user is an admin of the given host
    const validRole = verifyHostRoles(sql, sub, hostId, ["admin"]);
    if (!validRole) throw new Error("User does not have permission to create an event for this host");

    // Create the event in Postgres
    const [{ id: eventId }] = await sql<Pick<PartyBoxEvent, "id">[]>`
      INSERT INTO events (
        ${sql({
          name,
          hostId: Number(hostId),
          description,
          startTime,
          endTime,
          location,
          maxTickets: Number(maxTickets),
          published,
          media: [],
          thumbnail: "",
          hashtags: [],
        })}
      )
      RETURNING id;
    `;

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
          id: crypto.randomUUID(),
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

    if (!snsTopic?.TopicArn) throw new Error("Sns topic was not created successfully");

    // Update the event with data created above
    // We store prices as JSON because we don't actually care about indexing them.
    // Having another table is overkill.
    const updateEventData = sql(
      {
        stripeProductId: stripeProduct.id,
        prices: newPrices,
        snsTopicArn: snsTopic.TopicArn,
      },
      "stripeProductId",
      "snsTopicArn",
      "prices"
    );
    const [eventData] = await sql<PartyBoxEvent[]>`
      UPDATE "events"
      SET ${updateEventData}
      WHERE "id" = ${eventId}
      RETURNING *;
    `;

    // Schedule some messages
    await sql`
      INSERT INTO event_notifications ${sql(
        notifications.map((n) => ({
          messageTime: n.messageTime,
          message: n.message,
          eventId,
        })),
        "eventId",
        "message",
        "messageTime"
      )}`;

    return { statusCode: 201, body: JSON.stringify(eventData) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await sql.end();
  }
};
