import { APIGatewayEvent, APIGatewayProxyEventStageVariables, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";
import stripe from "stripe";

interface Body {
  name: string;
  description: string;
  start_time: string;
  end_time?: string;
  location: string;
  owner_id: string;
  max_tickets: string;
  ticket_price: number;
}

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2> => {
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
    const { name, description, start_time, end_time, location, owner_id, max_tickets, ticket_price } = JSON.parse(
      event.body ?? "{}"
    ) as Body;
    const { websiteUrl } = event.stageVariables as StageVariables;

    // const headers = event.headers;

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: "party-box/stripe",
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    // Create stripe product
    const stripeProduct = await stripeClient.products.create({
      name,
    });

    const stripePrice = await stripeClient.prices.create({
      product: stripeProduct.id,
      unit_amount: ticket_price,
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
      phone_number_collection: {
        enabled: true,
      },
      after_completion: {
        type: "redirect",
        redirect: {
          url: `${websiteUrl}/tickets/{{CHECKOUT_SESSION_ID}}`,
        },
      },
    });

    // Create event in pg without poster (we'll update after)
    const { rows } = await client.query(
      "insert into events(name,description,start_time,end_time,max_tickets,location,owner_id,stripe_product_id, prices) values($1,$2,$3,$4,$5,$6,$7,$8, $9) returning *;",
      [
        name,
        description,
        start_time,
        end_time,
        max_tickets,
        location,
        owner_id,
        stripeProduct.id,
        [{ id: stripePrice.id, name: "Regular", payment_link: paymentLink.url }],
      ]
    );

    return rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};
