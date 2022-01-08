import UserDocument from "@typedefs/UserDocument";
import getNewUser from "@utils/getNewUser";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

/**
 * Hook that returns the current user as a document from firestore
 * @returns {[UserDocument, boolean]}
 */
export default function useAuth(): [UserDocument | null, boolean] {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const firebaseAuth = getAuth();
        const db = getFirestore();

        firebaseAuth.onAuthStateChanged(async (user) => {
            setLoading(true);
            if (user) {
                const ref = doc(db, "users", user.uid);
                const snapshot = await getDoc(ref);
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setAuth(data as UserDocument);
                } else {
                    let userData = getNewUser();
                    userData.displayName = user.displayName;
                    userData.email = user.email;
                    userData.phoneNumber = user.phoneNumber;
                    
                    setAuth(userData);
                    await setDoc(ref, userData);
                }
            }
            setLoading(false);
        });
    }, []);

    return [auth, loading];
}