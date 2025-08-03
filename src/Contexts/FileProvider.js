import React from "react";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	updateDoc,
} from "firebase/firestore";
import { storage, db } from "../config/firebase-config";
import { AuthContext } from "./AuthContext";
import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";

export const FileContext = React.createContext();

export function FileProvider({ children }) {
	const currentUser = React.useContext(AuthContext);
	const [imageDB, setImageDB] = React.useState([]);

	async function handleDeleteCard(cardId, imageId) {
		try {
			const cardDoc = doc(db, "cards", cardId);
			await deleteDoc(cardDoc);
			const imageDoc = doc(db, "allImages", imageId);
			await updateDoc(imageDoc, { lightbox: true });
		} catch (err) {
			console.error(err);
		}
	}

	// upload images on the storage
	async function addFiles(file, lightbox = true) {
		if (!file) {
			return;
		}
		const tempId = file.name + Date.now();
		const tempObj = {
			url: null,
			id: tempId,
			lightbox,
			userId: currentUser.id,
			show: true,
		};
		setImageDB((p) => [...p, tempObj]);
		const allimagesRef = collection(db, "allimages");
		const folderRef = ref(
			storage,
			`images/${currentUser.uid}/${currentUser.displayName.replace(
				/ /g,
				"-"
			)}/${file.name}`
		);
		try {
			await uploadBytes(folderRef, file);
			const url = await getDownloadURL(folderRef);
			const newObj = {
				url,
				lightbox,
				userId: currentUser.uid,
				show: true,
			};
			const docRef = await addDoc(allimagesRef, newObj);
			setImageDB((prevArr) => {
				return prevArr.map((item) => {
					return item.id === tempId ? { ...newObj, id: docRef.id } : item;
				});
			});
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
			const imageDoc = doc(db, "allimages", id);
			await deleteDoc(imageDoc);
			const filePath = getStoragePathFromUrl(url);
			const fileRef = ref(storage, filePath);
			await deleteObject(fileRef);
		} catch (error) {
			console.error("Error deleting file:", error);
		}
	}

	async function addCard(newObj) {
		const cardCollectionRef = collection(db, "cards");
		try {
			const cardRef = await addDoc(cardCollectionRef, newObj);
			return cardRef;
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<FileContext.Provider
			value={{
				deleteImage,
				addFiles,
				imageDB,
				setImageDB,
				addCard,
				handleDeleteCard,
			}}>
			{children}
		</FileContext.Provider>
	);
}
