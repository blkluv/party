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

  const cognito = new CognitoIdentityProvider({ region: "us-east-1" });

  const devSql = await getPostgresClient("dev");
  const prodSql = await getPostgresClient("prod");
  try {
    const userData = {
      id: event.request.userAttributes.sub,
      name: event.request.userAttributes.name,
      email: event.request.userAttributes.email,
      roles: ["user"],
    };

    await devSql`
        INSERT INTO "users" ${devSql(userData)}
        `;
    await prodSql`
        INSERT INTO "users" ${devSql(userData)}
        `;
    console.log("User created in prod database.");

    await cognito.adminAddUserToGroup({
      GroupName: "user",
      UserPoolId: userPoolId,
      Username: userName,
    });

    console.log("Group added in Cognito");

    return callback(null, event);
  } catch (error) {
    console.error(error);
    return callback(error as Error, event);
  } finally {
    await devSql.end();
    await prodSql.end();
  }
};
