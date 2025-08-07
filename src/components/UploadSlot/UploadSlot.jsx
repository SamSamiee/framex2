import React from "react";
import styles from "./style.module.css";
import { InsertContext } from "../../Contexts/InsertProvider";

function UploadSlot({ file, style, url = undefined, id, slotType }) {
	const inputRef = React.useRef();
	const [image, setImage] = React.useState(null);
	const { filesArr, setFilesArr, updateSlotType } =
		React.useContext(InsertContext);

	function fileToUrl(file) {
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setImage(reader.result);
			reader.readAsDataURL(file);
		}
	}

	function handleUpload(e) {
		const file = e.target.files[0];
		if (file && filesArr && Array.isArray(filesArr)) {
			fileToUrl(file);
			const newArr = [...filesArr];
			newArr.splice(id, 1, file);
			setFilesArr(newArr);
			// Mark this slot as containing a local file
			updateSlotType(id, "file");
		}
	}

	React.useEffect(() => {
		if (file) {
			fileToUrl(file);
			// Only update slot type if it's not already set to 'file'
			if (slotType !== "file") {
				updateSlotType(id, "file");
			}
		}
	}, [file, id, slotType, updateSlotType]);

	// If we have a URL but no file, this is an existing image
	React.useEffect(() => {
		if (url && !file && slotType !== "existing") {
			updateSlotType(id, "existing");
		}
	}, [url, file, id, slotType, updateSlotType]);

	// If slotType is provided as prop, use it to set the image
	React.useEffect(() => {
		if (slotType === "existing" && url) {
			setImage(url);
		}
	}, [slotType, url]);

	return (
		<>
			<input
				className={styles.hiddenInput}
				ref={inputRef}
				type="file"
				accept="image/*"
				onChange={handleUpload}
			/>
			<button
				style={{
					...style,
					backgroundImage: image ? `url(${image})` : `url(${url})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
				className={styles.uploadButton}
				onClick={() => inputRef.current.click()}></button>
		</>
	);
}

export default UploadSlot;
