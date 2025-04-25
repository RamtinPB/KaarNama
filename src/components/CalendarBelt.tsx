import { Button, Input } from "@material-tailwind/react";
import dayjs from "../utils/dayjs-jalali";
import { useState, useRef, useEffect } from "react";
import { getJalaliDays, DAYS_COUNT } from "../utils/JalaliDays";

interface CalendarBeltProps {
	onSelectDays: (days: dayjs.Dayjs[]) => void;
}

const days = getJalaliDays();

export default function CalendarBelt({ onSelectDays }: CalendarBeltProps) {
	const centerIndex = Math.floor(DAYS_COUNT / 2); // center is today

	const today = dayjs()
		.subtract(1, "day")
		.startOf("day")
		.calendar("jalali")
		.locale("fa");

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

	const [selectedDays, setSelectedDays] = useState(() => [days[centerIndex]]); // default to today

	const [rangeFrom, setRangeFrom] = useState("");
	const [rangeTo, setRangeTo] = useState("");

	//console.log(selectedDay[0].format("YYYY-MM-DD"));

	//------------------------------------------ Functions ------------------------------------------------------

	const handleApply = () => {
		const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

		// Check if input dates match the format
		if (!dateFormat.test(rangeFrom) || !dateFormat.test(rangeTo)) {
			alert("Please enter dates in YYYY-MM-DD format.");
			return;
		}

		// Parse the dates as Jalali dates
		const from = dayjs(rangeFrom, "YYYY-MM-DD", true).locale("fa");
		const to = dayjs(rangeTo, "YYYY-MM-DD", true).locale("fa");

		// Validate if dates are within the range of days array and 'from' is earlier than 'to'
		if (!from.isValid() || !to.isValid()) {
			alert("Invalid date(s).");
			return;
		}

		// Convert the first and last valid days in the days[] array to Jalali dates
		const firstDay = dayjs(days[0]).locale("fa");
		const lastDay = dayjs(days[days.length - 1]).locale("fa");

		// Validate if the dates are valid Jalali dates
		if (!from.isValid() || !to.isValid()) {
			alert("Invalid date(s).");
			return;
		}

		// Convert Jalali dayjs objects to formatted strings
		const fromStr = from.format("YYYY-MM-DD");
		const toStr = to.format("YYYY-MM-DD");
		const firstStr = firstDay.format("YYYY-MM-DD");
		const lastStr = lastDay.format("YYYY-MM-DD");

		// Compare using plain strings
		if (fromStr < firstStr || toStr > lastStr) {
			alert(
				`Dates must be within the range: ${firstStr} - ${lastStr}, but received: ${fromStr} and ${toStr}`
			);
			return;
		}

		// Validate 'from' is not after 'to'
		if (fromStr > toStr) {
			alert("The 'from' date must be earlier than or equal to the 'to' date.");
			return;
		}

		if (from.isAfter(to)) {
			alert("The 'from' date must be earlier than the 'to' date.");
			return;
		}

		// Process the range and select days
		const range = [];
		let current = from.clone();
		while (current.isSameOrBefore(to, "day")) {
			range.push(current.clone());
			current = current.add(1, "day");
		}

		setSelectedDays(range); // set as array
		onSelectDays(range);
		//console.log(range.map((d) => d.format("YYYY-MM-DD")));
	};

	const handleDateChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		setter: React.Dispatch<React.SetStateAction<string>>
	) => {
		let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
		value = value.slice(0, 8); // Limit to 8 digits (YYYYMMDD)

		let formatted = "";
		if (value.length >= 4) {
			formatted += value.slice(0, 4);
			if (value.length > 4) {
				formatted += "-" + value.slice(4, 6);
				if (value.length > 6) {
					formatted += "-" + value.slice(6, 8);
				}
			}
		} else {
			formatted = value;
		}

		setter(formatted);
	};

	return (
		<>
			<div className="overflow-x-auto py-10 whitespace-nowrap max-w-screen p-4 bg-gray-100">
				{days.map((day, i) => {
					const isToday = day.isSame(today, "day");
					const isSelected = selectedDays.some(
						(d) => d.format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
					);

					const isBeforeToday = day.isBefore(today, "day");

					const baseClasses =
						"inline-block mx-2 p-2 w-24 rounded-lg text-center text-black shadow-sm hover:bg-blue-200";
					const isSelectedClass = isSelected
						? isBeforeToday
							? "bg-blue-300 text-white" // lighter blue for past selected
							: "bg-blue-500 text-white" // default blue for present/future selected
						: isBeforeToday
						? "bg-gray-300 text-gray-500"
						: "bg-white";
					const borderClass = isToday ? "!border-3 !border-black" : "";

					const className = `${baseClasses} ${isSelectedClass} ${borderClass}`;

					//console.log(day);

					return (
						// @ts-ignore
						<Button
							key={i}
							ref={isToday ? todayRef : null}
							onClick={() => {
								setSelectedDays([day]), onSelectDays([day]);
							}}
							className={className}
						>
							<div className="text-sm">{day.add(1, "day").format("dddd")}</div>
							<div className="text-3xl font-bold">{day.format("D")}</div>
							<div className="text-sm">{day.format("MMMM")}</div>
							<div className="text-xs">{day.format("YYYY")}</div>
						</Button>
					);
				})}
			</div>
			<div className="p-4 my-4 w-screen flex flex-row gap-4 items-center justify-center">
				<span>از</span>
				{/* @ts-ignore */}
				<Input
					type="text"
					placeholder="YYYY-MM-DD"
					value={rangeFrom}
					onChange={(e) => handleDateChange(e, setRangeFrom)}
					className="border p-2 rounded"
				/>
				<span>تا</span>
				{/* @ts-ignore */}
				<Input
					type="text"
					placeholder="YYYY-MM-DD"
					value={rangeTo}
					onChange={(e) => handleDateChange(e, setRangeTo)}
					className="border p-2 rounded"
				/>
				{/* @ts-ignore */}
				<Button
					onClick={handleApply}
					className="bg-blue-500 text-white px-4 py-2 rounded"
				>
					اعمال
				</Button>
			</div>
		</>
	);
}
