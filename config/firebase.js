import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/storage";

const devConfig = {
    apiKey: "AIzaSyAKsbyLZ5ztO4pMOUOSN3oemoZcjFq9wuU",
    authDomain: "paid-to-party-dev.firebaseapp.com",
    projectId: "paid-to-party-dev",
    storageBucket: "paid-to-party-dev.appspot.com",
    messagingSenderId: "955505292424",
    appId: "1:955505292424:web:760408ba923cfe8cba1b3d",
    measurementId: "G-3Y1N4P2WGZ"
};

const prodConfig = {
    apiKey: "AIzaSyDTyweuMMEln6c0g4ePWfja2z2XJcFGt5Q",
    authDomain: "party-box-production.firebaseapp.com",
    projectId: "party-box-production",
    storageBucket: "party-box-production.appspot.com",
    messagingSenderId: "526378114745",
    appId: "1:526378114745:web:8d2398614b7c096ed6c568",
    measurementId: "G-42FNWE2D96"
};

const firebaseConfig = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    // firebase.auth().useDeviceLanguage();
}

export const providers = {
    google: new firebase.auth.GoogleAuthProvider(),
    // phone: new firebase.auth.PhoneAuthProvider()
};

export const db = firebase.firestore();
export const storage = firebase.storage();

export default firebase;
