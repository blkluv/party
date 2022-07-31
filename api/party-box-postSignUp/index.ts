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
  const { userPoolId, userName } = event;

  try {
    const params = {
      GroupName: "user",
      UserPoolId: userPoolId,
      Username: userName,
    };

    const pgDev = await getPostgresClient("dev");
    // const pgProd = await getPostgresClient("prod");

    console.log(pgDev);
    // console.log(pgProd);

    const userData = {
      id: userName,
      name: event.request.userAttributes.name,
      email: event.request.userAttributes.email,
      roles: ["user"],
    };

    await pgDev("users").insert(userData);

    const cognito = new CognitoIdentityProvider({ region: "us-east-1" });

    await cognito.adminAddUserToGroup(params);

    return callback(null, event);
  } catch (error) {
    console.error(error);
    return callback(error as Error, event);
  }
};
