export default function jsonToCsv(jsonData: string): string {
	const csvRows = [];

	const headers = ['Train Number', 'Train Type', 'Stop Points', 'Arrival Times'];
	csvRows.push(headers.join(','));

	jsonData.forEach(train => {
			const trainNumber = train.train_number;
			const trainType = `"${train.train_type}"`;
			const stopPoints = `"[${train.stop_points.join(', ')}]"`;
			const arrivalTimes = `"[${train.arrival_time.join(', ')}]"`;

			const row = [trainNumber, trainType, stopPoints, arrivalTimes];
			csvRows.push(row.join(','));
	});

	return csvRows.join('\n');
}