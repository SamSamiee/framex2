import React from "react";
import styles from "./styles.module.css";
import { storage, db } from "../../config/firebase-config";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { AuthContext } from "../../Contexts/AuthContext";

function Lightbox({ imageList, setImageList, imageDB, setImageDB }) {
	const currentUser = React.useContext(AuthContext);
	const inputRef = React.useRef(null);
	const allimagesRef = collection(db, "allimages");
	// upload images on the storage
	async function addFiles(file) {
		const folderRef = ref(
			storage,
			`images/${currentUser.uid}/${currentUser.displayName}/${file.name}`
		);
		try {
			await uploadBytes(folderRef, file);
			const url = await getDownloadURL(folderRef);
			await addDoc(allimagesRef, {
				url: url,
				lightbox: true,
				userId: currentUser.uid,
			});
			setImageDB((prev) => [
				...prev,
				{ url: url, lightbox: true, userId: currentUser.uid },
			]);
			return url;
		} catch (err) {
			console.error(err);
		}
	}

	function getStoragePathFromUrl(url) {
		const pathStart = url.indexOf("/o/") + 3;
		const pathEnd = url.indexOf("?");

		// Decode encoded path (e.g., %2F → /)
		const fullPath = decodeURIComponent(url.substring(pathStart, pathEnd));
		return fullPath;
	}
	async function deleteImage(url, id) {
		try {
			const filePath = getStoragePathFromUrl(url);
			const fileRef = ref(storage, filePath);
			await deleteObject(fileRef);
			const imageDoc = doc(db, "allimages", id);
			await deleteDoc(imageDoc);
		} catch (error) {
			console.error("Error deleting file:", error);
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.plate}>
				<input
					style={{ display: "none" }}
					ref={inputRef}
					type="file"
					accept="image/*"
					multiple
					onChange={async (e) => {
						const files = Array.from(e.target.files);
						if (!files.length) return;
						const urls = await Promise.all(files.map(addFiles));
						setImageList((prev) => [...prev, ...urls.filter(Boolean)]);
						e.target.value = null; // Reset input so same file can be uploaded again
					}}
				/>
				<button onClick={() => inputRef?.current?.click()}>add</button>
				{imageDB?.map(({ url, id, lightbox }) => {
					return (
						lightbox && (
							<div className={styles.slot}>
								{/* eslint-disable-next-line */}
								<img src={url} />
								<button
									className={styles.delete}
									onClick={async () => {
										await deleteImage(url, id);
										setImageDB((prev) =>
											prev.filter((item) => item.url !== url)
										);
									}}>
									-
								</button>
							</div>
						)
					);
				})}
			</div>
		</div>
	);
}

export default Lightbox;
