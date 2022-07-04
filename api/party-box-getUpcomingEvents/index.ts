import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<object>> => {
  try {
    const secretsManager = new AWS.SecretsManager({ region: "us-east-1" });
    // const headers = event.headers;

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

    const { rows } = await client.query("select * from events where start_time>now() order by start_time desc;");

    console.log(rows);

    await client.end();

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Code here
  }
};
