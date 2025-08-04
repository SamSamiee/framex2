import React from "react";
import { Trash, Twitter } from "react-feather";
import styles from "./styles.module.css";
import FourSquare from "../FourSquare";
import { FileContext } from "../../Contexts/FileProvider";

function Cart({ urls, imageIds, children, id }) {
	const { handleDeleteCard } = React.useContext(FileContext);
	const size = "2em";
	return (
		<div className={styles.cart}>
			<p className={styles.p}>{children}</p>
			<FourSquare urls={urls} />
			<div className={styles.controller}>
				<button type="button" className={`${styles.Button} ${styles.twitter}`}>
					<Twitter size={size} color="white" />
				</button>
				<div className={styles.adjust}>
					<button
						className={styles.delete}
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							console.log("Button clicked:", e.target);
							console.log(
								"Button is in view?",
								e.target.getBoundingClientRect()
							);
							handleDeleteCard(id, imageIds);
						}}>
						<Trash size={size} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default Cart;
