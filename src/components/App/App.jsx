import React from "react";
import styles from "./styles.module.css";
import Cart from "../Cart";
import LoginPage from "../LoginPage";
import Header from "../Header";
import { AuthContext } from "../../Contexts/AuthContext";
const carts = [
	{
		description: "this is the first card",
		schedule: false,
		scheduleDetails: undefined,
		images: [1, 2, 3],
	},
	{
		description: "I am happy",
		schedule: false,
		scheduleDetails: undefined,
		images: [1],
	},
	{
		description: "YooooYYY",
		schedule: false,
		scheduleDetails: undefined,
		images: [1, 2],
	},
];

function App() {
	const currentUser = React.useContext(AuthContext);
	if (!currentUser) {
		return <LoginPage />;
	} else {
		return (
			<>
				<div className={styles.wrapper}>
					<Header />
					{carts.map(({ description, schedule, scheduleDetails, images }) => {
						return <Cart slots={images.length}>{description}</Cart>;
					})}
				</div>
			</>
		);
	}
}

export default App;
