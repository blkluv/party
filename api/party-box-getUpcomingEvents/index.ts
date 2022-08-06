// import { getPostgresClient, PartyBoxEvent } from "@party-box/common";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { stage } = event.requestContext;
  const secretsManager = new SecretsManager({});
  // Get Postgres access
  const { SecretString: pgSecretString } = await secretsManager.getSecretValue({
    SecretId: "prod/party-box/pg",
  });
  if (!pgSecretString) throw new Error("Postgres secret was undefined.");
  const pgAccess = JSON.parse(pgSecretString);

  const client = new Client({
    user: pgAccess.username,
    password: pgAccess.password,
    host: pgAccess.host,
    port: pgAccess.port,
    database: stage,
  });

  await client.connect();

  try {
    // const events = await pg<PartyBoxEvent>("events")
    //   .select("id", "startTime", "endTime", "name", "description", "hashtags", "maxTickets", "thumbnail")
    //   .where("published", "=", true)
    //   .andWhere("startTime", ">", new Date().toISOString());

    const events = await client.query(`
      SELECT id, "startTime", "endTime", name, description, hashtags, "maxTickets", thumbnail
      FROM events
      WHERE published = true
      AND "startTime" > NOW();
    `);

    return { statusCode: 200, body: JSON.stringify(events) };
  } catch (error) {
    console.error(error);

    return { statusCode: 500, body: JSON.stringify(error) };
  } finally {
    await client.end();
  }
};
