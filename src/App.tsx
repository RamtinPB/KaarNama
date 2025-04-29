import { useState } from "react";
import "./App.css";
import CalendarBelt from "./components/CalendarBelt";
import dayjs from "./utils/dayjs-jalali";
import IntelCards from "./components/IntelCards";

function App() {
	const [selectedDays, setSelectedDays] = useState<dayjs.Dayjs[]>([]);

	console.log(selectedDays.map((d) => d.format("YYYY-MM-DD")));
	//console.log(selectedDays);

	return (
		<>
			<div className="flex flex-col gap-7 pb-16" style={{ direction: "rtl" }}>
				<div
					id="calendar_belt"
					className="flex flex-col items-center justify-center"
				>
					<CalendarBelt onSelectDays={setSelectedDays} />
				</div>
				<div id="cards" className=" flex flex-col items center justify-center ">
					<IntelCards selectedDays={selectedDays} />
				</div>
			</div>
		</>
	);
}

export default App;
