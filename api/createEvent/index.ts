import { APIGatewayEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";

interface Body {
  name: string;
  description: string;
  startTime: string;
  endTime?: string;
  location: string;
  ownerId: string;
  maxTickets: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResultV2<{ message: string }>> => {
  try {
    const secretsManager = new AWS.SecretsManager({ region: "us-east-1" });
    const { name, description, startTime, endTime, location, ownerId, maxTickets } = JSON.parse(
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
      "insert into events(name,description,startTime,endTime,maxTickets,location,ownerId) values($1,$2,$3,$4,$5,$6,$7) returning *",
      [name, description, startTime, endTime, maxTickets, location, ownerId]
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
