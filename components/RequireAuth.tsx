import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingScreen from "@components/LoadingScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import { getDoc, doc, getFirestore } from "@firebase/firestore";

export interface RequireAuthProps {
  children: any;
  allowRoles?: string[];
}

export default function RequireAuth({ children, allowRoles }: RequireAuthProps) {
  const router = useRouter();
  const db = getFirestore();

  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [checksPass, setChecksPass] = useState(false);

  useEffect(() => {
    (async () => {

      // If the user is loading, we don't want to do anything
      if (loading) return;

      // Get the user document
      const docRef = doc(db, `users/${user?.uid}`);
      const userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        const { role } = userDoc.data();

        // If the user is an admin or is of a valid role, we're good
        if (role === "admin" || (allowRoles?.length && !allowRoles?.includes(role)) || allowRoles?.length === 0 || !allowRoles)
          setChecksPass(true);
      } else {
        router.push("/error/403");
      }
    })()

  }, [user]);


  if (checksPass) return children;

  return <LoadingScreen />;
}