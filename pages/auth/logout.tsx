import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/router";
import { getAuth, signOut } from '@firebase/auth';
import LoadingScreen from '@components/LoadingScreen';

export default function Logout() {
    const router = useRouter();
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        (async () => {
            await signOut(auth);
        })();
    }, []);

    // If there is no login
    if (!user && !loading) router.push("/");

    return <LoadingScreen />
}
