import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import knex from "knex";

const getPostgresClient = async (stage: string) => {
  const secretsManager = new SecretsManager({});
  // Get Postgres access
  const { SecretString: pgSecretString } = await secretsManager.getSecretValue({
    SecretId: "prod/party-box/pg",
  });
  if (!pgSecretString) throw new Error("Postgres secret was undefined.");
  const pgAccess = JSON.parse(pgSecretString);

  const pg = knex({
    client: "pg",
    connection: {
      user: pgAccess.username,
      password: pgAccess.password,
      host: pgAccess.host,
      port: pgAccess.port,
      database: stage,
    },
  });

  return pg;
};

export default getPostgresClient;
