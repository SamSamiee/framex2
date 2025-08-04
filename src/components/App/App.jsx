import React from "react";
import styles from "./styles.module.css";
import Cart from "../Cart";
import LoginPage from "../LoginPage";
import InsertCard from "../InsertCard";
import Header from "../Header";
import { AuthContext } from "../../Contexts/AuthContext";
import { db } from "../../config/firebase-config";
import { getDocs, collection, query, where } from "firebase/firestore";
import Modal from "../Modal";
import Lightbox from "../Lightbox";
import { FileContext } from "../../Contexts/FileProvider";

function App() {
	const currentUser = React.useContext(AuthContext);
	const { setImageDB, handleDeleteCard } = React.useContext(FileContext);
	const cardsCollectionRef = collection(db, "cards");
	const allimagesRef = collection(db, "allimages");
	const [cards, setCards] = React.useState([]);
	const [modalOpen, setModalOpen] = React.useState(false);

	React.useEffect(() => {
		async function getCards() {
			try {
				const q = query(
					cardsCollectionRef,
					where("userId", "==", currentUser?.uid)
				);
				const data = await getDocs(q);
				const filteredData = data.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				setCards(filteredData);
			} catch (err) {
				console.error(err);
			}
		}
		getCards();
	}, []); /*eslint-disable-line*/

	React.useEffect(() => {
		async function getImages() {
			try {
				const q = query(allimagesRef, where("userId", "==", currentUser?.uid));
				const data = (await getDocs(q)).docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				setImageDB(data);
			} catch (err) {
				console.error(err);
			}
		}
		getImages();
	}, []); /*eslint-disable-line*/

	function updateCardSchedule(id, newSchedule) {
		setCards((prevCards) =>
			prevCards.map((card) =>
				card.id === id ? { ...card, scheduleDetail: newSchedule } : card
			)
		);
	}

	if (!currentUser) {
		return <LoginPage />;
	} else {
		return (
			<>
				<div className={styles.wrapper}>
					<Header />
					<Modal modalOpen={modalOpen} setModalOpen={setModalOpen}>
						<InsertCard modalOpen={modalOpen} setModalOpen={setModalOpen} />
					</Modal>
					<div className={styles.Body}>
						{cards.map(({ description, scheduleDetail, id, imagesData }) => {
							//imagesData=[{url,  id},  {url, id}]
							const urls = imagesData?.map(({ url }) => url);
							const imageIds = imagesData?.map(({ id }) => id);
							return (
								<Cart
									onDelete={() => handleDeleteCard(id)}
									key={id}
									urls={urls}
									imageIds={imageIds}
									id={id}
									slots={urls?.length}
									onScheduleChange={updateCardSchedule}
									scheduleDetail={scheduleDetail}>
									{description}
								</Cart>
							);
						})}
						<Lightbox />
					</div>
				</div>
			</>
		);
	}
}

export default App;
