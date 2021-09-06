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

const prodConfig = devConfig;

const firebaseConfig = process.env.NODE_ENV === "production" ? prodConfig : devConfig;

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const providers = {
    google: new firebase.auth.GoogleAuthProvider()
};

export const db = firebase.firestore();
export const storage = firebase.storage();

export default firebase;
