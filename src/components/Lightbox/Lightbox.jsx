import React from "react";
import Thumbnail from "../Thumbnail/Thumbnail";
import styles from "./styles.module.css";
import { Disc, Plus } from "react-feather";
import { FileContext } from "../../Contexts/FileProvider";

function Lightbox() {
	const inputRef = React.useRef(null);
	const [isOpen, setIsOpen] = React.useState(true);
	const [selectedThumbnails, setSelectedThumbnails] = React.useState([]);
	const { setImageDB, addFiles, imageDB, deleteImage } =
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
							addFiles(file);
						});
						e.target.value = null; // Reset input so same file can be uploaded again
					}}
				/>
				<button
					className={styles.add}
					onClick={() => inputRef?.current?.click()}>
					<Plus />
				</button>
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
					imageDB?.map(({ url, id, lightbox, show }) => {
						return (
							lightbox &&
							show && (
								<Thumbnail
									selectedThumbnails={selectedThumbnails}
									setSelectedThumbnails={setSelectedThumbnails}
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
