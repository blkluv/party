import React, { useEffect } from 'react'
import LoadingScreen from '@components/LoadingScreen';
import { useRouter } from "next/router";
import { getAuth, signOut } from '@firebase/auth';
import useAuth from 'hooks/useAuth';

export default function Logout() {

    const router = useRouter();
    const firebaseAuth = getAuth();
    const auth = useAuth();

    useEffect(() => {
        (async () => {
            await signOut(firebaseAuth);
        })();
    }, [firebaseAuth]);

    useEffect(() => {
        // No auth. Redirect elsewhere.
        if (!auth) router.push("/");
    }, [auth, router]);

    return <LoadingScreen />
}
