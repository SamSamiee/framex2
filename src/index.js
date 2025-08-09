import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./components/App";
import TwitterCallback from "./components/TwitterCallback";
import "./reset.css";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./Contexts/AuthContext";
import { TimerProvider } from "./Contexts/TimerProvider";
import { FileProvider } from "../src/Contexts/FileProvider";
import { InsertProvider } from "../src/Contexts/InsertProvider";
import { TwitterProvider } from "../src/Contexts/TwitterProvider";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<Router>
			<AuthProvider>
				<TimerProvider>
					<InsertProvider>
						<FileProvider>
							<TwitterProvider>
								<Routes>
									<Route
										path="/twitter-callback"
										element={<TwitterCallback />}
									/>
									<Route path="/*" element={<App />} />
								</Routes>
							</TwitterProvider>
						</FileProvider>
					</InsertProvider>
				</TimerProvider>
			</AuthProvider>
		</Router>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
