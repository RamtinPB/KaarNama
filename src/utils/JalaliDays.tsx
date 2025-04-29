import dayjs from "./dayjs-jalali";

export const DAYS_COUNT = 90;
const centerIndex = Math.floor(DAYS_COUNT / 2);

export const getJalaliDays = () =>
	Array.from({ length: DAYS_COUNT }).map((_, i) =>
		dayjs()
			.subtract(1, "day")
			.startOf("day")
			.add(i - centerIndex, "day")
			.calendar("jalali")
			.locale("fa")
	);

export const today = dayjs()
	.subtract(1, "day")
	.startOf("day")
	.calendar("jalali")
	.locale("fa");
