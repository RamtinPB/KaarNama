import { useEffect, useState } from "react";
import dayjs from "../utils/dayjs-jalali";
import { Button, Card, CardBody, CardHeader } from "@material-tailwind/react";
import { getJalaliDays } from "../utils/JalaliDays";

const allDays = getJalaliDays();

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

export default function IntelCards({ selectedDays }: IntelCardsProps) {
	const [intelData, setIntelData] = useState<IntelDataItem[]>([]);
	const [filteredData, setFilteredData] = useState<IntelDataItem[]>([]);

	const [totalResourceCount, setTotalResourceCount] = useState<number>(0);
	const [resourceTotals, setResourceTotals] = useState<{
		[key: string]: number;
	}>({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch("/data/intelData.json");
				const jsonData: IntelDataItem[] = await res.json();
				setIntelData(jsonData);
			} catch (error) {
				console.error("Error fetching intel data:", error);
			}
		};

		fetchData();
	}, []);

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
			<div className="grid grid-cols-2 items-center justify-center gap-5 px-20">
				{filteredData.length === 0 ? (
					<p className="text-gray-500 text-center col-span-full">
						هیچ داده‌ای برای تاریخ‌ انتخاب‌ شده وجود ندارد.
					</p>
				) : (
					<>
						<div className="col-span-full p-4 pt-3 bg-green-100 border border-green-300 rounded-lg  font-semibold text-green-800">
							<p>مجموع مواد اولیه: {totalResourceCount} تن</p>
							<ul className="grid grid-cols-1 sm:grid-cols-1 gap-y-1 gap-x-6 mt-2 text-sm text-right">
								{Object.entries(resourceTotals).map(([key, value], i) => (
									<li key={i} className="flex gap-1">
										<span className="font-medium">{key}:</span> {value} تن
									</li>
								))}
							</ul>
						</div>

						{filteredData.map((item, idx) => {
							// Step 1: check if this item matches a selected day
							const matchedSelected = selectedDays.find(
								(d) => d.format("YYYY-MM-DD") === item.date
							);

							// Step 2: find the equivalent object from the original `days` array
							const day =
								allDays.find(
									(d) =>
										d.format("YYYY-MM-DD") ===
										matchedSelected?.format("YYYY-MM-DD")
								) ?? null;

							//console.log(day);

							return (
								// @ts-ignore
								<Card
									key={idx}
									className="bg-gray-200 shadow-lg p-4 rounded-xl h-full container"
								>
									{/* @ts-ignore */}
									<CardHeader className="pb-2 bg-inherit  shadow-none">
										<h3 className="text-lg font-semibold mb-2">
											کارگاه: {item.workshop} | مسئول: {item.manager} | شماره
											تماس: {item.phone}
										</h3>
									</CardHeader>
									{/* @ts-ignore */}
									<CardBody className="flex flex-row justify-between">
										<ul className="list-disc pr-5 text-md">
											{item.resources.map((res, i) => {
												const [key, value] = Object.entries(res)[0];
												return (
													<li key={i}>
														<span className="font-medium">{key}:</span> {value}{" "}
														تن
													</li>
												);
											})}
										</ul>
										{/* @ts-ignore */}
										<Button
											key={idx}
											disabled
											className={
												"inline-block mx-2 p-2 w-24 max-h-fit bg-white  rounded-lg text-center !border-0 text-black shadow-md !cursor-default"
											}
										>
											<div className="text-sm">
												{day?.add(1, "day").format("dddd")}
											</div>
											<div className="text-3xl font-bold">
												{day?.format("D")}
											</div>
											<div className="text-sm">{day?.format("MMMM")}</div>
											<div className="text-xs">{day?.format("YYYY")}</div>
										</Button>
									</CardBody>
								</Card>
							);
						})}
					</>
				)}
			</div>
		</>
	);
}
