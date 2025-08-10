import React from "react";
import styles from "./styles.module.css";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase-config";

function LoginPage() {
	async function signInWithGoogle() {
		try {
			await signInWithPopup(auth, googleProvider);
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.card}>
				<p>let's get you signed in:</p>
				<button onClick={() => signInWithGoogle()} className={styles.signInBtn}>
					<FcGoogle />
					Sign in with Google
				</button>
			</div>
		</div>
	);
}

export default LoginPage;
