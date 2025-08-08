import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { AuthContext } from "../../Contexts/AuthContext";
import styles from "./styles.module.css";
import Modal from "../Modal/Modal";
import InsertCard from "../InsertCard/InsertCard";
import { InsertContext } from "../../Contexts/InsertProvider";

function Header() {
	const [isOpen, setIsOpen] = React.useState(false);
	const { modalOpen, setModalOpen } = React.useContext(InsertContext);
	async function logout() {
		try {
			await signOut(auth);
		} catch (err) {
			console.error(err);
		}
	}

	const currentUser = React.useContext(AuthContext);
	return (
		<div className={styles.headerWrapper}>
			<nav className={styles.header}>
				<button
					className={styles.profilePicture}
					onClick={() => {
						setIsOpen((c) => !c);
					}}>
					<img src={currentUser?.photoURL} alt="user's profile picture" />
				</button>
				{/* <h1>FrameX</h1> */}
				{isOpen && (
					<div className={styles.expandWrapper}>
						<button className={styles.button} onClick={logout}>log out</button>
						<button className={styles.button}>connect X</button>
					</div>
				)}
			</nav>
			<Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
				<InsertCard modalOpen={modalOpen} setModalOpen={setModalOpen} />
			</Modal>
		</div>
	);
}

export default Header;
