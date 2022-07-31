import { Callback, Context, PostConfirmationTriggerEvent } from "aws-lambda";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import knex from "knex";

/**
 * @method POST
 * @description Add default group to user
 */
export const handler = async (
  event: PostConfirmationTriggerEvent,
  _context: Context,
  callback: Callback
): Promise<void> => {
  const { userPoolId, userName } = event;

  try {
    const cognito = new CognitoIdentityProvider({ region: "us-east-1" });
    const secretsManager = new SecretsManager({});

    // Get Postgres access
    const { SecretString: pgSecretString } = await secretsManager.getSecretValue({
      SecretId: "prod/party-box/pg",
    });
    if (!pgSecretString) throw new Error("Postgres secret was undefined.");
    const pgAccess = JSON.parse(pgSecretString);

    const pgDev = knex({
      client: "pg",
      connection: {
        user: pgAccess.username,
        password: pgAccess.password,
        host: pgAccess.host,
        port: pgAccess.port,
        database: "dev",
      },
    });
    // const pgProd = await getPostgresClient("prod");

    const userData = {
      id: userName,
      name: event.request.userAttributes.name,
      email: event.request.userAttributes.email,
      roles: ["user"],
    };

    await pgDev("users").insert(userData);

    console.log("User created in dev database.");

    await cognito.adminAddUserToGroup({
      GroupName: "user",
      UserPoolId: userPoolId,
      Username: userName,
    });

    console.log("Group added in Cognito");

    await pgDev.destroy();

    callback(null, event);
  } catch (error) {
    console.error(error);
    callback(error as Error, event);
  }
};
