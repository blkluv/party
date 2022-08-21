import { UseAuthenticator } from "@aws-amplify/ui-react/dist/types/components/Authenticator/hooks/useAuthenticator";

const getUserAttributes = (user: UseAuthenticator["user"]) => {
  if (!user) return null;
  return user.getSignInUserSession().getIdToken().payload;
};

export default getUserAttributes;
