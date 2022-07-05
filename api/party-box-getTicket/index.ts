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

interface PathParameters extends APIGatewayProxyEventPathParameters {
  ticketId: string;
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
    // const { session_id } = event.queryStringParameters as Query;
    // const headers = event.headers;
    const { ticketId } = event.pathParameters as PathParameters;

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: "party-box/stripe",
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });
    const session = await stripeClient.checkout.sessions.retrieve(ticketId);
    let paymentIntent;
    if (session.payment_intent) {
      paymentIntent = await stripeClient.paymentIntents.retrieve(session.payment_intent.toString());
    }

    console.log(session);
    await client.query(
      `
        select * from tickets
        where stripe_session_id = $1;
      `,
      [ticketId]
    );

    return { url: session.url, session, paymentIntent };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};
