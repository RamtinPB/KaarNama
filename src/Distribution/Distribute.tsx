import { today } from "../utils/JalaliDays";

// types
type Workshop = {
	workshop: string;
	manager: string;
	phone: string;
	resourceLimits: Record<string, number>; // example: { "ماده 1": 100, "ماده 2": 200 }
};

interface ResourceItem {
	[key: string]: string; // A resource item is a key-value pair, where the key is the resource name and value is a string
}

type DistributionEntry = {
	date: string;
	workshop: string;
	manager: string;
	phone: string;
	resources: ResourceItem[]; // now an array of ResourceItem
};

// the main function
export function generateDistribution(
	workshops: Workshop[],
	availableResources: string[],
	daysArray: string[], // expect dates like YYYY/MM/DD
	coverageDays: number = 45 // how many days the supply should cover
): DistributionEntry[] {
	const result: DistributionEntry[] = [];

	// Convert daysArray to YYYY-MM-DD format if it's not already in that format
	const formattedDaysArray = daysArray.map((day) => day.replace(/\//g, "-"));

	// simple logic: distribute every 7 days
	const distributionInterval = 7;
	const distributionsNeeded = Math.ceil(coverageDays / distributionInterval);

	// Get the index of the first day that is after today
	const todayIndex = formattedDaysArray.findIndex(
		(day) => day > today.format("YYYY-MM-DD")
	);

	// If no future day is found, return an empty distribution (safety check)
	if (todayIndex === -1) return [];

	// Loop over workshops
	workshops.forEach((workshop) => {
		const { workshop: workshopId, manager, phone, resourceLimits } = workshop;

		//const workshopOffset = Math.floor(Math.random() * distributionInterval); // 0 to 6
		const workshopOffset = workshops.indexOf(workshop); // simple stagger

		for (let dist = 0; dist < distributionsNeeded; dist++) {
			const dayIndex =
				todayIndex + workshopOffset + dist * distributionInterval;

			// If we exceed the available days, break out of the loop
			if (dayIndex >= formattedDaysArray.length) break;

			const date = formattedDaysArray[dayIndex];
			const resources: ResourceItem[] = [];

			// Only include resources with non-zero values
			availableResources.forEach((resource) => {
				const limit = resourceLimits[resource] || 0;

				// Skip resources with a limit of 0
				if (limit === 0) return;

				// Distribute a fraction of the limit at each distribution
				const baseAmount = limit / distributionsNeeded;
				const variation = Math.random() * 0.3 - 0.15; // -15% to +15%
				const perDistributionAmount = Math.max(
					1,
					Math.round(baseAmount * (1 + variation))
				);

				// Push the resource as a ResourceItem object to the resources array
				resources.push({ [resource]: perDistributionAmount.toString() }); // Convert number to string
			});

			// Add the entry to the result if there are resources to distribute
			if (resources.length > 0) {
				result.push({
					date,
					workshop: workshopId,
					manager,
					phone,
					resources,
				});
			}
		}
	});

	return result;
}
