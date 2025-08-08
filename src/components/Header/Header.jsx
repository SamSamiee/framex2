import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { AuthContext } from "../../Contexts/AuthContext";
import styles from "./styles.module.css";
import Modal from "../Modal/Modal";
import InsertCard from "../InsertCard/InsertCard";
import { InsertContext } from "../../Contexts/InsertProvider";
import { motion } from "framer-motion";

const MOTION = {
	type: "spring",
	stiffness: 400,
	damping: 28,
};

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
		<motion.div
			className={`${styles.headerWrapper} ${isOpen ? styles.Open : undefined}`}
			layout={true}
			transition={MOTION}
			initial={{
				borderRadius: 20,
			}}>
			<motion.div
				transition={MOTION}
				className={styles.motionWrapper}
				layout={"position"}>
				<motion.nav layout={"position"} className={styles.header}>
					<button
						className={styles.profilePicture}
						onClick={() => {
							setIsOpen((c) => !c);
						}}>
						<img src={currentUser?.photoURL} alt="user's profile picture" />
					</button>
					{isOpen && (
						<>
							<button className={styles.button} onClick={logout}>
								log out
							</button>
							<button className={styles.button}>connect X</button>
						</>
					)}
					<motion.div transition={MOTION} layout={true}>
						<Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
							<InsertCard modalOpen={modalOpen} setModalOpen={setModalOpen} />
						</Modal>
					</motion.div>
				</motion.nav>
			</motion.div>
		</motion.div>
	);
}

export default Header;
