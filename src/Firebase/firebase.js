import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Initialize Firebase
const config = {    
    apiKey: "AIzaSyBTcs55wJ33UZ0z70Tnucu7XpZ9_SKBek0",
    authDomain: "hdscreen-d0f14.firebaseapp.com",
    projectId: "hdscreen-d0f14",
    storageBucket: "hdscreen-d0f14.firebasestorage.app",
    messagingSenderId: "781109155611",
    appId: "1:781109155611:web:c904e28f2ffc647af9a5be", 
    measurementId: "G-J9K99SES79"
};

const firebaseApp = initializeApp(config);

// Initialize the Firestore database
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth, firebaseApp };