import { Auth } from "aws-amplify";
import { useState } from "react";

const useAuth = () => {
  const [auth, setAuth] = useState(async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (e) {
      return null;
    }
  });

  return null;
};

export default useAuth;
