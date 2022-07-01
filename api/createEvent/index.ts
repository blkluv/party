import { APIGatewayEvent, APIGatewayProxyResultV2, APIGatewayProxyEventPathParameters } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";

// interface PathParameters extends APIGatewayProxyEventPathParameters {}

// interface Body {}

// interface Query {}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<{ message: string }>> => {
  try {
    const secretsManager = new AWS.SecretsManager({ region: "us-east-1" });
    // const body = JSON.parse(event.body ?? "{}") as Body;
    // const query = event.queryStringParameters as Query;
    // const pathParams = event.pathParameters as PathParameters;
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

    const { rows } = await client.query("SELECT NOW()");

    console.log(rows);

    await client.end();

    return { message: "Success" };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Code here
  }
};
