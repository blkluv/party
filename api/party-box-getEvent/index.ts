import { APIGatewayEvent, APIGatewayProxyEventPathParameters, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
  const secretsManager = new AWS.SecretsManager({ region: "us-east-1" });
  const { SecretString } = await secretsManager.getSecretValue({ SecretId: "party-box/postgres" });
  if (!SecretString) throw new Error("Secret string was undefined.");
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
    const { eventId } = event.pathParameters as PathParameters;
    // const headers = event.headers;

    const { rows } = await client.query("select * from events where id = $1;", [eventId]);

    console.log(rows);

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};
