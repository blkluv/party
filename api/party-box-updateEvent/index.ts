import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";
import stripe from "stripe";

interface Body {
  name?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  max_tickets?: string;
  ticket_price?: number;
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

    // Create event in pg without poster (we'll update after)
    for (const [key, value] of Object.entries(body)) {
      await client.query(`update events set $2 = $3 where id = $1;`, [eventId, key, value]);
    }

    const { rows } = await client.query(`select * from events where id = $1;`, [eventId]);

    return rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Code here
  }
};
