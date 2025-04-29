import { Button, IconButton, Input } from "@material-tailwind/react";
import dayjs from "../utils/dayjs-jalali";
import { useState, useRef, useEffect } from "react";
import { getJalaliDays } from "../utils/JalaliDays";

interface CalendarBeltProps {
	onSelectDays: (days: dayjs.Dayjs[]) => void;
}

const days = getJalaliDays();

export default function CalendarBelt({ onSelectDays }: CalendarBeltProps) {
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

	const [selectedDays, setSelectedDays] = useState(() => [today]); // default to today

	useEffect(() => {
		onSelectDays(selectedDays);
	}, [selectedDays]);

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

		// Find the matching dayjs object for rangeFrom
		const from = days.find((day) => day.format("YYYY-MM-DD") === rangeFrom);

		// Find the matching dayjs object for rangeTo
		const to = days.find((day) => day.format("YYYY-MM-DD") === rangeTo);

		// Validate if dates are within the range of days array and 'from' is earlier than 'to'
		if (!from?.isValid() || !to?.isValid()) {
			alert("Invalid date(s). Please check if the dates exist.");
			return;
		}

		// Function to adjust an invalid "31st" or out-of-range date to the last valid day
		const fixInvalidJalaliDate = (date: dayjs.Dayjs): dayjs.Dayjs => {
			// Check if the date exceeds the number of days in the month
			if (date.date() > date.daysInMonth()) {
				// Adjust the date to the last valid day of the current month
				return date.endOf("month"); // This will move the date to the last valid day of the month
			}
			return date;
		};

		// Fix the 'from' and 'to' dates if necessary
		const fixedFrom = fixInvalidJalaliDate(from);
		const fixedTo = fixInvalidJalaliDate(to);

		// If the fixed dates are different, show a message
		if (fixedFrom.isAfter(from)) {
			alert(
				`The date ${from.format("YYYY-MM-DD")} was invalid. Adjusting to the last valid day.`
			);
		}
		if (fixedTo.isAfter(to)) {
			alert(
				`The date ${to.format("YYYY-MM-DD")} was invalid. Adjusting to the last valid day.`
			);
		}

		// Convert the first and last valid days in the days[] array to Jalali dates
		const firstDay = dayjs(days[0]).locale("fa");
		const lastDay = dayjs(days[days.length - 1]).locale("fa");

		// Validate if the dates are valid Jalali dates
		const fromStr = fixedFrom.format("YYYY-MM-DD");
		const toStr = fixedTo.format("YYYY-MM-DD");
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
			alert("The 'from' date must be earlier than the 'to' date.");
			return;
		}

		if (fixedFrom.isAfter(fixedTo)) {
			alert("The 'from' date must be earlier than the 'to' date.");
			return;
		}

		// Process the range and select days
		const range = [];
		let current = fixedFrom.clone();
		while (current.isSameOrBefore(fixedTo, "day")) {
			// Ensure each day in the range is a valid Jalali date before adding it
			if (current.isValid()) {
				range.push(current.clone());
			}
			current = current.add(1, "day");
		}

		setSelectedDays(range); // set as array
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
			<div className="overflow-x-auto py-10 whitespace-nowrap w-full  p-4 bg-gray-100">
				{days.map((day, i) => {
					const isToday = day.isSame(today, "day");
					const isSelected = selectedDays.some(
						(d) => d.format("YYYY-MM-DD") === day.format("YYYY-MM-DD")
					);

					const isBeforeToday = day.isBefore(today, "day");

					const baseClasses =
						"inline-block mx-2 p-2 w-24 rounded-lg text-center text-black shadow-md hover:bg-blue-500 hover:text-white focus:outline-none";
					const isSelectedClass = isSelected
						? isBeforeToday
							? "bg-blue-300 text-white" // lighter blue for past selected
							: "bg-blue-800 text-white" // default blue for present/future selected
						: isBeforeToday
							? "bg-gray-300 text-gray-500"
							: "bg-white";
					const borderClass = isToday ? "!border-[3px] !border-black" : "";

					const className = `${baseClasses} ${isSelectedClass} ${borderClass}`;

					//console.log(day);

					return (
						// @ts-ignore
						<button
							key={i}
							ref={isToday ? todayRef : null}
							onClick={() => {
								setSelectedDays([day]);
							}}
							className={className}
						>
							<div className="text-base font-normal">
								{day.add(1, "day").format("dddd")}
							</div>
							<div className="text-3xl font-semibold">{day.format("D")}</div>
							<div className="text-base font-normal">{day.format("MMMM")}</div>
							<div className="text-sm font-normal">{day.format("YYYY")}</div>
						</button>
					);
				})}
			</div>
			<div className="p-4 my-4 flex flex-col md:flex-row gap-4 items-center justify-center">
				<div className="flex w-full md:w-fit gap-1.5 items-center justify-center">
					{/* @ts-ignore */}
					<Input
						type="text"
						label="از تاریخ"
						placeholder="YYYY-MM-DD"
						variant="standard"
						color="black"
						value={rangeFrom}
						onChange={(e) => handleDateChange(e, setRangeFrom)}
						containerProps={{
							className: "!w-fit",
						}}
						className=" "
					/>
					{/* @ts-ignore */}
					<IconButton
						onClick={() => {
							setRangeFrom(today.format("YYYY-MM-DD"));
						}}
						className="w-10 h-10 text-white flex items-center justify-center rounded-pill"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="size-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
							/>
						</svg>
					</IconButton>
				</div>
				<div className="flex w-full md:w-fit items-center gap-1.5 justify-start md:justify-center">
					{/* @ts-ignore */}
					<Input
						type="text"
						label="تا تاریخ"
						placeholder="YYYY-MM-DD"
						variant="standard"
						color="black"
						value={rangeTo}
						onChange={(e) => handleDateChange(e, setRangeTo)}
						containerProps={{
							className: "!w-full !md:!w-fit",
						}}
						className=""
					/>
				</div>
				{/* @ts-ignore */}
				<Button
					size="md"
					color="black"
					onClick={handleApply}
					className=" text-white !text-lg w-full md:!w-fit h-10 px-4 py-2 rounded-pill"
				>
					اعمال
				</Button>
			</div>
		</>
	);
}
