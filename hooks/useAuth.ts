import { getAuth } from "firebase/auth";
import { useState } from "react";

export default function useAuth() {
    const [auth, setAuth] = useState(null);

    const firebaseAuth = getAuth();
    firebaseAuth.onAuthStateChanged(user => {
        if (user) {
            setAuth(user);
        }
    });

    return auth;
}