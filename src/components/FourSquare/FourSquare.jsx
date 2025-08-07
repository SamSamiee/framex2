import React from "react";
import styles from "./styles.module.css";

function FourSquare({ urls }) {
	const [loaded, setLoaded] = React.useState([]);
	const cardStyle = `c${urls ? urls?.length : 1}`;

	// Helper function to get URL and check if image is optimistic
	const getImageData = (item, index) => {
		if (typeof item === "string") {
			return { url: item, isOptimistic: false };
		} else if (item && typeof item === "object") {
			return {
				url: item.url,
				isOptimistic: item.isOptimistic || false,
			};
		}
		return { url: null, isOptimistic: false };
	};

	return (
		<div className={`${styles.card} ${styles[cardStyle]}`}>
			{urls?.map((item, index) => {
				const { url, isOptimistic } = getImageData(item, index);
				const isLoaded = loaded.includes(index);
				const shouldShowShimmer = !isLoaded || isOptimistic;

				return (
					<div
						className={styles.imageWrapper}
						key={url + index}
						style={{
							gridArea: `item${index + 1}`,
						}}>
						{shouldShowShimmer && (
							<div className={styles.shimmer}>
								<div className={styles.moving}></div>
							</div>
						)}
						{url && (
							<img
								onLoad={() => {
									if (!isOptimistic) {
										setLoaded((p) => [...p, index]);
									}
								}}
								className={styles.image}
								alt="thumbnail"
								src={url}
							/>
						)}
					</div>
				);
			})}
		</div>
	);
}

export default FourSquare;
