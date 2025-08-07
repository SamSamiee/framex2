import React from "react";
import { Trash, Twitter, Edit } from "react-feather";
import styles from "./styles.module.css";
import FourSquare from "../FourSquare";
import { FileContext } from "../../Contexts/FileProvider";
import { InsertContext } from "../../Contexts/InsertProvider";

function Cart({ urls, imageIds, children, id }) {
	const { handleDeleteCard, handleEditCard } = React.useContext(FileContext);
	const { setInsertDataForEdit } = React.useContext(InsertContext);
	const size = "2em";

	const handleEdit = () => {
		handleEditCard(id, setInsertDataForEdit);
	};

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
						className={styles.edit}
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleEdit();
						}}>
						<Edit size={size} />
					</button>
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
