import React from "react";
import styles from "./styles.module.css";
import { InsertContext } from "../../Contexts/InsertProvider";

function Thumbnail({ url, deleteFunction, obj }) {
	const { selectedThumbnails, setSelectedThumbnails } =
		React.useContext(InsertContext);
	const selected = selectedThumbnails.includes(obj);
	const [loaded, setloaded] = React.useState(false);
	const opacity = !selected && selectedThumbnails.length >= 4 ? "40%" : "100%";
	if (Boolean(!url)) return <div className={styles.skeleton}></div>;

	return (
		<div className={styles.wrapper} style={{ opacity }}>
			{!loaded && <div className={styles.skeleton}></div>}
			<div
				className={`${styles.slot} ${selected ? styles.selected : undefined}`}
				key={url}
				onClick={() => {
					if (selectedThumbnails.length === 4 && !selected) {
						return;
					}
					setSelectedThumbnails((p) => {
						if (!selected) {
							return [...p, obj].slice(-4);
						} else {
							return p.filter((item) => item.id !== obj.id);
						}
					});
				}}>
				{/* eslint-disable-next-line */}
				<img src={url} onLoad={() => setloaded(true)} />
				<button className={styles.delete} onClick={deleteFunction}>
					-
				</button>
			</div>
		</div>
	);
}

export default React.memo(Thumbnail);
