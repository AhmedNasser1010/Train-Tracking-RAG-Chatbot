# """Last process performance 8.60 sec"""
# import csv
# import os
# import aiohttp
# import asyncio
# import time
# from datetime import datetime

# BASE_URL = "https://egytrains.com/_next/data/5OCtobRGdzcWEf5ZH7ieN/trains/"
# STATIONS_FILE_PATH = os.path.join(os.getcwd(), "stations.csv")
# TRAINS_FILE_PATH = os.path.join(os.getcwd(), "trains_output.csv")
# OUTPUT_FILE_PATH = os.path.join(os.getcwd(), "schedule_output.csv")

# async def load_stations_map():
# 	"""Load station mappings from the CSV file."""
# 	print("Loading station mappings from CSV...")
# 	station_map = {}
	
# 	try:
# 		with open(STATIONS_FILE_PATH, mode='r', encoding='utf-8') as f:
# 			reader = csv.DictReader(f)
# 			for row in reader:
# 				en_name = row.get('en_name', '').strip()
# 				station_id = row.get('id')
# 				if en_name and en_name not in station_map:
# 					station_map[en_name] = station_id
# 		print(f"Loaded {len(station_map)} station mappings (English names only).")
# 		return station_map
# 	except Exception as e:
# 		print(f"Error loading station mappings: {e}")
# 		raise

# async def load_trains_map():
# 	"""Load train mappings from the CSV file."""
# 	print("Loading train mappings from CSV...")
# 	trains_map = {}
	
# 	try:
# 		with open(TRAINS_FILE_PATH, mode='r', encoding='utf-8') as f:
# 			reader = csv.DictReader(f)
# 			for row in reader:
# 				train_number = row.get('train_number', '').strip()
# 				train_id = row.get('id')
# 				if train_number and train_id and train_number not in trains_map:
# 					trains_map[train_number] = train_id
# 		print(f"Loaded {len(trains_map)} train mappings.")
# 		return trains_map
# 	except Exception as e:
# 		print(f"Error loading train mappings: {e}")
# 		raise

# async def fetch_station_data(session, station_name):
# 	"""Fetch JSON data for a station."""
# 	url = f"{BASE_URL}{station_name}.json"
# 	print(f"Fetching data for station: {station_name} ({url})")
	
# 	try:
# 		async with session.get(url) as response:
# 			response.raise_for_status()
# 			print(f"Successfully fetched data for station: {station_name}")
# 			return await response.json()
# 	except aiohttp.ClientError as e:
# 		print(f"Failed to fetch data for station: {station_name}. Error: {e}")
# 		return None

# async def generate_all_stations_csv():
# 	"""Generate CSV from all stations."""
# 	print("Starting CSV generation process...")
# 	start_time = time.time()
	
# 	try:
# 		stations_map = await load_stations_map()
# 		trains_map = await load_trains_map()
# 		station_names = list(stations_map.keys())
# 		output = [
# 			["id", "train_id", "stop_order", "station_id", "arrival_time", "departure_time"]
# 		]
# 		row_id = 1  # Initialize ID counter
		
# 		async with aiohttp.ClientSession() as session:
# 			tasks = []
			
# 			# Create tasks for each station fetch
# 			for i, station_name in enumerate(station_names):
# 				tasks.append(fetch_station_data(session, station_name))

# 			# Wait for all tasks to complete
# 			station_data_responses = await asyncio.gather(*tasks)
			
# 			# Process the data
# 			for i, station_data in enumerate(station_data_responses):
# 				station_name = station_names[i]
# 				if station_data:
# 					print(f"Parsing train data for station: {station_name}")
# 					trains = station_data.get("pageProps", {}).get("data", {}).get("trains", {})

# 					for train_number, train_details in trains.items():
# 						train_id = trains_map.get(train_number)
# 						if not train_id:
# 							print(f"Skipping train {train_number} as it's not found in trains.csv")
# 							continue
						
# 						for index, city in enumerate(train_details.get("cities", [])):
# 							station_id = stations_map.get(city.get("name"))
# 							arrival_time = city.get("a", "")
# 							departure_time = city.get("d", "")
							
# 							output.append([
# 								row_id,
# 								train_id,
# 								index + 1,
# 								station_id,
# 								arrival_time,
# 								departure_time
# 							])
# 							row_id += 1
# 					print(f"Finished processing train data for station: {station_name}")
# 				else:
# 					print(f"Skipping station due to missing data: {station_name}")
		
# 		# Write output to CSV
# 		print("Writing data to output CSV file...")
# 		with open(OUTPUT_FILE_PATH, mode='w', newline='', encoding='utf-8') as f:
# 			writer = csv.writer(f)
# 			writer.writerows(output)
# 		print(f"CSV file created successfully at {OUTPUT_FILE_PATH}")
		
# 	except Exception as e:
# 		print(f"Script terminated: {e}")
# 		raise

# 	end_time = time.time()
# 	print(f"Process completed in {(end_time - start_time):.2f} seconds.")


# if __name__ == "__main__":
# 	asyncio.run(generate_all_stations_csv())




import csv
import os
import aiohttp
import asyncio
import time

# Base URL using the "train" endpoint
BASE_URL = "https://egytrains.com/_next/data/5OCtobRGdzcWEf5ZH7ieN/train/"

# File paths
TRAINS_FILE_PATH = os.path.join(os.getcwd(), "trains_output.csv")
STATIONS_FILE_PATH = os.path.join(os.getcwd(), "stations.csv")
OUTPUT_FILE_PATH = os.path.join(os.getcwd(), "schedule_output.csv")

async def load_trains_map():
    """Load train numbers and their IDs from trains_output.csv."""
    print("Loading train mappings from CSV...")
    trains_map = {}
    try:
        with open(TRAINS_FILE_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                train_number = row.get('train_number', '').strip()
                train_id = row.get('id')
                if train_number and train_id:
                    trains_map[train_number] = train_id
        print(f"Loaded {len(trains_map)} train mappings.")
        return trains_map
    except Exception as e:
        print(f"Error loading train mappings: {e}")
        raise

async def load_stations_map():
    """Load station mappings from stations.csv (mapping station name to station id)."""
    print("Loading station mappings from CSV...")
    station_map = {}
    try:
        with open(STATIONS_FILE_PATH, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                en_name = row.get('en_name', '').strip()
                station_id = row.get('id')
                if en_name and station_id:
                    station_map[en_name] = station_id
        print(f"Loaded {len(station_map)} station mappings.")
        return station_map
    except Exception as e:
        print(f"Error loading station mappings: {e}")
        raise

async def fetch_train_data(session, train_number):
    """Fetch JSON data for a given train number using the train endpoint."""
    url = f"{BASE_URL}{train_number}.json"
    print(f"Fetching data for train {train_number} from {url}")
    try:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.json()
    except aiohttp.ClientError as e:
        print(f"Error fetching train {train_number}: {e}")
        return None

async def generate_schedule_csv():
    """Generate a CSV file with train schedules using the train endpoint and station mapping."""
    print("Starting schedule CSV generation...")
    start_time = time.time()
    
    trains_map = await load_trains_map()
    stations_map = await load_stations_map()

    # CSV header now uses 'station_id' instead of city_name.
    output = [["id", "train_id", "stop_order", "station_id", "arrival_time", "departure_time"]]
    row_id = 1

    async with aiohttp.ClientSession() as session:
        tasks = []
        train_numbers = list(trains_map.keys())
        for train_number in train_numbers:
            tasks.append(fetch_train_data(session, train_number))
        
        train_data_responses = await asyncio.gather(*tasks)
        
        for i, train_data in enumerate(train_data_responses):
            train_number = train_numbers[i]
            train_id = trains_map[train_number]
            
            if train_data and "pageProps" in train_data and "data" in train_data["pageProps"]:
                data = train_data["pageProps"]["data"]
                cities = data.get("cities", [])
                
                # Use a set to track already seen station IDs for this train
                seen_station_ids = set()
                for index, city in enumerate(cities):
                    # Look up station id from the stations map using the city name.
                    name = city.get("name", "").strip()
                    station_id = stations_map.get(name)
                    if not station_id:
                        print(f"Station mapping not found for '{name}' in train {train_number}; skipping stop.")
                        continue
                    if station_id in seen_station_ids:
                        continue  # skip duplicate station_id entries
                    seen_station_ids.add(station_id)
                    
                    # Use arrival ('a') and departure ('d') times from JSON.
                    arrival = city.get("a", "")
                    departure = city.get("d", "")
                    
                    output.append([row_id, train_id, index + 1, station_id, arrival, departure])
                    row_id += 1
                print(f"Processed train {train_number} with {len(seen_station_ids)} unique stops.")
            else:
                print(f"Skipping train {train_number} due to missing data.")
    
    # Write output to CSV.
    with open(OUTPUT_FILE_PATH, mode='w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerows(output)
    
    end_time = time.time()
    print(f"Schedule CSV generated at {OUTPUT_FILE_PATH} in {end_time - start_time:.2f} seconds.")

if __name__ == "__main__":
    asyncio.run(generate_schedule_csv())
