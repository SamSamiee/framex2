// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "placeholder",
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "placeholder",
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "placeholder",
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "placeholder",
	messagingSenderId:
		process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "placeholder",
	appId: process.env.REACT_APP_FIREBASE_APP_ID || "placeholder",
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "placeholder",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
