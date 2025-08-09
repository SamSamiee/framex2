import React from "react";
import { AuthContext } from "./AuthContext";
import { doc, getDoc, setDoc, deleteDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";
import twitterService from "../services/twitterService";

export const TwitterContext = React.createContext();

export function TwitterProvider({ children }) {
	const currentUser = React.useContext(AuthContext);
	const [twitterConnected, setTwitterConnected] = React.useState(false);
	const [twitterToken, setTwitterToken] = React.useState(null);

	// Check if user has connected Twitter account
	React.useEffect(() => {
		if (currentUser) {
			checkTwitterConnection();
		}
	}, [currentUser]);

	const checkTwitterConnection = async () => {
		// Check if user has Twitter tokens stored in Firestore
		try {
			const tokenDoc = doc(db, "twitterTokens", currentUser.uid);
			const tokenSnapshot = await getDoc(tokenDoc);

			if (tokenSnapshot.exists()) {
				const tokenData = tokenSnapshot.data();
				setTwitterToken(tokenData);
				setTwitterConnected(true);
			}
		} catch (err) {
			console.error("Error checking Twitter connection:", err);
			console.error("Full error details:", err);
			// Fallback to localStorage for now
			try {
				const storedToken = localStorage.getItem(
					`twitter_token_${currentUser.uid}`
				);
				if (storedToken) {
					setTwitterToken(JSON.parse(storedToken));
					setTwitterConnected(true);
				}
			} catch (localErr) {
				console.error("Fallback localStorage also failed:", localErr);
			}
		}
	};

	const connectTwitter = async () => {
		try {
			// Get request token from Twitter
			const requestTokenData = await twitterService.getRequestToken();

			// Store the token secret temporarily for the callback
			sessionStorage.setItem(
				"twitter_oauth_token_secret",
				requestTokenData.oauth_token_secret
			);

			// Open Twitter authorization popup
			const popup = window.open(
				requestTokenData.auth_url,
				"twitter-auth",
				"width=600,height=600,scrollbars=yes,resizable=yes"
			);

			// Listen for messages from the popup
			const handleMessage = (event) => {
				if (event.origin !== window.location.origin) return;

				if (event.data.type === "TWITTER_AUTH_SUCCESS") {
					popup.close();
					window.removeEventListener("message", handleMessage);
					alert("Twitter connected successfully! 🐦");
				} else if (event.data.type === "TWITTER_AUTH_ERROR") {
					popup.close();
					window.removeEventListener("message", handleMessage);
					alert("Failed to connect Twitter: " + event.data.error);
				}
			};

			window.addEventListener("message", handleMessage);

			// Check if popup was closed manually
			const checkClosed = setInterval(() => {
				if (popup.closed) {
					clearInterval(checkClosed);
					window.removeEventListener("message", handleMessage);
					sessionStorage.removeItem("twitter_oauth_token_secret");
				}
			}, 1000);
		} catch (err) {
			console.error("Error connecting Twitter:", err);
			alert("Failed to connect Twitter. Please try again.");
			sessionStorage.removeItem("twitter_oauth_token_secret");
		}
	};

	const saveTwitterToken = async (tokenData) => {
		try {
			// Try to save Twitter tokens to Firestore first
			const tokenDoc = doc(db, "twitterTokens", currentUser.uid);
			const dataToSave = {
				...tokenData,
				userId: currentUser.uid,
				connectedAt: new Date(),
			};

			await setDoc(tokenDoc, dataToSave);

			// Update local state
			setTwitterToken(dataToSave);
			setTwitterConnected(true);
		} catch (err) {
			console.error("Error saving Twitter token to Firestore:", err);
			console.error("Full error details:", err);

			// Fallback to localStorage
			try {
				const dataToSave = {
					...tokenData,
					userId: currentUser.uid,
					connectedAt: new Date(),
				};

				localStorage.setItem(
					`twitter_token_${currentUser.uid}`,
					JSON.stringify(dataToSave)
				);

				// Update local state
				setTwitterToken(dataToSave);
				setTwitterConnected(true);

				console.log("Saved to localStorage as fallback");
			} catch (localErr) {
				console.error("Fallback localStorage also failed:", localErr);
				throw localErr;
			}
		}
	};

	const disconnectTwitter = async () => {
		try {
			// Try to remove tokens from Firestore
			const tokenDoc = doc(db, "twitterTokens", currentUser.uid);
			await deleteDoc(tokenDoc);
		} catch (err) {
			console.error("Error removing from Firestore (might not exist):", err);
		}

		try {
			// Also remove from localStorage
			localStorage.removeItem(`twitter_token_${currentUser.uid}`);
		} catch (err) {
			console.error("Error removing from localStorage:", err);
		}

		// Update local state regardless
		setTwitterToken(null);
		setTwitterConnected(false);
	};

	const postTweet = async (text, imageUrl = null) => {
		if (!twitterConnected || !twitterToken) {
			throw new Error("Twitter not connected");
		}

		try {
			// Verify credentials are still valid
			const verification = await twitterService.verifyCredentials(
				twitterToken.oauth_token,
				twitterToken.oauth_token_secret
			);

			if (!verification.valid) {
				// Token expired, disconnect user
				await disconnectTwitter();
				throw new Error(
					"Twitter session expired. Please reconnect your account."
				);
			}

			// Post the actual tweet
			const result = await twitterService.postTweet(
				text,
				imageUrl,
				twitterToken.oauth_token,
				twitterToken.oauth_token_secret
			);

			console.log("Tweet posted successfully:", result);
			return result;
		} catch (err) {
			console.error("Error posting tweet:", err);
			throw err;
		}
	};

	return (
		<TwitterContext.Provider
			value={{
				twitterConnected,
				connectTwitter,
				disconnectTwitter,
				postTweet,
				saveTwitterToken,
			}}>
			{children}
		</TwitterContext.Provider>
	);
}
