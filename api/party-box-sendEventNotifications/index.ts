import { EventBridgeEvent, Handler } from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";
import { SNS,OptInPhoneNumberCommand } from "@aws-sdk/client-sns";

/**
 * @description Check if any event notifications should be sent out
 */
export const handler = async (event: EventBridgeEvent) => {
  console.log(event);

  const secretsManager = new SecretsManager({ region: "us-east-1" });
  const sns = new SNS({ region: "us-east-1" });

  // Get postgres login
  const { SecretString } = await secretsManager.getSecretValue({ SecretId: "party-box/postgres" });
  if (!SecretString) throw new Error("Postgres login string was undefined.");
  const { username: user, password, host, port, dbname } = JSON.parse(SecretString);

  const client = new Client({
    user,
    password,
    host,
    port,
    database: dbname,
  });
  try {
    await client.connect();

    
    // Subscribe a user to the notifications topic
    await sns.send(new OptInPhoneNumberCommand({
        phoneNumber:,
    }))

    // Send a notification

    // Get all upcoming events that have not had a notification sent out

    // Send out notifcations using AWS SNS
    return {};
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};
