import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { AuthContext } from "../../Contexts/AuthContext";
import styles from "./styles.module.css";

function Header() {
	async function logout() {
		try {
			await signOut(auth);
		} catch (err) {
			console.log(err);
		}
	}

	const currentUser = React.useContext(AuthContext);
	console.log(currentUser.photoURL)
	return (
		<nav>
			<div className={styles.profilePicture}>
				<img src={currentUser?.photoURL} alt="user's profile picture" />
			</div>
			<button onClick={logout}>log out</button>
		</nav>
	);
}

export default Header;
