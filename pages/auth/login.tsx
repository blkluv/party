import React, { useRef, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase, { db } from "@config/firebase";
import { useRouter } from 'next/dist/client/router';
import Loading from '@components/Loading';
import { BsFillUnlockFill as LockIcon } from "react-icons/bs";
import { Button, Input } from '@components/FormComponents';
import Modal from '@components/Modal';

export default function Login() {

    const router = useRouter();
    const [user, userLoading] = useAuthState(firebase.auth());
    const [phoneNumber, setPhoneNumber] = useState("");
    // const [name, setName] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmCode, setConfirmCode] = useState("");
    const [formError, setFormError] = useState("");
    const [confirmationResult, setConfirmationResult]: any = useState(null);
    const confirmRef = useRef();

    const checkAndSetUserDetails = async () => {
        if (!user) return;

        const data = await db.collection("users").doc(user.uid).get();

        // If user does not exist, create entry for them
        if (!data.exists)
            await db.collection("users").doc(user.uid).set({ uid: user.uid, role: "default", phoneNumber })

        router.push("/");
    }


    const login = async (e: any) => {
        e.preventDefault();

        try {
            const applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
            });

            const confirmationResult = await firebase.auth().signInWithPhoneNumber("+1" + phoneNumber, applicationVerifier);

            setConfirmationResult(confirmationResult);
            setShowConfirm(true);

        } catch (error) {
            console.log(error);
            setFormError("Error - Bad login")
        }
    }

    const verifyConfirmationCode = (e: any) => {
        e.preventDefault();
        if (confirmationResult === null) return;
        confirmationResult.confirm(confirmCode);
    }

    // There exists a user locally. Create one in db
    if (!userLoading && user) checkAndSetUserDetails();

    // User is loading or user exists
    if (userLoading || (!userLoading && user)) return <Loading />;

    return (
        <div className="flex-1 flex items-center justify-center">
            {showConfirm && <Modal setOpen={setShowConfirm} ref={confirmRef}>
                <form onSubmit={verifyConfirmationCode} className="grid gap-2">
                    <Input value={confirmCode} onChange={e => setConfirmCode(e.target.value)} type="tel" />
                    <Button type="submit">
                        Verify
                    </Button>
                </form>
            </Modal>}
            <div className="w-full max-w-sm rounded-lg mx-2 sm:px-8 sm:py-12 p-4 my-6 bg-white border border-gray-300">
                <div className="my-2 flex justify-center">
                    <LockIcon className="w-6 h-6" />
                </div>
                <h3 className="text-center font-light text-3xl mt-4 mb-6">
                    Login
                </h3>

                <div id="recaptcha-container"></div>

                <form className="grid gap-2" onSubmit={login}>
                    {/* <Input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Name" minLength={2} /> */}
                    <Input onChange={(e) => setPhoneNumber(e.target.value)} value={phoneNumber} type="tel" maxLength={10} minLength={10} placeholder="Phone Number" />
                    <Button type="submit" id="submit-button">
                        Submit
                    </Button>

                    {formError.length > 0 && <p className="text-sm text-red-400 text-center">{formError}</p>}
                </form>

            </div>
        </div>
    )
}
