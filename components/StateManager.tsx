import { toggleDarkMode } from '@redux/settings';
import getLocalStorage from '@utils/getLocalStorage';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux';

export default function StateManager() {
    const firebaseAuth = getAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        const db = getFirestore();

        try {
            const { value } = getLocalStorage("darkMode");
            dispatch(toggleDarkMode(value));
        } catch (e) {

        }

        firebaseAuth.onAuthStateChanged(async (user) => {
            if (user) {
                const { displayName, photoURL, uid, email, phoneNumber } = user;
                const userData = {
                    displayName,
                    photoURL,
                    uid,
                    email,
                    phoneNumber,
                    role: "user"
                };

                const ref = doc(db, "users", user.uid);
                const userDoc = await getDoc(ref);

                if (userDoc.exists()) {
                    // Doc exists, be conscious overwriting
                    await setDoc(ref, { ...userDoc.data() });
                } else {
                    // Doc doesn't exist. Continue with new data
                    await setDoc(ref, userData);
                }

            }
        });

    }, [firebaseAuth, dispatch]);

    return null;
}
