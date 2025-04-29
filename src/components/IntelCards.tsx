import { useEffect, useState } from "react";
import dayjs from "../utils/dayjs-jalali";
import DayBasedIntelCards from "./DayBasedIntelCards";
import { Button, ButtonGroup } from "@material-tailwind/react";
import { getJalaliDays } from "../utils/JalaliDays";
import { generateDistribution } from "../Distribution/Distribute";

interface IntelCardsProps {
	selectedDays: dayjs.Dayjs[];
}

// TypeScript types for the dataset
interface ResourceItem {
	[key: string]: string;
}

interface IntelDataItem {
	date: string;
	workshop: string;
	manager: string;
	phone: string;
	resources: ResourceItem[];
}

interface Workshop {
	workshop: string;
	manager: string;
	phone: string;
	resourceLimits: {
		[key: string]: number;
	};
}

export default function IntelCards({ selectedDays }: IntelCardsProps) {
	const [displaySettings, setDisplaySettings] = useState<string>("DayBased");

	const [intelData, setIntelData] = useState<IntelDataItem[]>([]);
	const [workshops, setWorkshops] = useState<Workshop[]>([]);
	const [filteredData, setFilteredData] = useState<IntelDataItem[]>([]);
	const [groupedData_DayBased, setGroupedData_DayBased] = useState<
		{ date: string; items: IntelDataItem[] }[]
	>([]);

	const [totalResourceCount, setTotalResourceCount] = useState<number>(0);
	const [resourceTotals, setResourceTotals] = useState<{
		[key: string]: number;
	}>({});

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			const res = await fetch("/data/intelData.json");
	// 			const jsonData: IntelDataItem[] = await res.json();
	// 			setIntelData(jsonData);
	// 		} catch (error) {
	// 			console.error("Error fetching intel data:", error);
	// 		}
	// 	};

	// 	fetchData();
	// }, []);

	// --------------------------------------------------------------
	// your workshops input
	useEffect(() => {
		const fetchWorkshops = async () => {
			try {
				const res = await fetch("/data/workshopData.json");
				const data: Workshop[] = await res.json();
				setWorkshops(data);
			} catch (err) {
				console.error("Failed to fetch workshops:", err);
			}
		};

		fetchWorkshops();
	}, []);

	// all the resource names
	const resources = [
		"ماده 1",
		"ماده 2",
		"ماده 3",
		"ماده 4",
		"ماده 6",
		"ماده 7",
		"ماده 8",
		"ماده 9",
		"ماده 10",
	];

	useEffect(() => {
		if (workshops.length === 0) return;

		const cleanWorkshops = workshops.map((workshop) => ({
			...workshop,
			resourceLimits: Object.fromEntries(
				Object.entries(workshop.resourceLimits).filter(
					([_, value]) => typeof value === "number"
				)
			),
		}));

		const jalaliDays = getJalaliDays().map((day) => day.format("YYYY/MM/DD"));
		const output = generateDistribution(
			cleanWorkshops,
			resources,
			jalaliDays,
			45
		);
		setIntelData(output);
	}, [workshops]);

	// Log intelData whenever it changes
	useEffect(() => {
		console.log("intelData updated:", intelData);
	}, [intelData]);

	////////////---------------------------------------------------------

	useEffect(() => {
		// Convert selectedDays to formatted date strings
		const selectedDateStrings = selectedDays.map((day) =>
			day.format("YYYY-MM-DD")
		);

		// Filter intelData to only include entries whose date matches selectedDays
		const matched = intelData.filter((item) =>
			selectedDateStrings.includes(item.date)
		);

		setFilteredData(matched);

		// Group matched data by date
		const grouped: { [date: string]: IntelDataItem[] } = {};

		matched.forEach((item) => {
			if (!grouped[item.date]) {
				grouped[item.date] = [];
			}
			grouped[item.date].push(item);
		});

		// Convert the grouped object into an array
		const groupedArray = Object.entries(grouped).map(([date, items]) => ({
			date,
			items,
		}));

		console.log(groupedArray);
		setGroupedData_DayBased(groupedArray);

		let total = 0;
		const totalsMap: { [key: string]: number } = {};

		matched.forEach((item) => {
			item.resources.forEach((res) => {
				const [name, val] = Object.entries(res)[0];
				const value = parseInt(val);

				// Sum per "ماده"
				if (!totalsMap[name]) totalsMap[name] = 0;
				totalsMap[name] += value;

				// Sum total
				total += value;
			});
		});

		setTotalResourceCount(total);
		setResourceTotals(totalsMap);
	}, [selectedDays, intelData]);

	return (
		<>
			<div
				className="flex justify-center items-center  pb-5 "
				style={{ direction: "ltr" }}
			>
				{/* @ts-ignore */}
				<ButtonGroup>
					{/* @ts-ignore */}
					<Button
						className="bg-black text-sm flex gap-1 items-center "
						onClick={() => {
							setDisplaySettings("WorkshopBased");
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-5"
						>
							<path
								fillRule="evenodd"
								d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
								clipRule="evenodd"
							/>
						</svg>
						<span>نمایش کارگاه محور</span>
					</Button>
					{/* @ts-ignore */}
					<Button
						className="bg-black text-sm flex gap-2 items-center "
						onClick={() => {
							setDisplaySettings("DayBased");
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-5"
						>
							<path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
						</svg>
						<span>نمایش روز محور</span>
					</Button>
				</ButtonGroup>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-7 px-8 md:px-14 lg:px-36">
				{filteredData.length === 0 ? (
					<p className="text-gray-500 text-center col-span-full">
						هیچ داده‌ای برای تاریخ‌ انتخاب‌ شده وجود ندارد.
					</p>
				) : (
					<>
						<div className=" h-full p-8  bg-green-100  shadow-lg rounded-xl font-semibold text-green-800">
							<h2 className="text-xl">
								مجموع مواد اولیه: {totalResourceCount} تن
							</h2>
							<ul className="grid grid-cols-1 gap-y-1.5 gap-x-8 mt-3 text-md pr-5">
								{Object.entries(resourceTotals).map(([key, value], i) => (
									<li key={i} className="list-disc">
										<span className="font-semibold">{key}:</span> {value} تن
									</li>
								))}
							</ul>
						</div>

						{displaySettings === "DayBased" ? (
							<DayBasedIntelCards
								groupedData_DayBased={groupedData_DayBased}
								selectedDays={selectedDays}
							/>
						) : (
							<p></p>
						)}
					</>
				)}
			</div>
		</>
	);
}
