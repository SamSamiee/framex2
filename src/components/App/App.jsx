import React from "react";
import styles from "./styles.module.css";
import Cart from "../Cart";
import LoginPage from "../LoginPage";
import InsertCard from '../InsertCard'
import Header from "../Header";
import { AuthContext } from "../../Contexts/AuthContext";
import { db } from "../../config/firebase-config";
import { getDocs, collection } from "firebase/firestore";
import Modal from "../Modal";

function App() {
	const currentUser = React.useContext(AuthContext);
	const [cards, setCards] = React.useState([]);
	const cardsCollectionRef = collection(db, "cards");

	React.useEffect(() => {
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
	}, []);

	function updateCardSchedule(id, newSchedule) {
		setCards((prevCards) =>
			prevCards.map((card) =>
				card.id === id ? { ...card, scheduleDetail: newSchedule } : card
			)
		);
	}

	return (
		<Modal>
		<InsertCard />
		</Modal>
	);

	if (!currentUser) {
		return <LoginPage />;
	} else {
		return (
			<>
				<div className={styles.wrapper}>
					<Header />
					<button>+</button>
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
				</div>
			</>
		);
	}
}

export default App;
