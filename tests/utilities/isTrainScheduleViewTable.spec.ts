import isTrainScheduleViewTable from '../../src/utilities/isTrainScheduleViewTable';

describe('isTrainScheduleViewTable', () => {
	it('Should returns true for correct jsonData structure.', () => {
		const jsonData: any[] = [
			{
			  train_number: '1111',
			  train_type: 'Russian',
			  stop_points: [ 'Faiyum', 'Wasta', 'Ayat', 'Giza', 'Cairo' ],
			  arrival_time: [ '12:50 pm', '01:39 pm', '02:05 pm', '02:49 pm', '03:10 pm' ]
			}
		];
		const result = isTrainScheduleViewTable(jsonData);
		expect(result).toEqual(true);
	});

	it('Should returns false for incorrect jsonData structure.', () => {
		const jsonData: any[] = [
			{
			  train_number: '1111',
			  stop_points: [ 'Faiyum', 'Wasta', 'Ayat', 'Giza', 'Cairo' ],
			  arrival_time: [ '12:50 pm', '01:39 pm', '02:05 pm', '02:49 pm', '03:10 pm' ]
			}
		];
		const result = isTrainScheduleViewTable(jsonData);
		expect(result).toEqual(false);
	});
});
