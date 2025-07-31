import React from "react";
import styles from "./style.module.css";

function UploadSlot({ style, url = undefined }) {
	const inputRef = React.useRef();
	const [image, setImage] = React.useState(null);

	function handleUpload(e) {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setImage(reader.result);
			reader.readAsDataURL(file);
		}
	}

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
