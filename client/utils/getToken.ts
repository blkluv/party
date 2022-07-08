import { UseAuthenticator } from "@aws-amplify/ui-react/dist/types/components/Authenticator/hooks/useAuthenticator";

const getToken = (user: UseAuthenticator["user"]) => {
  return user?.getSignInUserSession().getAccessToken().getJwtToken();
};

export default getToken;
