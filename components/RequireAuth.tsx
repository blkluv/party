import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "@components/LoadingScreen";
import useAuth from "hooks/useAuth";

export interface RequireAuthProps {
  children: any;
  allowRoles?: string[];
}

export default function RequireAuth({ children, allowRoles }: RequireAuthProps) {
  const router = useRouter();

  const [user, loading] = useAuth();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    (async () => {

      // If the user is loading, we don't want to do anything
      if (loading) return;
      if (user === null)
        return setStatus("rejected");

      const { role } = user;

      // If the user is an admin or is of a valid role, we're good
      if (role === "admin" || (allowRoles?.length && allowRoles?.includes(role)) || !allowRoles)
        setStatus("approved");
      else
        setStatus("rejected");

    })()
  }, [user, router, allowRoles, loading]);

  useEffect(() => {
    // Checks are set but don't pass
    if (status === "rejected") {
      router.push("/error/403");
    }
  }, [router, status])

  if (status === "approved") return children;

  return <LoadingScreen />;
}