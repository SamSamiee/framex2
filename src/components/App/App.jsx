import styles from "./styles.module.css";
import Cart from "../Cart";

function App() {
	return (
		<>
			<div className={styles.wrapper}>
				<Cart>this is a description</Cart>
			</div>
		</>
	);
}

export default App;
