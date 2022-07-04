import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";
import stripe from "stripe";

interface Body {
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  max_tickets: string;
  ticket_price: number;
  poster_url: string;
  thumbnail_url: string;
}

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method method
 * @description Description
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<{ message: string }>> => {
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
    const body = JSON.parse(event.body ?? "{}") as Body;
    const { eventId } = event.pathParameters as PathParameters;
    // const headers = event.headers;

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: "party-box/stripe",
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    const { rows: startingEventDataRows } = await client.query(`SELECT * FROM events WHERE id = $1`, [eventId]);
    const startingEventData = startingEventDataRows[0];

    // Create event in pg without poster (we'll update after)
    const { rows: updatedEventDataRows } = await client.query(
      `
        UPDATE events
          SET 
            name = $2,
            description = $3,
            start_time = $4,
            end_time = $5,
            location = $6,
            poster_url = $7,
            max_tickets = $8,
            thumbnail_url = $9
        
        WHERE id = $1
        
        RETURNING *;
      `,
      [
        eventId,
        body.name,
        body.description,
        body.start_time,
        body.end_time,
        body.location,
        body.poster_url,
        body.max_tickets,
        body.thumbnail_url,
      ]
    );

    await stripeClient.products.update(startingEventData.stripe_product_id, {
      name: body.name,
      description: body.description,
      images: [body.poster_url],
    });

    return updatedEventDataRows[0];
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};
