import React from "react";
import { Trash, Twitter } from "react-feather";
import styles from "./styles.module.css";
import PictureFrame from "../PictureFrame";
import DynamicGrid from "../DynamicGrid";
import Timer from "../Timer";
import { useMediaQuery } from "react-responsive";
import { FileContext } from "../../Contexts/FileProvider";
import { AuthContext } from "../../Contexts/AuthContext";

function InsertCard({ frames = 4, onScheduleChange, scheduleDetail }) {
	const [text, setText] = React.useState("");
	const [frameNumber, setFrameNumber] = React.useState(frames);
	const [urls, setUrls] = React.useState(Array(frames).fill(undefined));
	const currentUser = React.useContext(AuthContext);
	const { addFiles, addCard } = React.useContext(FileContext);
	const [filesArr, setFilesArr] = React.useState(Array(4).fill(undefined));
	const isMobile = useMediaQuery({ maxWidth: 1000 });
	const size = "2em";

	async function handleUploadCart() {
		const newFiles = [...filesArr].slice(0, frameNumber);
		if (!(newFiles.filter((i) => i === undefined).length) && text.trim() === "") {
			alert("Please either add a description or upload some photos");
			return;
		}
		const fileURLs = await Promise.all(
			newFiles.map((file) => addFiles(file, false))
		);
		setUrls(fileURLs);
		try {
			await addCard({
				description: text,
				urls: fileURLs,
				scheduleDetail: scheduleDetail || "",
				userId: currentUser?.uid,
				dateCreated: new Date(),
			});
			setText("");
		} catch (err) {
			console.error("Failed to add card:", err);
		}
	}

	return isMobile ? (
		<div className={styles.cart}>
			<textarea
				className={styles.Text}
				placeholder="Description..."
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<PictureFrame
				filesArr={filesArr}
				setFilesArr={setFilesArr}
				frameNumber={frameNumber}
				urls={urls}
				size={size}
			/>
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
						urls={urls}
						setUrls={setUrls}
						frameNumber={frameNumber}
						setFrameNumber={setFrameNumber}
					/>
				</div>
			</div>
			<div className={styles.Buttons}>
				<button
					className={`${styles.Button} ${styles.twitter}`}
					onClick={handleUploadCart}>
					<p style={{ color: "white" }}>add</p>
				</button>
				<button className={`${styles.Button} ${styles.twitter}`}>
					<Twitter size={size} color="white" />
				</button>
			</div>
		</div>
	) : (
		<div className={styles.cart}>
			<PictureFrame
				filesArr={filesArr}
				setFilesArr={setFilesArr}
				frameNumber={frameNumber}
				urls={urls}
				setUrls={setUrls}
				size={size}
			/>
			<div className={styles.side}>
				<textarea
					className={styles.Text}
					placeholder="Description..."
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
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
							urls={urls}
							setUrls={setUrls}
							frameNumber={frameNumber}
							setFrameNumber={setFrameNumber}
						/>
					</div>
					<div className={styles.Buttons}>
						<button
							className={`${styles.Button} ${styles.twitter}`}
							onClick={handleUploadCart}>
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
