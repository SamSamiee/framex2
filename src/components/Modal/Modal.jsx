import React, { useEffect } from "react";
import styles from "./styles.module.css";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";
import { Plus } from "react-feather";

function Modal({ children }) {
	const [modalOpen, setModalOpen] = React.useState(false);

	React.useEffect(() => {
		function handleEsc(e) {
			console.log("hi");
			if (e.key === "Escape") {
				setModalOpen(false);
			}
		}

		window.addEventListener("keydown", (e) => {
			handleEsc(e);
		});

		return () => window.removeEventListener("keydown", handleEsc);
	}, []);
	const modalOpenButtonStyle = modalOpen ? { position: "fixed" } : undefined;
	const modalOpenWrapperStyle = modalOpen
		? { position: "fixed", width: "100vw", height: "100vh" }
		: undefined;
	return (
		<FocusLock>
			<div className={styles.wrapper} style={modalOpenWrapperStyle}>
				<button
					style={modalOpenButtonStyle}
					className={`${styles.add} ${modalOpen ? styles.open : undefined}`}
					onClick={() => setModalOpen((c) => !c)}>
					<Plus />
				</button>
				{modalOpen && (
					<RemoveScroll>
						<div
							className={styles.backdrop}
							onClick={() => setModalOpen(false)}>
							<div
								className={styles.dialog}
								onClick={(e) => e.stopPropagation()}>
								{children}
							</div>
						</div>
					</RemoveScroll>
				)}
			</div>
		</FocusLock>
	);
}

export default Modal;
