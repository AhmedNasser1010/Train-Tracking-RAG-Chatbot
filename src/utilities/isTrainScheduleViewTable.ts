export default function isTrainScheduleViewTable(jsonData: any[]): boolean {

	for (const train of jsonData) {
		let keys: string[] = [];

		Object.entries(train).forEach(([key, value]) => {
	    keys.push(key);
		});

		if (
			keys.length !== 4 ||
			!keys.includes('train_number') ||
			!keys.includes('train_type') ||
			!keys.includes('stop_points') ||
			!keys.includes('arrival_time')) {
			return false
		}

		keys = [];
	}

	return true
}

// {
//   train_number: '1111',
//   train_type: 'Russian',
//   stop_points: [ 'Faiyum', 'Wasta', 'Ayat', 'Giza', 'Cairo' ],
//   arrival_time: [ '12:50 pm', '01:39 pm', '02:05 pm', '02:49 pm', '03:10 pm' ]
// }
