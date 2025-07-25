import React from "react";
import { Popover } from "radix-ui";
import { Clock } from "react-feather";

function Timer({ size, scheduleDetail, onScheduleChange, id }) {
	const [formData, setFormData] = React.useState(
		scheduleDetail || { time: "", date: "" }
	);

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<Clock
					color={
						scheduleDetail.time && scheduleDetail.date ? "blue" : undefined
					}
					size={size}
				/>
			</Popover.Trigger>
			{/* <Popover.Portal> */}
			<Popover.Content>
				<form
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
					<button type="submit">Set</button>
					<button
						type="reset"
						onClick={() => {
							onScheduleChange(id, { time: "", date: "" });
							setFormData({ date: "", time: "" });
						}}>
						Reset
					</button>
				</form>
				<Popover.Close />
				{/* <Popover.Arrow /> */}
			</Popover.Content>
			{/* </Popover.Portal> */}
		</Popover.Root>
	);
}

export default Timer;
