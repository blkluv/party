import getLocalStorage from "@utils/getLocalStorage";
import toggleDarkMode from "@utils/toggleDarkMode";
import { createContext, useEffect, useState } from "react";
import { getAuth } from "@firebase/auth";
import { getFirestore, setDoc, doc } from "@firebase/firestore";

const Context = createContext({
    darkMode: false,
    toggleDarkMode: () => { },
    currentClickEvent: null,
    auth: { user: null, loading: false }
});

export const Provider = ({ children, ...props }: any) => {
    const [darkMode, setDarkMode] = useState(false);
    const [currentClickEvent, setCurrentClickEvent] = useState(false);
    const firebaseAuth = getAuth();
    const db = getFirestore();

    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    const darkModeHandler = () => {
        toggleDarkMode();
        setDarkMode(!darkMode);
    }

    const handleClickEvent = (e: any) => {
        setCurrentClickEvent(e);
    }

    useEffect(() => {
        try {
            const { value } = getLocalStorage("darkMode");
            toggleDarkMode(value);
            setDarkMode(value);
        } catch (e) {
            return;
        }

        firebaseAuth.onAuthStateChanged(async (user) => {
            setUserLoading(true);

            if (user) {
                const { displayName, photoURL, uid, email, phoneNumber } = user;
                const userData = {
                    displayName,
                    photoURL,
                    uid,
                    email,
                    phoneNumber,
                };

                setUser(userData);

                await setDoc(doc(db, "users", user.uid), userData);
            } else {
                setUser(null);
            }

            setUserLoading(false);
        });
    }, [])

    return (
        <Context.Provider value={{
            darkMode,
            toggleDarkMode: darkModeHandler,
            currentClickEvent,
            auth: { user, loading: userLoading }
        }}>
            <div onMouseDown={handleClickEvent} onTouchEnd={handleClickEvent}>
                {children}
            </div>
        </Context.Provider >
    )
}

export default Context;
