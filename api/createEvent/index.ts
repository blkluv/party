import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";

interface Body {
  name: string;
  description: string;
  start_time: string;
  end_time?: string;
  location: string;
  owner_id: string;
  max_tickets: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<{ message: string }>> => {
  try {
    const secretsManager = new AWS.SecretsManager({ region: "us-east-1" });
    const { name, description, start_time, end_time, location, owner_id, max_tickets } = JSON.parse(
      event.body ?? "{}"
    ) as Body;
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

    const { rows } = await client.query(
      "insert into events(name,description,start_time,end_time,max_tickets,location,owner_id) values($1,$2,$3,$4,$5,$6,$7) returning *",
      [name, description, start_time, end_time, max_tickets, location, owner_id]
    );

    console.log(rows);

    await client.end();

    return rows[0];
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    // Code here
  }
};
