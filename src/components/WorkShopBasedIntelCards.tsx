import { CardBody, Card, CardHeader } from "@material-tailwind/react";
import dayjs from "../utils/dayjs-jalali";
import { getJalaliDays } from "../utils/JalaliDays";

const allDays = getJalaliDays();

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

interface WorkshopBasedIntelCardsProps {
	groupedData_WorkshopBased: {
		workshop: string;
		manager: string;
		phone: string;
		items: IntelDataItem[];
	}[];
	selectedDays: dayjs.Dayjs[];
}

export default function WorkshopBasedIntelCards({
	groupedData_WorkshopBased,
	selectedDays,
}: WorkshopBasedIntelCardsProps) {
	return (
		<>
			{groupedData_WorkshopBased.map((group, idx) => {
				//console.log(group);
				return (
					// @ts-ignore
					<Card
						key={idx}
						className="bg-gray-300 shadow-lg p-4 rounded-xl h-full"
					>
						{/* @ts-ignore */}
						<CardHeader className="bg-inherit shadow-none m-0 p-4 pb-0">
							<h3 className="flex flex-col gap-1.5 mb-2 ">
								<span className="text-xl font-bold flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="size-4"
									>
										<path
											fillRule="evenodd"
											d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
											clipRule="evenodd"
										/>
									</svg>
									کارگاه: {group.workshop}
								</span>
								<span className="text-sm font-medium flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="size-4"
									>
										<path
											fillRule="evenodd"
											d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
											clipRule="evenodd"
										/>
									</svg>
									مسئول: {group.manager}
								</span>
								<span className="text-sm font-medium flex items-center gap-1">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="size-4"
									>
										<path
											fillRule="evenodd"
											d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
											clipRule="evenodd"
										/>
									</svg>
									شماره تماس: {group.phone}
								</span>
							</h3>
						</CardHeader>
						{/* @ts-ignore */}
						<CardBody className="flex flex-col gap-10 pt-0">
							{group.items.map((item, subIdx) => {
								const matchedSelected = selectedDays.find(
									(d) => d.format("YYYY-MM-DD") === item.date
								);

								if (!matchedSelected) return null;

								const day =
									allDays.find(
										(d) =>
											d.format("YYYY-MM-DD") ===
											matchedSelected.format("YYYY-MM-DD")
									) ?? null;

								return (
									<div
										key={subIdx}
										className="flex gap-5 items-start border-t-2 border-gray-500 pt-2"
									>
										{/* Resource List */}
										<ul className="grid grid-cols-1 gap-y-1 gap-x-8 list-disc pr-5 text-md flex-1">
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

										{/* Date Card */}
										<div className="inline-block mx-2 p-2 w-24 bg-white rounded-lg text-center !border-0 text-black shadow-md ">
											<div className="text-sm font-medium">
												{day?.add(1, "day").format("dddd")}
											</div>
											<div className="text-3xl font-bold">
												{day?.format("D")}
											</div>
											<div className="text-sm font-medium">
												{day?.format("MMMM")}
											</div>
											<div className="text-xs font-medium">
												{day?.format("YYYY")}
											</div>
										</div>
									</div>
								);
							})}
						</CardBody>
					</Card>
				);
			})}
		</>
	);
}
