import { UseAuthenticator } from "@aws-amplify/ui-react/dist/types/components/Authenticator/hooks/useAuthenticator";

/**
 * @param user Current signed in user.
 * @returns True if the user is in the "admin" group. False otherwise.
 */
const isUserAdmin = (user: UseAuthenticator["user"]): boolean => {
  return user
    ?.getSignInUserSession()
    .getIdToken()
    .payload["cognito:groups"].some((group: string) => group === "admin");
};

export default isUserAdmin;
