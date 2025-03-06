import trainSimulatedDataToCSV from "../../src/utilities/trainSimulatedDataToCSV"

const mockData = [
	{
		trainNumber: '1109',
		trainType: 'AC Russian',
		status: 'Arrived',
		previousStation: null,
		currentStation: 'Alexandria',
		nextStation: null,
		previousStationsEnRoute: [],
		nextStationsEnRoute: [],
		fullRoute: [
			'Faiyum',     'Wasta',
			'Ayat',       'Giza',
			'Cairo',      'Banha',
			'Quesna',     'Berket Saba',
			'Tanta',      'Itay Barud',
			'Damanhour',  'Sidi Gaber',
			'Alexandria'
		],
		arrival_at: '12:10 pm',
		departure_at: '05:50 am'
	},
	{
		trainNumber: '1111',
		trainType: 'Russian',
		status: 'Arrived',
		previousStation: null,
		currentStation: 'Cairo',
		nextStation: null,
		previousStationsEnRoute: [],
		nextStationsEnRoute: [],
		fullRoute: [ 'Faiyum', 'Wasta', 'Ayat', 'Giza', 'Cairo' ],
		arrival_at: '03:15 pm',
		departure_at: '12:50 pm'
	},
	{
		trainNumber: '135',
		trainType: 'Improved',
		status: 'Arrived',
		previousStation: null,
		currentStation: 'Giza',
		nextStation: null,
		previousStationsEnRoute: [],
		nextStationsEnRoute: [],
		fullRoute: [ 'Wasta', 'Ayat', 'Badrshein', 'Hawamdeyya', 'Giza' ],
		arrival_at: '05:55 am',
		departure_at: '04:35 am'
	},
	{
		trainNumber: '81',
		trainType: 'AC Russian',
		status: 'In Transit',
		previousStation: 'Farshut',
		currentStation: 'En route',
		nextStation: 'Abo Tesht',
		previousStationsEnRoute: [
			'Aswan',     'Ballana',
			'Daraw',     'Kom Ombo',
			'Kalabsha',  'Silwa Bahari',
			'Ramadi',    'Radisia',
			'Edfu',      'Mahamid',
			'Sibaiyyah', 'Sharawnah',
			'Esna',      'Armant',
			'Luxor',     'Qus',
			'Qift',      'Qena',
			'Dishna',    'Nagaa Hammadi',
			'Farshut'
		],
		nextStationsEnRoute: [
			'Abo Tesht',  'Abo Shousha', 'Balyana',
			'Bardis',     'Girga',       'Usayrat',
			'Monshaa',    'Sohag',       'Maragha',
			'Tahta',      'Tima',        'Sidfa',
			'Abo Tij',    'Asyut',       'Manqabad',
			'Manfalut',   'Qusiyyah',    'Dayrout',
			'Dayr Mawas', 'Mallawi',     'Rawda',
			'Abo Qurqas', 'Minya',       'Samalut',
			'Matay',      'Beni Mazar',  'Maghagha',
			'Fashn',      'Biba',        'Beni Suef',
			'Nasser',     'Wasta',       'Ayat',
			'Badrshein',  'Hawamdeyya',  'Giza',
			'Cairo'
		],
		fullRoute: [
			'Aswan',    'Ballana',      'Daraw',       'Kom Ombo',
			'Kalabsha', 'Silwa Bahari', 'Ramadi',      'Radisia',
			'Edfu',     'Mahamid',      'Sibaiyyah',   'Sharawnah',
			'Esna',     'Armant',       'Luxor',       'Qus',
			'Qift',     'Qena',         'Dishna',      'Nagaa Hammadi',
			'Farshut',  'Abo Tesht',    'Abo Shousha', 'Balyana',
			'Bardis',   'Girga',        'Usayrat',     'Monshaa',
			'Sohag',    'Maragha',      'Tahta',       'Tima',
			'Sidfa',    'Abo Tij',      'Asyut',       'Manqabad',
			'Manfalut', 'Qusiyyah',     'Dayrout',     'Dayr Mawas',
			'Mallawi',  'Rawda',        'Abo Qurqas',  'Minya',
			'Samalut',  'Matay',        'Beni Mazar',  'Maghagha',
			'Fashn',    'Biba',         'Beni Suef',   'Nasser',
			'Wasta',    'Ayat',         'Badrshein',   'Hawamdeyya',
			'Giza',     'Cairo'
		],
		arrival_at: '10:20 pm',
		departure_at: '04:30 am'
	}
];

describe('trainSimulatedDataToCSV', () => {
	it('Should return a correct formated CSV as string', () => {
		const result = trainSimulatedDataToCSV(mockData);
		console.log(result);
		// expect(result).toEqual()
	})
})