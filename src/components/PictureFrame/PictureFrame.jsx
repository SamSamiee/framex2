import React from "react";
import styles from "./styles.module.css";
import UploadSlot from "../UploadSlot/UploadSlot";
import { range } from "../../utils";
import { InsertContext } from "../../Contexts/InsertProvider";

function PictureFrame() {
	const {
		filesArr,
		setFilesArr,
		frameNumber,
		setFrameNumber,
		urlsAndIds,
		slotTypes,
	} = React.useContext(InsertContext);

	if (frameNumber === undefined || frameNumber < 1) {
		setFrameNumber(1);
	}
	if (frameNumber > 4) {
		setFrameNumber(1);
	}

	// Ensure we have valid arrays
	const safeFilesArr = Array.isArray(filesArr)
		? filesArr
		: Array(4).fill(undefined);
	const safeUrlsAndIds = Array.isArray(urlsAndIds) ? urlsAndIds : [];
	const safeSlotTypes = Array.isArray(slotTypes)
		? slotTypes
		: Array(4).fill(undefined);

	const cardStyle = `c${frameNumber}`;

	return (
		<div className={`${styles.card} ${styles[cardStyle]}`}>
			{range(frameNumber).map((number) => {
				const style = { gridArea: `item${number + 1}` };
				return (
					<UploadSlot
						file={safeFilesArr ? safeFilesArr[number] : undefined}
						url={safeUrlsAndIds ? safeUrlsAndIds[number]?.url : undefined}
						key={number}
						style={style}
						id={number}
						slotType={safeSlotTypes ? safeSlotTypes[number] : undefined}
					/>
				);
			})}
		</div>
	);
}

export default PictureFrame;
