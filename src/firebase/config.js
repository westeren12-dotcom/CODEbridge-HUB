// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhHYHEfaIo2X4lXIR-8ZUwltBLRyxy0sI",
  authDomain: "codebridge-hub.firebaseapp.com",
  projectId: "codebridge-hub",
  storageBucket: "codebridge-hub.firebasestorage.app",
  messagingSenderId: "1084768659663",
  appId: "1:1084768659663:web:272abfc21f0df8426aafba",
  measurementId: "G-V6C4GRSRDL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";