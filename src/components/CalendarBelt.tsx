import dayjs from "../utils/dayjs-jalali";
import { useState, useRef, useEffect } from "react";

const DAYS_COUNT = 90;

export default function CalendarBelt() {
	const centerIndex = Math.floor(DAYS_COUNT / 2); // center is today

	const today = dayjs()
		.subtract(1, "day")
		.startOf("day")
		.calendar("jalali")
		.locale("fa");

	const days = Array.from({ length: DAYS_COUNT }).map((_, i) =>
		dayjs()
			.subtract(1, "day")
			.startOf("day")
			.add(i - centerIndex, "day") // offset from today
			.calendar("jalali")
			.locale("fa")
	);

	const todayRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		if (todayRef.current) {
			todayRef.current.scrollIntoView({
				inline: "center",
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, []);

	const [selectedDay, setSelectedDay] = useState(() => days[centerIndex]);
	// default to today

	//console.log(selectedDay.format("YYYY-MM-DD"));

	console.log(selectedDay.format("YYYY-MM-DD"));

	return (
		<>
			<div className="overflow-x-auto whitespace-nowrap max-w-screen p-4 bg-gray-100 ">
				{days.map((day, i) => {
					const isToday = day.isSame(today, "day");
					const isSelected = day.isSame(selectedDay, "day");
					const isBeforeToday = day.isBefore(today, "day");

					const baseClasses =
						"inline-block mx-2 p-2  rounded-lg text-center shadow-sm hover:bg-blue-100";
					const isSelectedClass = isSelected
						? "bg-blue-500 text-white"
						: isBeforeToday
						? "bg-gray-200 text-gray-500"
						: "bg-white";
					const borderClass = isToday ? "!border-2 !border-blue-700" : "";

					const className = `${baseClasses} ${isSelectedClass} ${borderClass}`;

					return (
						<button
							key={i}
							ref={isToday ? todayRef : null}
							onClick={() => {
								setSelectedDay(day);
								console.log(isToday);
							}}
							className={className}
						>
							<div className="text-sm">{day.add(1, "day").format("dddd")}</div>
							<div className="text-3xl font-bold">{day.format("D")}</div>
							<div className="text-sm">{day.format("MMMM")}</div>
							<div className="text-xs">{day.format("YYYY")}</div>
						</button>
					);
				})}
			</div>
		</>
	);
}
