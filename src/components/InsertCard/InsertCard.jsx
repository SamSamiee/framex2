import React from "react";
import { Trash, Twitter } from "react-feather";
import styles from "./styles.module.css";
import PictureFrame from "../PictureFrame";
import DynamicGrid from "../DynamicGrid";
import Timer from "../Timer";
import { useMediaQuery } from "react-responsive";

function InsertCard({ frames=4, onScheduleChange, scheduleDetail }) {
	const [frameNumber, setFrameNumber] = React.useState(frames);
	const isMobile = useMediaQuery({ maxWidth: 1000 });

	const size = "2em";
	return isMobile ? (
		<div className={styles.cart}>
			<textarea className={styles.Text} placeholder="Description..." />
			<PictureFrame frameNumber={frameNumber} size={size} />
			<div className={styles.controller}>
				<div className={styles.adjust}>
					<Trash size={size} />
					<Timer
						size={size}
						onScheduleChange={onScheduleChange}
						scheduleDetail={scheduleDetail}
					/>
					<DynamicGrid
						size={size}
						frameNumber={frameNumber}
						setFrameNumber={setFrameNumber}
					/>
				</div>
			</div>
			<div className={styles.Buttons}>
				<button className={`${styles.Button} ${styles.twitter}`}>
					<p style={{ color: "white" }}>add</p>
				</button>
				<button className={`${styles.Button} ${styles.twitter}`}>
					<Twitter size={size} color="white" />
				</button>
			</div>
		</div>
	) : (
		<div className={styles.cart}>
			<PictureFrame frameNumber={frameNumber} size={size} />
			<div className={styles.side}>
				<textarea className={styles.Text} placeholder="Description..." />
				<div className={styles.controller}>
					<div className={styles.adjust}>
						<Trash size={size} />
						<Timer
							size={size}
							onScheduleChange={onScheduleChange}
							scheduleDetail={scheduleDetail}
						/>
						<DynamicGrid
							size={size}
							frameNumber={frameNumber}
							setFrameNumber={setFrameNumber}
						/>
					</div>
					<div className={styles.Buttons}>
						<button className={`${styles.Button} ${styles.twitter}`}>
							<p style={{ color: "white" }}>add</p>
						</button>
						<button className={`${styles.Button} ${styles.twitter}`}>
							<Twitter size={size} color="white" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InsertCard;
