import React from "react";
import { Grid, Columns, Layout, Square } from "react-feather";
import styles from "./styles.module.css";

function DynamicGrid({ size, frameNumber, setFrameNumber }) {
	const [open, toggleOpen] = React.useState(false);
	const [icon, setIcon] = React.useState("Grid");

	const icons = {
		Grid: <Grid size={size} />,
		Layout: <Layout size={size} />,
		Columns: <Columns size={size} />,
		Square: <Square size={size} />,
	};

	switch (icon) {
		case "Grid":
			setFrameNumber(4);
			break;
		case "Layout":
			setFrameNumber(3);
			break;
		case "Columns":
			setFrameNumber(2);
			break;
		case "Square":
			setFrameNumber(1);
			break;
		default:
			setFrameNumber(frameNumber);
	}

	return (
		<div class={`${styles.wrapper} ${open ? styles.open : undefined}`}>
			<div
				onClick={() => {
					toggleOpen((prev) => !prev);
				}}>
				{icons[icon]}
			</div>
			{open &&
				Object.entries(icons).map(([elName, element]) => {
					return icon !== elName ? (
						<div
							onClick={() => {
								setIcon(elName);
								toggleOpen((p) => !p);
							}}>
							{element}
						</div>
					) : null;
				})}
		</div>
	);
}

export default DynamicGrid;
