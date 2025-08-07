import React from "react";
import Thumbnail from "../Thumbnail/Thumbnail";
import styles from "./styles.module.css";
import { Disc, Plus } from "react-feather";
import { FileContext } from "../../Contexts/FileProvider.js";
import { InsertContext } from "../../Contexts/InsertProvider.js";

function Lightbox() {
	const { setModalOpen, selectedThumbnails, handleUploadCartWithLink } =
		React.useContext(InsertContext);
	const inputRef = React.useRef(null);
	const [isOpen, setIsOpen] = React.useState(true);
	const { setImageDB, addFile, imageDB, deleteImage } =
		React.useContext(FileContext);

	return (
		<div className={`${styles.wrapper} ${isOpen ? styles.open : undefined}`}>
			<div className={styles.handle}>
				<button
					onClick={() => {
						setIsOpen((p) => !p);
					}}>
					<Disc />
				</button>
			</div>
			<div className={styles.plate}>
				<input
					style={{ display: "none" }}
					ref={inputRef}
					type="file"
					accepts="image/*"
					multiple
					onChange={async (e) => {
						const files = Array.from(e.target.files);
						if (!files.length) return;
						files.forEach((file) => {
							addFile(file);
						});
						e.target.value = null; // Reset input so same file can be uploaded again
					}}
				/>
				<div className={styles.Buttons}>
					{Boolean(selectedThumbnails.length) && (
						<button
							onClick={() => {
								setModalOpen(true);
								console.log('the lightbox"s isOpen is now:');
								console.log(isOpen);
								console.log("and now we are reversing it");
								setIsOpen((p) => !p);
								handleUploadCartWithLink(selectedThumbnails);
							}}
							className={styles.black}>
							Post
						</button>
					)}
					<button
						className={styles.black}
						onClick={() => inputRef?.current?.click()}>
						<Plus />
					</button>
				</div>
				{imageDB?.length === 0 ? (
					<div className={styles.PWrapper}>
						<p className={styles.description}>
							<span style={{ opacity: "50%" }}>
								Start adding images by clicking on the{" "}
							</span>
							<span
								style={{
									backgroundColor: "black",
									color: "white",
									padding: "1px 5px",
									borderRadius: "5px",
								}}>
								plus icon
							</span>
						</p>
					</div>
				) : (
					imageDB?.map((obj) => {
						const { url, id, lightbox, show } = obj;
						return (
							lightbox &&
							show && (
								<Thumbnail
									obj={obj}
									key={url}
									url={url}
									deleteFunction={async (e) => {
										e.stopPropagation();
										await deleteImage(url, id);
										setImageDB((prev) =>
											prev.filter((item) => item.url !== url)
										);
									}}
								/>
							)
						);
					})
				)}
			</div>
		</div>
	);
}

export default Lightbox;
