import { UseAuthenticator } from "@aws-amplify/ui-react/dist/types/components/Authenticator/hooks/useAuthenticator";

/**
 * Extract user groups from an ugly Cognito user object
 * @param user 
 * @returns 
 */
const getUserGroups = (user: UseAuthenticator["user"]) => {
  return user?.getSignInUserSession().getIdToken().payload["cognito:groups"];
};

export default getUserGroups;
