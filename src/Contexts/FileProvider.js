import React from "react";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
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
	const [cards, setCards] = React.useState([]);
	const [imageDB, setImageDB] = React.useState([]);
	const allimagesRef = collection(db, "allimages");
	const cardsCollectionRef = collection(db, "cards");

	async function getCards() {
		try {
			const q = query(
				cardsCollectionRef,
				where("userId", "==", currentUser?.uid)
			);
			const data = await getDocs(q);
			const filteredData = data.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setCards(filteredData);
		} catch (err) {
			console.error(err);
		}
	}

	async function getImages() {
		try {
			const q = query(allimagesRef, where("userId", "==", currentUser?.uid));
			const data = (await getDocs(q)).docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));
			setImageDB(data);
		} catch (err) {
			console.error(err);
		}
	}

	async function handleDeleteCard(cardId, imageIds = []) {
		let deletedCard;

		try {
			// Create newCards by filtering out the one to delete
			setCards((prevCards) => {
				const index = prevCards.findIndex((card) => card.id === cardId);
				if (index !== -1) {
					deletedCard = prevCards[index];
					const newCards = [...prevCards];
					newCards.splice(index, 1);
					return newCards;
				}
				return prevCards;
			});

			getImages();

			const cardDoc = doc(db, "cards", cardId);
			await deleteDoc(cardDoc);

			for (const imageId of imageIds) {
				const imageDoc = doc(db, "allimages", imageId);
				await updateDoc(imageDoc, { lightbox: true });
			}
		} catch (err) {
			if (deletedCard) {
				// Add it back (at the end — or insert at original index if needed)
				setCards((prev) => [...prev, deletedCard]);
			}
			console.error(err);
		}
	}

	// upload images on the storage
	async function addFile(file, lightbox = true) {
		if (!file) {
			return;
		}
		const tempId = crypto.randomUUID();
		const tempObj = {
			url: "",
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
			return { url, id: docRef.id };
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

	async function updateCard(cardId, newObj) {
		const cardDoc = doc(db, "cards", cardId);
		try {
			await updateDoc(cardDoc, newObj);
		} catch (err) {
			console.error(err);
		}
	}

	// Function to update existing images when they're used in cards
	async function updateExistingImages(imageIds) {
		try {
			for (const imageId of imageIds) {
				const imageDoc = doc(db, "allimages", imageId);
				await updateDoc(imageDoc, { lightbox: false });
			}
		} catch (err) {
			console.error("Error updating existing images:", err);
		}
	}

	// Function to handle editing a card - coordinates with InsertProvider
	async function handleEditCard(cardId, setInsertData) {
		try {
			// Find the card to edit
			const cardToEdit = cards.find((card) => card.id === cardId);
			if (!cardToEdit) {
				console.error("Card not found");
				return;
			}

			// Extract card data
			const { description, imagesData, scheduleDetail } = cardToEdit;

			// Call the setInsertData function from InsertProvider to populate the modal
			setInsertData({
				description: description || "",
				imagesData: imagesData || [],
				scheduleDetail: scheduleDetail || "",
				cardId: cardId, // Store the card ID for updating later
				isEditing: true, // Flag to indicate we're editing
			});
		} catch (err) {
			console.error("Error preparing card for edit:", err);
		}
	}

	return (
		<FileContext.Provider
			value={{
				deleteImage,
				addFile,
				imageDB,
				setImageDB,
				addCard,
				updateCard,
				handleDeleteCard,
				handleEditCard,
				cards,
				setCards,
				getCards,
				getImages,
				updateExistingImages,
			}}>
			{children}
		</FileContext.Provider>
	);
}
