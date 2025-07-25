import React from "react";
import { Trash, Clock, Twitter } from "react-feather";
import styles from "./styles.module.css";
import PictureFrame from "../PictureFrame";
import DynamicGrid from "../DynamicGrid";
import Timer from "../Timer";

function Cart({ children, slots, onScheduleChange, scheduleDetail, id }) {
	const [frameNumber, setFrameNumber] = React.useState(slots);

	const size = "2em";
	return (
		<div className={styles.cart}>
			<p className={styles.p}>{children}</p>
			<PictureFrame frameNumber={frameNumber} size={size} />
			<div className={styles.controller}>
				<button className={`${styles.Button} ${styles.twitter}`}>
					<Twitter size={size} color="white" />
				</button>
				<div className={styles.adjust}>
					<Trash size={size} />
					<Timer
						size={size}
						onScheduleChange={onScheduleChange}
						scheduleDetail={scheduleDetail}
						id={id}
					/>
					<DynamicGrid
						size={size}
						frameNumber={frameNumber}
						setFrameNumber={setFrameNumber}
					/>
				</div>
			</div>
		</div>
	);
}

export default Cart;
