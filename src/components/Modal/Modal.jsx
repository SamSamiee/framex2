import React from "react";
import styles from "./styles.module.css";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";
import { Plus } from "react-feather";
import { InsertContext } from "../../Contexts/InsertProvider";


function Modal({ children, modalOpen, setModalOpen }) {
	const { clearInsertData } = React.useContext(InsertContext);

	React.useEffect(() => {
		function handleEsc(e) {
			if (e.key === "Escape") {
				setModalOpen(false);
				clearInsertData();
			}
		}

		window.addEventListener("keydown", (e) => {
			handleEsc(e);
		});

		return () => window.removeEventListener("keydown", handleEsc);
	}, [setModalOpen, clearInsertData]);

	const handleModalClose = () => {
		setModalOpen(false);
		clearInsertData();
	};

	const modalOpenButtonStyle = modalOpen ? { position: "fixed" } : undefined;
	return (
		<>
			<button
				// style={modalOpenButtonStyle}
				className={`${styles.add} ${modalOpen ? styles.open : undefined}`}
				onClick={() => setModalOpen((c) => !c)}>
				<Plus size="2em" />

			</button>
			{modalOpen && (
				<FocusLock>
					<RemoveScroll>
						<div className={styles.wrapper}>
							<div className={styles.backdrop} onClick={handleModalClose}>
								<div
									className={styles.dialog}
									onClick={(e) => e.stopPropagation()}>
									{children}
								</div>
							</div>
						</div>
					</RemoveScroll>
				</FocusLock>
			)}
		</>
	);
}

export default Modal;
