import React from "react";
import styles from "./styles.module.css";

function Thumbnail({
	url,
	deleteFunction,
	selectedThumbnails,
	setSelectedThumbnails,
}) {
	const selected = selectedThumbnails.includes(url);
	const toggleSelect = (e) => {
		return !e;
	};
	const [loaded, setloaded] = React.useState(false);
	const opacity =
		!selectedThumbnails.includes(url) && selectedThumbnails.length >= 4
			? "40%"
			: "100%";
	if (Boolean(!url)) return <div className={styles.skeleton}></div>;

	return (
		<div style={{ opacity }}>
			{!loaded && <div className={styles.skeleton}></div>}
			<div
				className={`${styles.slot} ${selected ? styles.selected : undefined}`}
				key={url}
				onClick={() => {
					if (selectedThumbnails.length === 4 && !selected) {
						return;
					}
					toggleSelect((p) => !p);
					setSelectedThumbnails((p) => {
						if (!selected) {
							return [...p, url].slice(-4);
						} else {
							return p.filter((item) => item !== url);
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
