import React, { useEffect } from 'react'
import firebase from "@config/firebase";
import Loading from '@components/Loading';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from "next/router";

export default function Logout() {
    const router = useRouter();
    const [user, loading] = useAuthState(firebase.auth());

    const signOut = async () => {
        await firebase.auth().signOut();
    };

    useEffect(() => {
        signOut();
    }, []);

    // If there is no login
    if (!user && !loading) router.push("/");

    return <Loading />
}
