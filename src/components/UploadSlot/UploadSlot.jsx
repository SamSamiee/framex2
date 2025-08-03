import React from "react";
import styles from "./style.module.css";

function UploadSlot({
	file,
	filesArr,
	setFilesArr,
	style,
	url = undefined,
	id,
}) {
	const inputRef = React.useRef();
	const [image, setImage] = React.useState(null);

	function fileToUrl(file) {
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => setImage(reader.result);
			reader.readAsDataURL(file);
		}
	}


	function handleUpload(e) {
		const file = e.target.files[0];
		if (file) {
			fileToUrl(file)
			const newArr = [...filesArr];
			newArr.splice(id, 1, file);
			setFilesArr(newArr);
			console.log(newArr);
		}
	}

	React.useEffect(() => {
	fileToUrl(file)
	}, [file]);

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
