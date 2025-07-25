import React from "react";

const TimerContext = React.createContext();

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

export function TimerProvider({ children }) {
	const [state, dispatch] = React.useReducer(reducer, {
		time: undefined,
		date: undefined,
	});
	return (
		<TimerContext.Provider value={{ state, dispatch }}>
			{children}
		</TimerContext.Provider>
	);
}

export function useTimer() {
	return React.useContext(TimerContext);
}
