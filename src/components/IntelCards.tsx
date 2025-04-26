import { useEffect, useState } from "react";
import dayjs from "../utils/dayjs-jalali";
import { Button, Card, CardBody } from "@material-tailwind/react";
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
	const [groupedData, setGroupedData] = useState<
		{ date: string; items: IntelDataItem[] }[]
	>([]);

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

		setGroupedData(groupedArray);

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
			<div className="grid grid-cols-2 items-center justify-center gap-5 px-36 ">
				{filteredData.length === 0 ? (
					<p className="text-gray-500 text-center col-span-full">
						هیچ داده‌ای برای تاریخ‌ انتخاب‌ شده وجود ندارد.
					</p>
				) : (
					<>
						<div className="h-full p-4 pt-3 bg-green-100  shadow-md rounded-xl font-semibold text-green-800">
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

						{groupedData.map((group, idx) => {
							// Step 1: check if this item matches a selected day
							const matchedSelected = selectedDays.find(
								(d) => d.format("YYYY-MM-DD") === group.date
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
									className="bg-gray-200 shadow-lg p-4 rounded-xl h-full"
								>
									{/* @ts-ignore */}
									<CardBody className="flex flex-row justify-between gap-5">
										<div className="flex flex-col gap-12 ">
											{group.items.map((item, subIdx) => (
												<div key={subIdx}>
													<h3 className="flex flex-col gap-1.5 mb-2 ">
														<span className="text-xl font-bold flex items-center gap-1">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																fill="currentColor"
																className="size-4"
															>
																<path
																	fill-rule="evenodd"
																	d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
																	clip-rule="evenodd"
																/>
															</svg>
															کارگاه: {item.workshop}
														</span>
														<span className="text-sm font-medium flex items-center gap-1">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																fill="currentColor"
																className="size-4"
															>
																<path
																	fill-rule="evenodd"
																	d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
																	clip-rule="evenodd"
																/>
															</svg>
															مسئول: {item.manager}
														</span>
														<span className="text-sm font-medium flex items-center gap-1">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 24 24"
																fill="currentColor"
																className="size-4"
															>
																<path
																	fill-rule="evenodd"
																	d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
																	clip-rule="evenodd"
																/>
															</svg>
															شماره تماس: {item.phone}
														</span>
														<hr className="w-[431px]" />
													</h3>
													<ul className="grid grid-cols-1 gap-y-1 gap-x-8 list-disc pr-5 text-md">
														{item.resources.map((res, i) => {
															const [key, value] = Object.entries(res)[0];
															return (
																<li key={i}>
																	<span className="font-medium">{key}:</span>{" "}
																	{value} تن
																</li>
															);
														})}
													</ul>
												</div>
											))}
										</div>
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
