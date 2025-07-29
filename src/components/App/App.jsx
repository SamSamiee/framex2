import React from "react";
import styles from "./styles.module.css";
import Cart from "../Cart";
import LoginPage from "../LoginPage";
import InsertCard from "../InsertCard";
import Header from "../Header";
import { AuthContext } from "../../Contexts/AuthContext";
import { db } from "../../config/firebase-config";
import { getDocs, collection } from "firebase/firestore";
import Modal from "../Modal";
import Lightbox from "../Lightbox";
import { storage } from "../../config/firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";

function App() {
	const currentUser = React.useContext(AuthContext);
	const [cards, setCards] = React.useState([]);
	const cardsCollectionRef = collection(db, "cards");
	const allimagesRef = collection(db, "allimages");
	const [imageDB, setImageDB] = React.useState([]);
	const [imageList, setImageList] = React.useState([]);

	// ----------------

	function fetchImages() {
		setImageList([]);
		const folderRef = ref(
			storage,
			`images/${currentUser.uid}/${currentUser.displayName}/`
		);
		listAll(folderRef).then((response) => {
			response.items.forEach((i) => {
				getDownloadURL(i).then((url) => {
					setImageList((prev) => [...prev, url]);
				});
			});
		});
	}

	React.useEffect(() => {
		if (currentUser) fetchImages();
	}, [currentUser]); /*eslint-disable-line */

	// ----------------

	React.useEffect(() => {
		console.log(currentUser);
		async function getCards() {
			try {
				const data = await getDocs(cardsCollectionRef);
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
				const data = (await getDocs(allimagesRef)).docs.map((doc) => ({
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
					<Modal>
						<InsertCard />
					</Modal>
					<div className={styles.Body}>
						{cards.map(({ description, scheduleDetail, images, id }) => {
							return (
								<Cart
									id={id}
									slots={images.length}
									onScheduleChange={updateCardSchedule}
									scheduleDetail={scheduleDetail}>
									{description}
								</Cart>
							);
						})}
						<Lightbox
							imageList={imageList}
							setImageList={setImageList}
							imageDB={imageDB}
							setImageDB={setImageDB}
						/>
					</div>
				</div>
			</>
		);
	}
}

export default App;
