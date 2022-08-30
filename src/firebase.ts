// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCloNU1l5Otyv6xvt8i24n1EZHu2QsLybs",
    authDomain: "owlsinternal.firebaseapp.com",
    databaseURL: "https://owlsinternal-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "owlsinternal",
    storageBucket: "owlsinternal.appspot.com",
    messagingSenderId: "73057071136",
    appId: "1:73057071136:web:79f16715608e63c8620c45",
    measurementId: "G-40QV8J4H3J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
