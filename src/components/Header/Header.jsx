import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useAuth } from "../../Contexts/AuthContext";

function Header() {
	async function logout() {
		try {
			await signOut(auth);
		} catch (err) {
			console.log(err);
		}
	}

	const currentUser = useAuth()?.currentUser;

	return (
		<navbar>
			<image src={currentUser?.photoURL} />
			<button onClick={logout}>log out</button>
		</navbar>
	);
}

export default Header;
