import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResult } from "aws-lambda";
import { SNS } from "@aws-sdk/client-sns";
import { decodeJwt, getPostgresClient, getStripeClient, PartyBoxEvent } from "@party-box/common";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method DELETE
 * @description Delete event within Dynamo, Stripe, and SNS
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event));

  const { stage } = event.requestContext;
  const { Authorization } = event.headers;
  const { eventId } = event.pathParameters as PathParameters;

  const sns = new SNS({});

  const stripeClient = await getStripeClient(stage);
  const pg = await getPostgresClient(stage);

  try {
    const _auth = decodeJwt(Authorization, ["admin"]);

    // Get event from Dynamo
    const [{ prices, stripeProductId, snsTopicArn }] = await pg<PartyBoxEvent>("events")
      .select("prices", "stripeProductId", "snsTopicArn")
      .where("id", "=", Number(eventId));

    // Delete all stripe prices associated with this event
    // We can't actually delete them, but we can make them inactive
    for (const price of prices) {
      try {
        if (price.paymentLinkId) {
          await stripeClient.prices.update(price.id, { active: false });
          await stripeClient.paymentLinks.update(price.paymentLinkId, {
            active: false,
          });
        }
      } catch (error) {
        continue;
      }
    }

    try {
      // Delete stripe product
      // We won't be able to delete it because we didn't actually delete the prices above
      // So we're also going to make this inactive
      await stripeClient.products.update(stripeProductId, { active: false });
    } catch (error) {
      console.warn(error);
    }

    try {
      // Delete SNS topic
      await sns.deleteTopic({
        TopicArn: snsTopicArn,
      });
    } catch (error) {
      console.warn(error);
    }

    // Delete all event notifications
    await pg("eventNotifications").delete().where("eventId", "=", Number(eventId));

    // Delete event
    await pg("events").delete().where("id", "=", Number(eventId));

    return { statusCode: 200, body: JSON.stringify({ message: "Event deleted." }) };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await pg.destroy();
  }
};
