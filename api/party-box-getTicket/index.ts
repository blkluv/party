import {
  APIGatewayEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyEventStageVariables,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";
import stripe from "stripe";

interface Query extends APIGatewayProxyEventQueryStringParameters {
  session_id: string;
}

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Retrieve ticket data from postgres and stripe given a session id and event id
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
    const { session_id } = event.queryStringParameters as Query;
    // const headers = event.headers;
    const { eventId } = event.pathParameters as PathParameters;

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: "party-box/stripe",
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });
    const session = await stripeClient.checkout.sessions.retrieve(session_id);
    if (session?.customer) {
      const customer = await stripeClient.customers.retrieve(session.customer.toString());
      console.log(customer);
    }

    await client.query(
      `
        select * from tickets
        where event_id = $1 and session_id = $2;
      `,
      [eventId, session_id]
    );

    return { url: session.url, session, customer };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};
