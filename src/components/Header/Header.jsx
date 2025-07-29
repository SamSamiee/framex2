import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { AuthContext } from "../../Contexts/AuthContext";
import styles from "./styles.module.css";

function Header({ children }) {
	const [isOpen, setIsOpen] = React.useState(true);
	async function logout() {
		try {
			await signOut(auth);
		} catch (err) {
			console.log(err);
		}
	}

	const currentUser = React.useContext(AuthContext);
	return (
		<nav>
			<button
				className={styles.profilePicture}
				onClick={() => {
					setIsOpen((c) => !c);
				}}>
				<img src={currentUser?.photoURL} alt="user's profile picture" />
			</button>
			{isOpen && (
				<div className={styles.expandWrapper}>
					<button onClick={logout}>log out</button>
					{children}
				</div>
			)}
		</nav>
	);
}

export default Header;
