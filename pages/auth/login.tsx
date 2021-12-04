import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { Button, Input, Modal } from '@components/beluga';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoadingScreen from '@components/LoadingScreen';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from '@firebase/firestore';

export default function Login() {

    const router = useRouter();
    const auth = getAuth();
    const [user, userLoading] = useAuthState(auth);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmCode, setConfirmCode] = useState("");
    const [formError, setFormError] = useState("");
    const [confirmationResult, setConfirmationResult]: any = useState(null);
    const db = getFirestore();

    const checkAndSetUserDetails = async () => {
        if (!user) return;

        const docRef = doc(db, "users", user.uid);
        const data = await getDoc(docRef);

        // If user does not exist, create entry for them
        if (!data.exists)
            await setDoc(docRef, { uid: user.uid, role: "default", phoneNumber, updatedAt: new Date() });

        router.push("/");
    }


    const login = async (e: any) => {
        e.preventDefault();

        try {
            const applicationVerifier = new RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
            }, auth);

            const confirmationResult = await signInWithPhoneNumber(auth, "+1" + phoneNumber, applicationVerifier);

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
    if (userLoading || (!userLoading && user)) return <LoadingScreen />;

    return (
        <div className="flex-1 flex items-center justify-center">
            {showConfirm && <Modal onClose={() => setShowConfirm(false)}>
                <form onSubmit={verifyConfirmationCode} className="grid gap-2">
                    <Input value={confirmCode} onChange={e => setConfirmCode(e.target.value)} type="tel" />
                    <Button type="submit">
                        Verify
                    </Button>
                </form>
            </Modal>}
            <div className="w-full max-w-sm rounded-lg mx-2 sm:px-8 sm:py-12 p-4 my-6 bg-white border border-gray-300">
                <h3 className="text-center font-light text-3xl mt-4 mb-6">
                    Login
                </h3>

                <div id="recaptcha-container"></div>

                <form className="grid gap-2" onSubmit={login}>
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
