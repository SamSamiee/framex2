import React from "react";
import styles from "./styles.module.css";

function Modal({ children }) {
	return (
		<div className={styles.wrapper}>
			<div className={styles.backdrop}>
				<div className={styles.dialog}>{children}</div>
			</div>
		</div>
	);
}

export default Modal;
