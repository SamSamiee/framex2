import React, { useEffect } from "react";
import styles from "./styles.module.css";
import FocusLock from "react-focus-lock";
import { RemoveScroll } from "react-remove-scroll";

function Modal({ children, modalOpen, setModalOpen }) {
	return (
		<RemoveScroll>
			<div className={styles.wrapper}>
				<div className={styles.backdrop} onClick={() => setModalOpen(false)}>
					<FocusLock>
						<div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
							{children}
						</div>
					</FocusLock>
				</div>
			</div>
		</RemoveScroll>
	);
}

export default Modal;
