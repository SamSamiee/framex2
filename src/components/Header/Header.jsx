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
	const [hoveredButton, setHoveredButton] = React.useState(null);
	const id = React.useId();
	async function logout() {
		try {
			await signOut(auth);
		} catch (err) {
			console.error(err);
		}
	}

	const Buttons = [
		{ label: "logout" },
		{
			label: "connect X",
		},
	];

	const currentUser = React.useContext(AuthContext);
	return (
		<motion.div
			onMouseLeave={() => setHoveredButton(null)}
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
					{isOpen &&
						Buttons.map(({ label }) => {
							return (
								<div
									className={styles.ButtonPack}
									style={{ zIndex: hoveredButton === label ? 1 : 2 }}>
									{hoveredButton === label && (
										<motion.div
											layoutId={id}
											transition={{ duration: 0.2 }}
											className={styles.backdrop}
										/>
									)}
									<motion.button
										initial={{ opacity: 0, color: 'white' }}
										animate={{
											color: hoveredButton === label ? "black" : "#dedede",
											opacity: isOpen ? 1 : 0,
										}}
										transition={{ color: { duration: 1 }, opacity: { duration: 0.2 } }}
										className={styles.button}
										onClick={logout}
										onMouseEnter={() => setHoveredButton(label)}>
										{label}
									</motion.button>
								</div>
							);
						})}
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
