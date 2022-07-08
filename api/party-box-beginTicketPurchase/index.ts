import {
  APIGatewayEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventStageVariables,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";
import stripe from "stripe";

interface Body {
  stripe_price_id: string;
  ticket_quantity: number;
  customer_name: string;
  customer_phone: string;
}

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
  console.log(event);
  const secretsManager = new AWS.SecretsManager({ region: "us-east-1" });

  // Get postgres login
  const { SecretString } = await secretsManager.getSecretValue({ SecretId: "party-box/postgres" });
  if (!SecretString) throw new Error("Postgres login string was undefined.");
  const { username: user, password, host, port, dbname } = JSON.parse(SecretString);

  const client = new Client({
    user,
    password,
    host,
    port,
    database: dbname,
  });

  await client.connect();

  try {
    const { stripe_price_id, ticket_quantity, customer_phone, customer_name } = JSON.parse(event.body ?? "{}") as Body;
    const { websiteUrl } = event.stageVariables as StageVariables;
    // const headers = event.headers;
    const { eventId } = event.pathParameters as PathParameters;

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: "party-box/stripe",
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripe_price_id,
          quantity: ticket_quantity,
        },
      ],
      mode: "payment",
      success_url: `${websiteUrl}/event/${eventId}/tickets?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${websiteUrl}/event/${eventId}/tickets`,
    });

    await client.query(
      `
        insert into tickets (event_id, stripe_session_id, ticket_quantity, customer_name, customer_phone)
        values ($1, $2, $3, $4, $5)
        returning *;
      `,
      [eventId, session.id, ticket_quantity, customer_name, customer_phone]
    );

    return { url: session.url };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};
