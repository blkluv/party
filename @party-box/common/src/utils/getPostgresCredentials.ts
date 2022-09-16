import { SecretsManager } from "@aws-sdk/client-secrets-manager";

interface PostgresCredentials {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

const getPostgresCredentials = async (stage: string): Promise<PostgresCredentials> => {
  const secretsManager = new SecretsManager({});
  // Get Postgres access
  const { SecretString: pgSecretString } = await secretsManager.getSecretValue({
    SecretId: "prod/party-box/pg",
  });
  if (!pgSecretString) throw new Error("Postgres secret was undefined.");
  const pgAccess = JSON.parse(pgSecretString);

  return {
    user: pgAccess.username,
    password: pgAccess.password,
    host: pgAccess.host,
    port: pgAccess.port,
    database: stage,
  };
};

export default getPostgresCredentials;
