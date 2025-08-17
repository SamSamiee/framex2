import React from "react";
import styles from "./styles.module.css";
import Cart from "../Cart";
import LoginPage from "../LoginPage";
import Header from "../Header";
import { AuthContext } from "../../Contexts/AuthContext";
import Lightbox from "../Lightbox";
import { FileContext } from "../../Contexts/FileProvider";
import { InsertContext } from "../../Contexts/InsertProvider";
function App() {
	const currentUser = React.useContext(AuthContext);
	const { getCards, getImages, cards } = React.useContext(FileContext);
	const { modalOpen, setModalOpen } = React.useContext(InsertContext);
	React.useEffect(() => {
		getCards();
		getImages();
	}, []); /*eslint-disable-line*/

	if (!currentUser) {
		return <LoginPage />;
	} else {
		return (
			<div className={styles.Mainwrapper}>
				<div className={styles.wrapper}>
					<Header />

					<div className={styles.Body}>
						{cards.length >= 1 ? (
							cards.map(({ description, scheduleDetail, id, imagesData }) => {
								//imagesData=[{url,  id},  {url, id}] or optimistic images with isOptimistic flag
								const imageIds = imagesData?.map(({ id }) => id);
								return (
									<Cart key={id} urls={imagesData} imageIds={imageIds} id={id}>
										{description}
									</Cart>
								);
							})
						) : (
							<p className={styles.initial}>no cards here yet...</p>
						)}
						<Lightbox modalOpen={modalOpen} setModalOpen={setModalOpen} />
					</div>
				</div>
			</div>
		);
	}
}

export default App;
