import React from "react";
import styles from "./styles.module.css";
import UploadSlot from "../UploadSlot/UploadSlot";
import { range } from "../../utils";

function PictureFrame({ frameNumber }) {
	if (frameNumber === undefined || frameNumber < 1) {
		frameNumber = 1;
	}
	if (frameNumber > 4) {
		frameNumber = 4;
	}

	const cardStyle = `c${frameNumber}`;
	const arr = range(frameNumber);

	return (
		<div className={styles.wrapper}>
			<div className={`${styles.card} ${styles[cardStyle]}`}>
				{arr.map((item) => {
					const style = { gridArea: `item${item + 1}` };
					console.log(style);
					return <UploadSlot key={item} style={style} />;
				})}
			</div>
		</div>
	);
}

export default PictureFrame;
