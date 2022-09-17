import { SecretsManager } from "@aws-sdk/client-secrets-manager";

const getPostgresConnectionString = async (stage: string) => {
  const secretsManager = new SecretsManager({});

  // Get Postgres access
  const { SecretString: pgSecretString } = await secretsManager.getSecretValue({
    SecretId: "prod/party-box/pg",
  });
  if (!pgSecretString) throw new Error("Postgres secret was undefined.");
  const { username, password, host } = JSON.parse(pgSecretString);

  return `postgresql://${username}:${password}@${host}/${stage}?schema=public`;
};

export default getPostgresConnectionString;
