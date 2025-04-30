import { today } from "../utils/JalaliDays";

// types
type Workshop = {
	workshop: string;
	manager: string;
	phone: string;
	resourceLimits: Record<string, number>;
};

interface ResourceItem {
	[key: string]: string;
}

type DistributionEntry = {
	date: string;
	workshop: string;
	manager: string;
	phone: string;
	resources: ResourceItem[];
	stage: number; // New field for stage number
};

// the main function
export function generateDistribution(
	workshops: Workshop[],
	availableResources: string[],
	daysArray: string[],
	coverageDays: number = 45
): DistributionEntry[] {
	const result: DistributionEntry[] = [];

	// Format days to YYYY-MM-DD
	const formattedDaysArray = daysArray.map((day) => day.replace(/\//g, "-"));

	// Slice only the next 45 days starting from today
	const todayIndex = formattedDaysArray.findIndex(
		(day) => day > today.format("YYYY-MM-DD")
	);
	if (todayIndex === -1) return [];

	const validDays = formattedDaysArray.slice(
		todayIndex,
		todayIndex + coverageDays
	);

	// Function to pick random consecutive days within remaining slots
	function getRandomConsecutiveDays(
		startIdx: number,
		maxLength: number
	): number[] {
		const stageLength = Math.min(
			maxLength,
			Math.floor(Math.random() * 3) + 2 // Between 2 to 4 days
		);
		return Array.from({ length: stageLength }, (_, i) => startIdx + i);
	}

	workshops.forEach((workshop, workshopIdx) => {
		const { workshop: workshopId, manager, phone, resourceLimits } = workshop;

		// We will use a pointer to know which day we are in
		let currentDayIndex = workshopIdx; // to stagger workshops a bit
		let currentStage = 1; // Start with the first stage for each workshop

		for (const [material, totalAmount] of Object.entries(resourceLimits)) {
			// Skip invalid materials
			if (!availableResources.includes(material)) continue;

			// Determine how many days this stage will take
			if (currentDayIndex >= validDays.length) break;

			const stageDaysIndices = getRandomConsecutiveDays(
				currentDayIndex,
				validDays.length - currentDayIndex
			);

			const numDays = stageDaysIndices.length;
			if (numDays === 0) continue;

			// Distribute totalAmount across numDays with some randomness
			let remaining = totalAmount;
			const dailyDistributions: number[] = [];

			for (let i = 0; i < numDays; i++) {
				if (i === numDays - 1) {
					dailyDistributions.push(remaining); // Last day gets the rest
				} else {
					const base = Math.floor(totalAmount / numDays);
					const variation = Math.floor(base * (Math.random() * 0.3 - 0.15));
					const amount = Math.max(
						1,
						Math.min(remaining - (numDays - i - 1), base + variation)
					);
					dailyDistributions.push(amount);
					remaining -= amount;
				}
			}

			// Add to result with the stage number
			stageDaysIndices.forEach((dayIdx, i) => {
				if (dayIdx >= validDays.length) return;
				const date = validDays[dayIdx];
				const amount = dailyDistributions[i].toString();

				result.push({
					date,
					workshop: workshopId,
					manager,
					phone,
					resources: [{ [material]: amount }],
					stage: currentStage, // Add the current stage to the entry
				});
			});

			// Advance pointer
			currentDayIndex += numDays + 0; // leave x day gap between stages
			currentStage++; // Increment the stage for the next material
		}
	});

	result.sort((a, b) => a.date.localeCompare(b.date));
	return result;
}
