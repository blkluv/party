import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase, { db, providers } from "@config/firebase";
import { useRouter } from 'next/dist/client/router';
import Loading from '@components/Loading';
import { AiOutlineLoading as LoadingIcon } from "react-icons/ai";
import { BsFillUnlockFill as LockIcon } from "react-icons/bs";
import { FcGoogle as GoogleIcon } from "react-icons/fc";

export default function Login() {

    const router = useRouter();
    const [user, userLoading] = useAuthState(firebase.auth());
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const checkAndSetUserDetails = async () => {
        if (!user) return;

        const data = await db.collection("users").doc(user.uid).get();

        // If user does not exist, create entry for them
        if (!data.exists)
            await db.collection("users").doc(user.uid).set({ uid: user.uid, name: user.displayName, role: "default" })

        router.push("/");
    }

    if (!userLoading && user) checkAndSetUserDetails();

    const loginUser = (provider: string) => async (e: any) => {
        e.preventDefault();

        try {
            setLoading(true);
            await firebase.auth().signInWithRedirect(providers[provider]);

            setLoading(false);
        } catch (error) {
            setError("Bad Login");
        }
    }

    if (userLoading || (!userLoading && user)) return <Loading />;

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm rounded-lg mx-2 sm:px-8 sm:py-12 p-4 my-6 bg-white border border-gray-300">
                <div className="my-2 flex justify-end">
                    <LockIcon className="w-6 h-6" />
                </div>
                <h3 className="text-center font-thin text-3xl mt-4 mb-6">
                    Login
                </h3>

                <div className="grid gap-2">
                    <div className="py-2 rounded-md hover:bg-gray-100 hover:shadow-lg transition grid grid-cols-4 cursor-pointer border border-gray-300 items-center" onClick={loginUser("google")}>
                        <GoogleIcon className="w-8 h-8 mx-auto col-start-1 col-span-1 transition" />
                        <p className="capitalize font-medium col-start-2 col-span-3 text-lg">Google</p>
                    </div>
                </div>
                {loading && <LoadingIcon className="w-6 h-6 mx-auto fill-current text-gray-400 mt-4 animate-spin" />}
            </div>
        </div>
    )
}
