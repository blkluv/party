import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "@config/firebase";

export interface RequireAuthProps {
  children: any;
  allowRoles?: string[];
}

export default function RequireAuth({ children, allowRoles }: RequireAuthProps) {
  const router = useRouter();

  const [user, loading, error] = useAuthState(firebase.auth());

  useEffect(() => {

    if (user?.role === "admin") return;
    // Not loading and no user = invalid login
    if ((!loading && !user) || error || allowRoles?.includes(user?.role)) {
      router.push("/error/403");
    }
  }, [user]);

  // Not loading and user exists = valid login
  if (!loading && user) return children;

  return <Loading />;
}
