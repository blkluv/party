import { UseAuthenticator } from "@aws-amplify/ui-react/dist/types/components/Authenticator/hooks/useAuthenticator";

/**
 * @param user Current signed in user.
 * @returns True if the user is in the "host" group. False otherwise.
 */
const isUserHost = (user?: UseAuthenticator["user"]): boolean => {
  if (!user) return false;

  return user
    ?.getSignInUserSession()
    .getIdToken()
    .payload["cognito:groups"].some((group: string) => group === "host");
};

export default isUserHost;
