import React from "react";
import { Trash, Twitter } from "react-feather";
import styles from "./styles.module.css";
import PictureFrame from "../PictureFrame";
import DynamicGrid from "../DynamicGrid";
import { useMediaQuery } from "react-responsive";
import { FileContext } from "../../Contexts/FileProvider";
import { AuthContext } from "../../Contexts/AuthContext";
import { InsertContext } from "../../Contexts/InsertProvider";

function InsertCard({ scheduleDetail }) {
	//contexts
	const currentUser = React.useContext(AuthContext);
	const {
		setCards,
		addFile,
		addCard,
		updateCard,
		getCards,
		updateExistingImages,
	} = React.useContext(FileContext);
	const {
		urlsAndIds,
		frameNumber,
		setFrameNumber,
		filesArr,
		slotTypes,
		clearInsertData,
		setModalOpen,
		isEditing,
		editingCardId,
		editingDescription,
		setEditingDescription,
	} = React.useContext(InsertContext);
	//states
	const [text, setText] = React.useState(editingDescription || "");
	const [isLoading, setIsLoading] = React.useState(false);
	//local consts
	const isMobile = useMediaQuery({ maxWidth: 1000 });
	const size = "2em";

	// Update text when editing description changes
	React.useEffect(() => {
		setText(editingDescription || "");
	}, [editingDescription]);

	async function handleUploadCart() {
		// Validation
		if (text.trim() === "" && frameNumber === 0) {
			alert("Please either add a description or upload some photos");
			return;
		}

		setIsLoading(true);

		// For editing, immediately update the card in the UI with text changes and image structure
		if (isEditing && editingCardId) {
			// Create optimistic image data structure
			const optimisticImagesData = [];
			const safeFilesArr = Array.isArray(filesArr)
				? filesArr
				: Array(4).fill(undefined);

			for (let i = 0; i < frameNumber; i++) {
				const slotType = slotTypes[i];

				if (slotType === "file") {
					// For new files, create a placeholder with shimmer effect
					const file = safeFilesArr[i];
					if (file) {
						// Create a temporary URL for immediate display
						const tempUrl = URL.createObjectURL(file);
						optimisticImagesData.push({
							id: `temp-${Date.now()}-${i}`,
							url: tempUrl,
							isOptimistic: true, // Flag to show shimmer
						});
					}
				} else if (slotType === "existing") {
					// Keep existing images as they are
					const existingImage = urlsAndIds[i];
					if (existingImage) {
						optimisticImagesData.push(existingImage);
					}
				}
			}

			// Optimistically update the card immediately
			setCards((prev) =>
				prev.map((card) =>
					card.id === editingCardId
						? {
								...card,
								description: text,
								imagesData: optimisticImagesData,
						  }
						: card
				)
			);
		}

		const tempId = crypto.randomUUID();
		const tempCard = {
			description: text,
			imagesData: Array(frameNumber).fill({
				id: "123",
				url: "https://via.placeholder.com/150",
			}),
			userId: currentUser?.uid,
			dateCreated: new Date(),
			id: tempId,
		};

		// Optimistic update - only for new cards, not editing
		if (!isEditing) {
			setCards((prev) => [...prev, tempCard]);
		}

		// Close modal immediately for better UX
		setModalOpen(false);

		try {
			const imagesData = [];
			const existingImageIds = [];
			const newImageIds = [];

			// Ensure filesArr is a valid array
			const safeFilesArr = Array.isArray(filesArr)
				? filesArr
				: Array(4).fill(undefined);

			// Process each slot based on its type
			for (let i = 0; i < frameNumber; i++) {
				const slotType = slotTypes[i];

				if (slotType === "file") {
					// Upload local file
					const file = safeFilesArr[i];
					if (file) {
						const result = await addFile(file, false);
						if (result) {
							imagesData.push(result);
							newImageIds.push(result.id);
						}
					}
				} else if (slotType === "existing") {
					// Use existing image
					const existingImage = urlsAndIds[i];
					if (existingImage) {
						imagesData.push(existingImage);
						existingImageIds.push(existingImage.id);
					}
				}
			}

			const cardData = {
				description: text,
				imagesData,
				scheduleDetail: scheduleDetail || "",
				userId: currentUser?.uid,
				dateCreated: new Date(),
			};

			if (isEditing && editingCardId) {
				// Update existing card
				await updateCard(editingCardId, cardData);

				// Update the card in the UI with the final data (including uploaded images)
				setCards((prev) =>
					prev.map((card) =>
						card.id === editingCardId ? { ...card, ...cardData } : card
					)
				);
			} else {
				// Create new card
				await addCard(cardData);
			}

			// Update existing images to remove them from lightbox
			if (existingImageIds.length > 0) {
				await updateExistingImages(existingImageIds);
			}

			// Refresh data and clean up
			await getCards();
			if (!isEditing) {
				setCards((prev) => prev.filter((item) => item.id !== tempId));
			}
			setText("");
			clearInsertData();
		} catch (err) {
			console.error("Failed to add/update card:", err);
			// Remove the optimistic card on error (only for new cards)
			if (!isEditing) {
				setCards((prev) => prev.filter((item) => item.id !== tempId));
			}
			// Reopen modal on error for editing
			if (isEditing) {
				setModalOpen(true);
			}
		} finally {
			setIsLoading(false);
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
			<PictureFrame />
			<div className={styles.controller}>
				<div className={styles.adjust}>
					<Trash size={size} />
					{/* <Timer
						size={size}
						onScheduleChange={onScheduleChange}
						scheduleDetail={scheduleDetail}
					/> */}
					<DynamicGrid
						size={size}
						frameNumber={frameNumber}
						setFrameNumber={setFrameNumber}
					/>
				</div>
			</div>
			<div className={styles.Buttons}>
				<button
					className={`${styles.Button} ${styles.twitter}`}
					onClick={handleUploadCart}
					disabled={isLoading}>
					<p style={{ color: "white" }}>
						{isLoading ? "Updating..." : isEditing ? "Update" : "Post"}
					</p>
				</button>
				<button
					className={`${styles.Button} ${styles.twitter}`}
					disabled={isLoading}>
					<Twitter size={size} color="white" />
				</button>
			</div>
		</div>
	) : (
		<div className={styles.cart}>
			<PictureFrame />
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
						{/* <Timer
							size={size}
							onScheduleChange={onScheduleChange}
							scheduleDetail={scheduleDetail}
						/> */}
						<DynamicGrid
							size={size}
							frameNumber={frameNumber}
							setFrameNumber={setFrameNumber}
						/>
					</div>
					<div className={styles.Buttons}>
						<button
							className={`${styles.Button} ${styles.twitter}`}
							onClick={handleUploadCart}
							disabled={isLoading}>
							<p style={{ color: "white" }}>
								{isLoading ? "Updating..." : isEditing ? "Update" : "Post"}
							</p>
						</button>
						<button
							className={`${styles.Button} ${styles.twitter}`}
							disabled={isLoading}>
							<Twitter size={size} color="white" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default InsertCard;
