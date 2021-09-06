import React from "react";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "@config/firebase";

export default function RequireAuth({ children }) {
  const router = useRouter();

  const [user, loading, error] = useAuthState(firebase.auth());

  // Not loading and no user = invalid login
  if ((!loading && !user) || error) {
    router.push("/error/403");
  }

  // Not loading and user exists = valid login
  if (!loading && user) return children;

  return <Loading />;
}
