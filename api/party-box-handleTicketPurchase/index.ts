import {
  APIGatewayEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventStageVariables,
  APIGatewayProxyResultV2,
} from "aws-lambda";
import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { Client } from "pg";
import stripe from "stripe";

interface PathParameters extends APIGatewayProxyEventPathParameters {
  eventId: string;
}

interface StageVariables extends APIGatewayProxyEventStageVariables {
  websiteUrl: string;
}

/**
 * @method POST
 * @description Create event within Postgres and Stripe
 */
export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  console.log(event);
  const secretsManager = new SecretsManager({});

  try {
    const { websiteUrl } = event.stageVariables as StageVariables;
    const { stage } = event.requestContext;
    const { eventId } = event.pathParameters as PathParameters;

    // Get stripe keys
    const { SecretString: stripeSecretString } = await secretsManager.getSecretValue({
      SecretId: `${stage}/party-box/stripe`,
    });
    if (!stripeSecretString) throw new Error("Access keys string was undefined.");
    const { secretKey: stripeSecretKey } = JSON.parse(stripeSecretString);
    const stripeClient = new stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

    return {};
  } catch (error) {
    console.error(error);
    throw error;
  }
};
