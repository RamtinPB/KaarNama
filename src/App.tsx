import "./App.css";
import CalendarBelt from "./components/CalendarBelt";

function App() {
	return (
		<>
			<div className="flex flex-col">
				<div
					id="calendar_belt"
					className="min-h-screen flex flex-col items-center justify-center "
				>
					<CalendarBelt />
				</div>
				<div id="from-to-input"></div>
				<div id="cards"></div>
			</div>
		</>
	);
}

export default App;
