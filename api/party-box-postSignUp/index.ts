import { Callback, Context, PostConfirmationTriggerEvent } from "aws-lambda";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { getPostgresClient } from "@party-box/common";

/**
 * @method POST
 * @description Add default group to user
 */
export const handler = async (
  event: PostConfirmationTriggerEvent,
  _context: Context,
  callback: Callback
): Promise<void> => {
  try {
    const { userPoolId, userName } = event;

    const cognito = new CognitoIdentityProvider({ region: "us-east-1" });

    const pgDev = await getPostgresClient("dev");
    const pgProd = await getPostgresClient("prod");

    try {
      const userData = {
        id: userName,
        name: event.request.userAttributes.name,
        email: event.request.userAttributes.email,
        roles: ["user"],
      };

      await pgDev("users").insert(userData);
      console.log("User created in dev database.");

      await pgProd("users").insert(userData);
      console.log("User created in prod database.");

      await cognito.adminAddUserToGroup({
        GroupName: "user",
        UserPoolId: userPoolId,
        Username: userName,
      });

      console.log("Group added in Cognito");

      return callback(null, event);
    } finally {
      await pgDev.destroy();
      await pgProd.destroy();
    }
  } catch (error) {
    console.error(error);
    return callback(error as Error, event);
  }
};
