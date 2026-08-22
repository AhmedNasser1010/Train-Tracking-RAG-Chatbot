import { TrainScheduleViewEntry } from "../types/TrainScheduleViewEntry";
import translatedStationsNames from "../../translatedStationsNames.json";

const stationNames = translatedStationsNames as Record<string, string>;

const trainTypesAr: Record<string, string> = {
	'Russian': 'روسي',
	'Improved': 'محسن',
	'AC': 'مكيفه',
	'AC Russian': 'روسي مكيف',
	'Sleep': 'نوم',
	'Talgo': 'تالجو',
};

function toArabicStation(station: string | null): string | null {
	if (!station) return null;
	return stationNames[station] ?? station;
}

type TrainStatus = {
	trainNumber: string;
	trainType: string;
	status: string;
	previousStation: string | null;
	currentStation: string | null;
	nextStation: string | null;
	fullRoute: string[];
	arrival_at: string;
	departure_at: string;
};

function parseTime(timeStr: string): number {
	const [time, modifier] = timeStr.split(' ');
	let [hours, minutes] = time.split(':').map(Number);
	if (modifier.toLowerCase() === 'pm' && hours !== 12) {
		hours += 12;
	}
	if (modifier.toLowerCase() === 'am' && hours === 12) {
		hours = 0;
	}
	return hours * 60 + minutes;
}

function formatTimeAr(timeStr: string): string {
	const [time, modifier] = timeStr.split(' ');
	let [hours, minutes] = time.split(':').map(Number);
	const suffix = modifier.toLowerCase() === 'pm' ? 'م' : 'ص';
	if (suffix === 'ص' && hours === 12) {
		hours = 0;
	}
	return `${hours}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export default function simulateTrainSchedule(currentTimeStr: string, trains: TrainScheduleViewEntry[]): TrainStatus[] {
	const currentTime = new Date(currentTimeStr);
	const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

	return trains.map(train => {
		const arrivalMinutes = train.arrival_time.map(parseTime);
		const stops = train.stop_points;
		let status = '';
		let previousStation: string | null = null;
		let currentStation: string | null = null;
		let nextStation: string | null = null;

		const arrival_at = train.arrival_time[train.arrival_time.length - 1];
		const departure_at = train.arrival_time[0];

		if (currentMinutes < arrivalMinutes[0]) {
			status = 'لم تنطلق بعد';
			currentStation = stops[0];
			nextStation = stops[1] || null;
		} else if (currentMinutes >= arrivalMinutes[arrivalMinutes.length - 1]) {
			status = 'وصل';
			previousStation = null;
			currentStation = stops[stops.length - 1];
		} else {
			let index = 0;
			for (; index < arrivalMinutes.length - 1; index++) {
				if (currentMinutes < arrivalMinutes[index + 1]) {
					break;
				}
			}

			status = 'في الطريق';
			nextStation = stops[index + 1] || null;

			const dwellEndTime = Math.min(arrivalMinutes[index] + 5, arrivalMinutes[index + 1]);
			if (currentMinutes <= dwellEndTime) {
				previousStation = stops[index-1];
				currentStation = stops[index];
			} else {
				previousStation = stops[index];
				currentStation = 'En route';
			}
		}

		previousStation = toArabicStation(previousStation);
		currentStation = currentStation === 'En route' ? 'في الطريق' : toArabicStation(currentStation);
		nextStation = toArabicStation(nextStation);

		const fullRoute: string[] = stops.map((station: string, index) => {
			const name = stationNames[station] ?? station;
			return `${name}: ${formatTimeAr(train.arrival_time[index])}`;
		})

		return {
			trainNumber: train.train_number,
			trainType: trainTypesAr[train.train_type] ?? train.train_type,
			status,
			previousStation,
			currentStation,
			nextStation,
			fullRoute,
			arrival_at,
			departure_at,
		};
	})
		.sort((a, b) => parseTime(a.departure_at) - parseTime(b.departure_at))
		.map(train => ({
			...train,
			arrival_at: formatTimeAr(train.arrival_at),
			departure_at: formatTimeAr(train.departure_at),
		}));
}