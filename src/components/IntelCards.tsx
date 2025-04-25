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
	resources: ResourceItem[];
}

export default function IntelCards({ selectedDays }: IntelCardsProps) {
	const [intelData, setIntelData] = useState<IntelDataItem[]>([]);
	const [filteredData, setFilteredData] = useState<IntelDataItem[]>([]);
	const [totalResourceCount, setTotalResourceCount] = useState<number>(0);

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

		// Calculate total of all resource values
		const total = matched.reduce((acc, item) => {
			const workshopTotal = item.resources.reduce((sum, resource) => {
				const [_, value] = Object.entries(resource)[0];
				return sum + parseInt(value);
			}, 0);
			return acc + workshopTotal;
		}, 0);

		setTotalResourceCount(total);
	}, [selectedDays, intelData]);

	return (
		<>
			<div className="grid grid-cols-2  items-center justify-center gap-5 px-20">
				{filteredData.length === 0 ? (
					<p className="text-gray-500">
						هیچ داده‌ای برای تاریخ‌های انتخاب‌شده وجود ندارد.
					</p>
				) : (
					<>
						<div className="col-span-full p-4 pt-3 bg-green-100 border border-green-300 rounded-lg text-center font-semibold text-green-800">
							مجموع مواد اولیه: {totalResourceCount} تن
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
											کارگاه: {item.workshop}
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
