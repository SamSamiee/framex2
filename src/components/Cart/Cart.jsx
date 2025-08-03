import React from "react";
import { Trash, Twitter } from "react-feather";
import styles from "./styles.module.css";
import FourSquare from "../FourSquare";

function Cart({ urls, children, onScheduleChange, scheduleDetail, id }) {
	const size = "2em";
	return (
		<div className={styles.cart}>
			<p className={styles.p}>{children}</p>
			<FourSquare urls={urls} />
			<div className={styles.controller}>
				<button className={`${styles.Button} ${styles.twitter}`}>
					<Twitter size={size} color="white" />
				</button>
				<div className={styles.adjust}>
					<button>
					<Trash size={size} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default Cart;
