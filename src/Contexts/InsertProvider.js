import React from "react";
export const InsertContext = React.createContext();

export function InsertProvider({ children }) {
	const [filesArr, setFilesArr] = React.useState(Array(4).fill(undefined));
	const [urlsAndIds, setUrlsAndIds] = React.useState([]);
	const [frameNumber, setFrameNumber] = React.useState(1);
	const [selectedThumbnails, setSelectedThumbnails] = React.useState([]);
	// New state to track slot types: 'file', 'existing', or undefined
	const [slotTypes, setSlotTypes] = React.useState(Array(4).fill(undefined));
	const [modalOpen, setModalOpen] = React.useState(false);

	// Editing state
	const [isEditing, setIsEditing] = React.useState(false);
	const [editingCardId, setEditingCardId] = React.useState(null);
	const [editingDescription, setEditingDescription] = React.useState("");

	// Ensure filesArr is always properly sized
	React.useEffect(() => {
		if (filesArr.length !== 4) {
			const newFilesArr = Array(4).fill(undefined);
			// Preserve existing files if possible
			filesArr.forEach((file, index) => {
				if (index < 4) {
					newFilesArr[index] = file;
				}
			});
			setFilesArr(newFilesArr);
		}
	}, [filesArr.length]);

	async function handleUploadCartWithLink() {
		const newFrameNumber = selectedThumbnails?.length || 1;
		setFrameNumber(newFrameNumber);

		const newUrlsAndIds = selectedThumbnails.map((obj) => ({
			id: obj.id,
			url: obj.url,
		}));
		setUrlsAndIds(newUrlsAndIds);

		// Update slot types to mark these as existing images
		// But preserve any existing file uploads
		const newSlotTypes = [...slotTypes]; // Copy existing slot types
		selectedThumbnails.forEach((_, index) => {
			// Only mark as existing if it's not already a file
			if (newSlotTypes[index] !== "file") {
				newSlotTypes[index] = "existing";
			}
		});
		setSlotTypes(newSlotTypes);
	}

	// Function to set insert data for editing a card
	function setInsertDataForEdit({
		description,
		imagesData,
		scheduleDetail,
		cardId,
		isEditing: editing,
	}) {
		setIsEditing(editing);
		setEditingCardId(cardId);
		setEditingDescription(description);

		// Set up the images data
		if (imagesData && imagesData.length > 0) {
			setFrameNumber(imagesData.length);
			setUrlsAndIds(imagesData);

			// Mark all slots as existing images
			const newSlotTypes = Array(4).fill(undefined);
			imagesData.forEach((_, index) => {
				newSlotTypes[index] = "existing";
			});
			setSlotTypes(newSlotTypes);
		}

		// Open the modal
		setModalOpen(true);
	}

	// Function to update slot type when a file is uploaded
	function updateSlotType(index, type) {
		setSlotTypes((prev) => {
			const newTypes = [...prev];
			newTypes[index] = type;
			return newTypes;
		});
	}

	// Function to clear all data when modal is closed
	function clearInsertData() {
		setFilesArr(Array(4).fill(undefined));
		setUrlsAndIds([]);
		setFrameNumber(1);
		setSelectedThumbnails([]);
		setSlotTypes(Array(4).fill(undefined));
		setModalOpen(false);
		setIsEditing(false);
		setEditingCardId(null);
		setEditingDescription("");
	}

	return (
		<InsertContext.Provider
			value={{
				frameNumber,
				setFrameNumber,
				urlsAndIds,
				setUrlsAndIds,
				handleUploadCartWithLink,
				filesArr,
				setFilesArr,
				selectedThumbnails,
				setSelectedThumbnails,
				slotTypes,
				setSlotTypes,
				updateSlotType,
				clearInsertData,
				modalOpen,
				setModalOpen,
				isEditing,
				editingCardId,
				editingDescription,
				setEditingDescription,
				setInsertDataForEdit,
			}}>
			{children}
		</InsertContext.Provider>
	);
}
