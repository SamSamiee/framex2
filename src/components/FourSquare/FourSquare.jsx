import React from "react";
import styles from "./styles.module.css";
function FourSquare({ urls }) {
	const cardStyle = `c${urls ? urls?.length : 1}`;
	return (
		<div className={`${styles.card} ${styles[cardStyle]}`}>
			{urls?.map((url, index) => {
				return (
					<div
						className={styles.wra}
						style={{
							gridArea: `item${index + 1}`,
							backgroundColor: "#f0f0f0",
							backgroundImage: `url(${url})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
						}}
						key={url}
						alt="thumbnail"
						src={url}
					/>
				);
			})}
		</div>
	);
}

export default FourSquare;
