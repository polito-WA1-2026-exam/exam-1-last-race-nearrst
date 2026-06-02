-- drop tables (safe re-run)
DROP TABLE IF EXISTS game_segments;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS line_stations;
DROP TABLE IF EXISTS stations;
DROP TABLE IF EXISTS lines;
DROP TABLE IF EXISTS users;

-- users who can log in and play
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    salt TEXT NOT NULL
);

-- metro lines
CREATE TABLE lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL -- hex color for the SVG map
);

-- individual stations
CREATE TABLE stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Which stations belong to which line, and in what order
-- position defines the sequence along the line (1, 2, 3...)
-- two stations are adjacent if their positions differ by exactly 1
CREATE TABLE line_stations (
    line_id INTEGER NOT NULL REFERENCES lines(id),
    station_id INTEGER NOT NULL REFERENCES stations(id),
    position INTEGER NOT NULL,
    PRIMARY KEY (line_id, station_id)
);

-- events
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    effect INTEGER NOT NULL -- integer from -4 to +4
);

-- one record per game played
CREATE TABLE games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    start_station INTEGER NOT NULL REFERENCES stations(id),
    dest_station INTEGER NOT NULL REFERENCES stations(id),
    score INTEGER, -- NULL until game completes
    status TEXT NOT NULL DEFAULT 'planning',
    -- status: 'planning' | 'executing' | 'completed' | 'failed'
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- One record per segment traveled during execution
CREATE TABLE game_segments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL REFERENCES games(id),
    from_station INTEGER NOT NULL REFERENCES stations(id),
    to_station INTEGER NOT NULL REFERENCES stations(id),
    event_id INTEGER NOT NULL REFERENCES events(id),
    coins_after INTEGER NOT NULL,
    step_order INTEGER NOT NULL -- 1, 2, 3... to preserve sequence
);