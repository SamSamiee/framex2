import React from "react";
import { Grid, Columns, Layout, Square } from "react-feather";
import styles from "./styles.module.css";
import { InsertContext } from "../../Contexts/InsertProvider";
function DynamicGrid({ size }) {
	const { frameNumber, setFrameNumber } = React.useContext(InsertContext);
	const [open, toggleOpen] = React.useState(false);
	const icons = {
		4: <Grid size={size} />,
		3: <Layout size={size} />,
		2: <Columns size={size} />,
		1: <Square size={size} />,
	};
	let icon = icons[frameNumber];

	return (
		<div className={`${styles.wrapper} ${open ? styles.open : undefined}`}>
			<div
				onClick={() => {
					toggleOpen((prev) => !prev);
				}}>
				{icon}
			</div>
			{open &&
				Object.entries(icons).map(([number, element]) => {
					return icon !== element ? (
						<div
							key={number}
							onClick={() => {
								toggleOpen((p) => !p);
								setFrameNumber(Number(number));
							}}>
							{element}
						</div>
					) : null;
				})}
		</div>
	);
}

export default DynamicGrid;
