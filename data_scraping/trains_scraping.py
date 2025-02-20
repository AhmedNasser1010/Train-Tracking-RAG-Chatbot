import aiohttp
import asyncio
import csv

# Function to fetch train data asynchronously
async def fetch_train_data(session, train_number):
	url = f'https://egytrains.com/_next/data/5OCtobRGdzcWEf5ZH7ieN/train/{train_number}.json'
	try:
		async with session.get(url) as response:
			print(f"Fetching train number {train_number} Data.")
			if response.status == 200:
				data = await response.json()
				print("Done")
				return train_number, data
			else:
				print(f"Failed to fetch data for train {train_number}: HTTP {response.status}")
				return train_number, None
	except Exception as e:
		print(f"Error fetching data for train {train_number}: {e}")
		return train_number, None

# Function to extract relevant data from JSON
def extract_train_info(data):
	page_props = data.get('pageProps', {})
	data_info = page_props.get('data', {})
	train_number = data_info.get('name', '')
	train_type = data_info.get('type', '')
	cities = data_info.get('cities', [])

	stops = len(cities)
	start_station_name = cities[0]['name'] if cities else ''
	end_station_name = cities[-1]['name'] if cities else ''

	return train_number, train_type, stops, start_station_name, end_station_name

# Load stations data
def load_stations():
	stations = {}
	with open('stations.csv', 'r', encoding='utf-8') as f:
		reader = csv.DictReader(f)
		for row in reader:
			en_name = row['en_name'].strip()
			stations[en_name] = int(row['id'])
	return stations

# Load type data
def load_type_mapping():
	type_mapping = {}
	with open('types.csv', 'r', encoding='utf-8') as f:
		reader = csv.DictReader(f)
		for row in reader:
			type_id = int(row['id'])
			type_name = row['type_name'].strip()
			type_mapping[type_name] = type_id
	return type_mapping

# Read unique train numbers from schedule_output.csv
def read_train_numbers():
	train_numbers = set()
	with open('schedule_output.csv', 'r', encoding='utf-8') as f:
		reader = csv.DictReader(f)
		for row in reader:
			train_numbers.add(row['train_number'])
	return sorted(list(train_numbers), key=lambda x: x)

# Main function to process all trains asynchronously
async def main():
	# Load data
	stations = load_stations()
	type_mapping = load_type_mapping()
	train_numbers = read_train_numbers()

	# Fetch data for all trains concurrently
	async with aiohttp.ClientSession() as session:
		tasks = [fetch_train_data(session, train_number) for train_number in train_numbers]
		results = await asyncio.gather(*tasks)

	# Generate CSV
	with open('trains_output.csv', 'w', newline='', encoding='utf-8') as csvfile:
		fieldnames = [
			'id', 
			'train_number', 
			'train_type_id', 
			'stops', 
			'start_station_id', 
			'end_station_id'
		]
		writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
		writer.writeheader()

		# Process results
		for idx, (train_number, data) in enumerate(results, start=1):
			if data:
				train_number, train_type, stops, start_station_name, end_station_name = extract_train_info(data)

				# Get station IDs
				start_station_id = stations.get(start_station_name, '')
				end_station_id = stations.get(end_station_name, '')

				# Get train_type_id
				train_type_id = type_mapping.get(train_type, '')

				# Write row to CSV
				writer.writerow({
					'id': idx,
					'train_number': train_number,
					'train_type_id': train_type_id,
					'stops': stops,
					'start_station_id': start_station_id,
					'end_station_id': end_station_id
				})

	print("CSV file generated successfully!")

# Run the script
if __name__ == '__main__':
	asyncio.run(main())