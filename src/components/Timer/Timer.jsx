import React from "react";
import { Popover } from "radix-ui";
import { Clock } from "react-feather";

function reducer(state, action) {
	switch (action.type) {
		case "add-time": {
			return { ...state, time: action.time };
		}
		case "add-date": {
			return { ...state, date: action.date };
		}
		case "reset": {
			return { time: undefined, date: undefined };
		}
		default:
			return state;
	}
}

function Timer({ size, frameNumber, setFrameNumber }) {
	const [state, dispatch] = React.useReducer(reducer, {
		time: undefined,
		date: undefined,
	});
	const [formData, setFormData] = React.useState({ time: "", date: "" });
	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<Clock
					color={state.time && state.date ? "blue" : undefined}
					size={size}
				/>
			</Popover.Trigger>
			{/* <Popover.Portal> */}
			<Popover.Content>
				<form
					id="schedule"
					onSubmit={(e) => {
						e.preventDefault();
						dispatch({ type: "add-time", time: formData.time });
						dispatch({ type: "add-date", date: formData.date });
					}}>
					<label htmlFor="time" name="time">
						Time:
						<input
							type="time"
							id="time"
							required
							value={state.time}
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
							value={state.date}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, date: e.target.value }))
							}
						/>
					</label>
					<button type="submit">Set</button>
					<button type="reset" onClick={() => dispatch({ type: "reset" })}>
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
