-- trains table
CREATE TABLE trains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_number TEXT NOT NULL,
    train_type TEXT NOT NULL,
    departure_station TEXT NOT NULL,
    arrival_station TEXT NOT NULL
);

-- stations table
CREATE TABLE stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    station_name TEXT NOT NULL UNIQUE
);

-- schedules table
CREATE TABLE schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_id INTEGER NOT NULL,
    station_id INTEGER NOT NULL,
    arrival_time TEXT,
    departure_time TEXT,
    stop_order INTEGER NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains (id),
    FOREIGN KEY (station_id) REFERENCES stations (id)
);
