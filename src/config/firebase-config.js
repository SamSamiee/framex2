// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if environment variables are loaded
const requiredEnvVars = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
	.filter(([key, value]) => !value || value === "placeholder")
	.map(([key]) => key);

if (missingVars.length > 0) {
	console.error("Missing Firebase environment variables:", missingVars);
	console.error("Please check your GitHub Secrets configuration");
}

const firebaseConfig = {
	apiKey: requiredEnvVars.apiKey,
	authDomain: requiredEnvVars.authDomain,
	projectId: requiredEnvVars.projectId,
	storageBucket: requiredEnvVars.storageBucket,
	messagingSenderId: requiredEnvVars.messagingSenderId,
	appId: requiredEnvVars.appId,
	measurementId: requiredEnvVars.measurementId,
};

// Initialize Firebase variables
let auth, googleProvider, db, storage;

// Only initialize if we have valid config
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "placeholder") {
	try {
		// Initialize Firebase
		const app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);
		auth = getAuth(app);
		googleProvider = new GoogleAuthProvider();
		db = getFirestore(app);
		storage = getStorage(app);
	} catch (error) {
		console.error("Firebase initialization failed:", error);
	}
} else {
	console.error(
		"Firebase configuration is invalid. Please check environment variables."
	);
}

// Export the Firebase services
export { auth, googleProvider, db, storage };
