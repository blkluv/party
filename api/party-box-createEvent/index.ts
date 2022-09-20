import { APIGatewayEvent, APIGatewayProxyEventStageVariables, APIGatewayProxyResult } from "aws-lambda";
import { SNS } from "@aws-sdk/client-sns";
import { getStripeClient, decodeJwt, getPostgresClient, verifyHostRoles, PartyBoxEvent, PartyBoxCreateEventInput } from "@party-box/common";
import zod from "zod";

// const bodySchema = zod.object({
//   name: zod.string(),
//   description: zod.string(),
//   startTime: zod.string(),
//   endTime: zod.string(),
//   prices: zod.array(zod.object({ name: zod.string(), price: zod.number() })),
//   maxTickets: zod.number(),
//   location: zod.string().default("TBD"),
//   hostId: zod.number(),
//   published: zod.boolean().default(false),
//   hashtags: zod.array(zod.string()).optional().default([]),
//   notifications: zod
//     .array(zod.object({ messageTime: zod.string(), message: zod.string() }))
//     .optional()
//     .default([]),
// });

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);
  const { websiteUrl } = event.stageVariables as StageVariables;
  const { stage } = event.requestContext;
  const { Authorization } = event.headers;

  const sns = new SNS({ region: "us-east-1" });
  const sql = await getPostgresClient(stage);

  try {
    if (!event.body) throw new Error("Missing body");
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
    } = JSON.parse(event.body) as PartyBoxCreateEventInput;

    const { sub } = decodeJwt(Authorization, ["admin"]);
    if (!sub) throw new Error("Missing sub");

    const stripeClient = await getStripeClient(stage);

    // Check if the user is an admin of the given host
    const validRole = verifyHostRoles(sql, sub, hostId, ["admin"]);
    if (!validRole) throw new Error("User does not have permission to create an event for this host");

    console.info("Role validated");

    // Create the event in Postgres
    const [{ id: eventId }] = await sql<Pick<PartyBoxEvent, "id">[]>`
      INSERT INTO events 
        ${sql({
          name: name,
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

        await sql`
          INSERT INTO "ticketPrices" 
            ${sql({
              name: "Regular",
              paymentLink: paymentLink.url,
              paymentLinkId: paymentLink.id,
              stripePriceId: stripePrice.id,
              price: price.price,
              free: false,
            })}
        `;
      } else {
        await sql`
          INSERT INTO "ticketPrices" 
            ${sql({
              id: crypto.randomUUID(),
              name: "Regular",
              price: price.price,
              free: true,
            })}
        `;
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
    const [eventData] = await sql<PartyBoxEvent[]>`
      UPDATE "events"
      SET ${sql({
        stripeProductId: stripeProduct.id,
        snsTopicArn: snsTopic.TopicArn,
      })}
      WHERE "id" = ${eventId}
      RETURNING *;
    `;

    // Schedule some messages
    await sql`
      INSERT INTO "eventNotifications" ${sql(
        notifications.map((n) => ({
          messageTime: n.messageTime,
          message: n.message,
          eventId,
        }))
      )}`;

    return { statusCode: 201, body: JSON.stringify(eventData) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
