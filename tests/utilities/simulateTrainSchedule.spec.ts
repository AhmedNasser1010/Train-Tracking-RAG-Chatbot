import simulateTrainSchedule from '../../src/utilities/simulateTrainSchedule';
import { TrainScheduleViewEntry } from "../../src/types/TrainScheduleViewEntry";

describe('simulateTrainSchedule', () => {
	const mockTrains: TrainScheduleViewEntry[] = [
		{
			train_number: '1111',
			train_type: 'Russian',
			stop_points: ['Faiyum', 'Wasta', 'Ayat', 'Giza', 'Cairo'],
			arrival_time: ['12:50 pm', '01:39 pm', '02:05 pm', '02:49 pm', '03:15 pm'],
		}
	];

	it('should return "Not Started" status for trains before their first arrival time', () => {
		const currentTimeStr = '2/26/2025, 11:00:00 AM';
		const result = simulateTrainSchedule(currentTimeStr, mockTrains);

		expect(result).toEqual(
	    expect.arrayContaining([
	      expect.objectContaining({
	        status: 'Not Started',
	        currentStation: 'Faiyum',
	        previousStation: null,
	        nextStation: 'Wasta'
	      })
	    ])
	  );
	});

	it('should return "Arrived" status for trains after their last arrival time', () => {
	  const currentTimeStr = '2/26/2025, 04:00:00 PM';
	  const result = simulateTrainSchedule(currentTimeStr, mockTrains);

		expect(result).toEqual(
	    expect.arrayContaining([
	      expect.objectContaining({
	        status: 'Arrived',
	        currentStation: 'Cairo',
	        previousStation: null,
	        nextStation: null
	      })
	    ])
	  );
	});

	it('should return "In Transit" status for trains between stations', () => {
	  const currentTimeStr = '2/26/2025, 02:30:00 PM';
	  const result = simulateTrainSchedule(currentTimeStr, mockTrains);

	  expect(result).toEqual(
	    expect.arrayContaining([
	      expect.objectContaining({
	        status: 'In Transit',
	        currentStation: 'En route',
	        previousStation: 'Ayat',
	        nextStation: 'Giza'
	      })
	    ])
	  );
	});

	it('should return "In Transit" status for trains at a station', () => {
	  const currentTimeStr = '2/26/2025, 02:05:00 PM';
	  const result = simulateTrainSchedule(currentTimeStr, mockTrains);

	  expect(result).toEqual(
	    expect.arrayContaining([
	      expect.objectContaining({
	        status: 'In Transit',
	        currentStation: 'Ayat',
	        previousStation: 'Wasta',
	        nextStation: 'Giza'
	      })
	    ])
	  );
	});
});