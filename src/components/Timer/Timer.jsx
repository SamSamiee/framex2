import React, { useEffect } from "react";
import { Popover } from "radix-ui";
import { Clock } from "react-feather";
import styles from "./styles.module.css";

function Timer({ size, scheduleDetail, onScheduleChange, id }) {
	const [formData, setFormData] = React.useState(
		scheduleDetail || { time: "", date: "" }
	);
	const [timerOpen, setTimerOpen] = React.useState(false);
	const clockRef = React.useRef(null);
	const formRef = React.useRef(null);

	React.useEffect(() => {
		function handleClick(e) {
			if (
				formRef?.current?.contains(e?.target) ||
				clockRef?.current?.contains(e?.target)
			) {
				return;
			}
			setTimerOpen(false);
		}

		window.addEventListener("click", handleClick);

		return () => window.removeEventListener("click", handleClick);
	}, []);

	return (
		<div className={styles.wrapper}>
			<button
				onClick={() => setTimerOpen((c) => !c)}
				style={{ backgroundColor: "transparent", border: "none" }}>
				<Clock
					ref={clockRef}
					color={
						scheduleDetail?.time && scheduleDetail?.date ? "blue" : undefined
					}
					size={size}
				/>
			</button>
			{timerOpen && (
				<form
					ref={formRef}
					className={styles.Form}
					id="schedule"
					onSubmit={(e) => {
						e.preventDefault();
						onScheduleChange(id, formData);
					}}>
					<label htmlFor="time" name="time">
						Time:
						<input
							type="time"
							id="time"
							required
							value={formData.time}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, time: e.target.value }))
							}
						/>
					</label>
					<label htmlFor="date" name="date">
						Date:
						<input
							type="date"
							id="date"
							required
							value={formData.date}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, date: e.target.value }))
							}
						/>
					</label>
					<div className={styles.Buttons}>
						<button type="submit">Set</button>
						<button
							type="reset"
							onClick={() => {
								onScheduleChange(id, { time: "", date: "" });
								setFormData({ date: "", time: "" });
							}}>
							Reset
						</button>
					</div>
				</form>
			)}
		</div>
	);
}

export default Timer;
