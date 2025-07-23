import styles from "./styles.module.css";
import Cart from "../Cart";

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
	console.log("App rendered...");

	return (
		<>
			<div className={styles.wrapper}>
				{carts.map(({ description, schedule, scheduleDetails, images }) => {
					return <Cart slots={images.length}>{description}</Cart>;
				})}
			</div>
		</>
	);
}

export default App;
