import React from "react";
import styles from "./styles.module.css";
import UploadSlot from "../UploadSlot/UploadSlot";
import { range } from "../../utils";

function PictureFrame({ filesArr, setFilesArr, frameNumber, urls, setUrls }) {
	if (frameNumber === undefined || frameNumber < 1) {
		frameNumber = 1;
	}
	if (frameNumber > 4) {
		frameNumber = 4;
	}

	const cardStyle = `c${frameNumber}`;

	return (
		<div className={`${styles.card} ${styles[cardStyle]}`}>
			{range(frameNumber).map((number) => {
				const style = { gridArea: `item${number + 1}` };
				return (
					<UploadSlot
						file={filesArr? filesArr[number] : undefined}
						filesArr={filesArr}
						setFilesArr={setFilesArr}
						url={urls? urls[number] : undefined}
						key={number}
						style={style}
						id={number}
					/>
				);
			})}
		</div>
	);
}

export default PictureFrame;
