import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { auth } from "../config/firebase-config";

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = React.useState(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, []);

	return (
		<AuthContext.Provider value={currentUser}>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = React.useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
