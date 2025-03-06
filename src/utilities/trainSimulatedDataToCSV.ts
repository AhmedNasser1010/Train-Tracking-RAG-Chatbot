import translatedStationsNames from "../../translatedStationsNames.json";

export default function trainSimulatedDataToCSV(jsonData: any[]): string {
	const csvRows = [];

	const headers = [
		"Train number",
		"Train type",
		"Current status",
		"Previous station",
		"Current station",
		"Next station",
		"Full route stations",
		"Reach last station en route at",
		"Start first station en route at",
	];
	csvRows.push(headers.join(","));

	jsonData.forEach((train) => {
		const trainNumber = train.trainNumber;
		const trainType = train.trainType;
		const fullRoute = train.fullRoute;
		const status = train.status;
		const previousStation = train.previousStation || "null";
		const currentStation = train.currentStation;
		const nextStation = train.nextStation || "null";
		const arrivalAt = train.arrival_at;
		const departureAt = train.departure_at;
		
		const row = [
			trainNumber,
			trainType,
			status,
			previousStation,
			currentStation,
			nextStation,
			fullRoute,
			arrivalAt,
			departureAt,
		];

		const escapedRow = row.map((field) => `"${field}"`);
		csvRows.push(escapedRow.join(","));
	});

	return csvRows.join("\n");
}
