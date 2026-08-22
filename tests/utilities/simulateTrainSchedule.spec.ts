import simulateTrainSchedule from '../../src/utilities/simulateTrainSchedule';
import { TrainScheduleViewEntry } from "../../src/types/TrainScheduleViewEntry";

describe('simulateTrainSchedule', () => {
	const mockTrains: TrainScheduleViewEntry[] = [
		{
			train_number: '1111',
			train_type: 'Russian',
			stop_points: ['Faiyum', 'Wasta', 'Ayat', 'Giza', 'Cairo'],
			arrival_time: ['12:50 pm', '01:39 pm', '02:05 pm', '02:49 pm', '03:15 pm'],
		},
		{
			train_number: '971',
			train_type: 'AC',
			stop_points: ['Giza', 'Cairo'],
			arrival_time: ['11:00 am', '11:45 am'],
		},
	];

	it('should return "لم تنطلق بعد" status for trains before their first arrival time', () => {
		const currentTimeStr = '2/26/2025, 11:00:00 AM';
		const result = simulateTrainSchedule(currentTimeStr, mockTrains);

		expect(result).toEqual(
	    expect.arrayContaining([
	      expect.objectContaining({
	        status: 'لم تنطلق بعد',
	        trainType: 'روسي',
	        currentStation: 'الفيوم',
	        previousStation: null,
	        nextStation: 'الواسطى'
	      })
	    ])
	  );
	});

	it('should return "وصل" status for trains after their last arrival time', () => {
	  const currentTimeStr = '2/26/2025, 04:00:00 PM';
	  const result = simulateTrainSchedule(currentTimeStr, mockTrains);

		expect(result).toEqual(
	    expect.arrayContaining([
	      expect.objectContaining({
	        status: 'وصل',
	        currentStation: 'القاهرة',
	        previousStation: null,
	        nextStation: null
	      })
	    ])
	  );
	});

	it('should return "في الطريق" status for trains between stations', () => {
	  const currentTimeStr = '2/26/2025, 02:30:00 PM';
	  const result = simulateTrainSchedule(currentTimeStr, mockTrains);

	  expect(result).toEqual(
	    expect.arrayContaining([
	      expect.objectContaining({
	        status: 'في الطريق',
	        currentStation: 'في الطريق',
	        previousStation: 'العياط',
	        nextStation: 'الجيزة'
	      })
	    ])
	  );
	});

	it('should return "في الطريق" status for trains at a station', () => {
	  const currentTimeStr = '2/26/2025, 02:05:00 PM';
	  const result = simulateTrainSchedule(currentTimeStr, mockTrains);

	  expect(result).toEqual(
	    expect.arrayContaining([
	      expect.objectContaining({
	        status: 'في الطريق',
	        currentStation: 'العياط',
	        previousStation: 'الواسطى',
	        nextStation: 'الجيزة'
	      })
	    ])
	  );
	});

	it('should translate full route stations to Arabic with their times', () => {
		const result = simulateTrainSchedule('2/26/2025, 02:30:00 PM', mockTrains);

		const train1111 = result.find(t => t.trainNumber === '1111');
		expect(train1111?.fullRoute).toEqual([
			'الفيوم: 12:50 م',
			'الواسطى: 1:39 م',
			'العياط: 2:05 م',
			'الجيزة: 2:49 م',
			'القاهرة: 3:15 م',
		]);
	});

	it('should sort trains chronologically by departure time and format times in Arabic', () => {
		const result = simulateTrainSchedule('2/26/2025, 02:30:00 PM', mockTrains);

		expect(result.map(t => t.trainNumber)).toEqual(['971', '1111']);
		expect(result[0].departure_at).toBe('11:00 ص');
		expect(result[1].departure_at).toBe('12:50 م');
	});
});