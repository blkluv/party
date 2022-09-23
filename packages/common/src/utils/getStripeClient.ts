import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import stripe from "stripe";

/**
 * Returns a Stripe client using credentials from AWS Secrets Manager
 * @param stage Stage that this function is running in
 * @returns The stripe client
 */
const getStripeClient = async (stage: string) => {
  const secretsManager = new SecretsManager({ region: "us-east-1" });

  // Get stripe access keys
  const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
    SecretId: `${stage}/party-box/stripe`,
  });
  if (!stripeSecretString) throw new Error("Access keys string was undefined.");
  const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);

  const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2022-08-01" });

  return stripeClient;
};

export default getStripeClient;
