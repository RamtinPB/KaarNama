import { useEffect, useState } from "react";
import "./App.css";
import CalendarBelt from "./components/CalendarBelt";
import dayjs from "./utils/dayjs-jalali";

function App() {
	const [selectedDays, setSelectedDays] = useState<dayjs.Dayjs[]>([]);

	console.log(selectedDays.map((d) => d.format("YYYY-MM-DD")));

	return (
		<>
			<div className="flex flex-col" style={{ direction: "rtl" }}>
				<div
					id="calendar_belt"
					className=" flex flex-col items-center justify-center bg-gray-100"
				>
					<CalendarBelt onSelectDays={setSelectedDays} />
				</div>
				<div id="from-to-input"></div>
				<div id="cards"></div>
			</div>
		</>
	);
}

export default App;
