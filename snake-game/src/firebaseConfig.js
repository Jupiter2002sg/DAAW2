import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBlF4Z4X-NbrUj5lSInahdZ_O4OcqsN1fg",
    authDomain: "game-sarah.firebaseapp.com",
    projectId: "game-sarah",
    storageBucket: "game-sarah.firebasestorage.app",
    messagingSenderId: "793846298187",
    appId: "1:793846298187:web:c78bd00ce269e24486ffce",
    measurementId: "G-0BN5MTYJ83",
    databaseURL: "https://game-sarah-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue, remove };