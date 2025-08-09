import React from "react";
import Thumbnail from "../Thumbnail/Thumbnail";
import styles from "./styles.module.css";
import { Disc, Plus } from "react-feather";
import { FileContext } from "../../Contexts/FileProvider.js";
import { InsertContext } from "../../Contexts/InsertProvider.js";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

function Lightbox() {
	const { setModalOpen, selectedThumbnails, handleUploadCartWithLink } =
		React.useContext(InsertContext);
	const inputRef = React.useRef(null);
	const [isOpen, setIsOpen] = React.useState(true);
	const { setImageDB, addFile, imageDB, deleteImage } =
		React.useContext(FileContext);
	const isMobile = useMediaQuery({ maxWidth: 1000 });

	const animate = {
		transform: !isMobile
			? isOpen
				? "translateX(calc(18vw - 60px))"
				: "translateX(0)"
			: isOpen
			? "translateY(calc(100% - 60px)) translateX(50%)"
			: "translateY(10%) translateX(50%)",
	};

	return (
		<motion.div
			className={styles.wrapper}
			initial={false}
			transition={{ type: "spring", stiffness: 200, damping: 25 }}
			animate={animate}>
			<motion.div layout="position" className={styles.handle}>
				<button
					onClick={() => {
						setIsOpen((p) => !p);
					}}>
					<Disc />
				</button>
			</motion.div>
			<motion.div className={styles.plate}>
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
							addFile(file, true);
						});
						e.target.value = null; // Reset input so same file can be uploaded again
					}}
				/>
				<div className={styles.Buttons}>
					{Boolean(selectedThumbnails.length) && (
						<button
							onClick={() => {
								setModalOpen(true);
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
			</motion.div>
		</motion.div>
	);
}

export default Lightbox;
