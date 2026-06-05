import db from './db.js';

// NETWORK

// returns all lines with their ordered stations
export function getFullNetwork() {
    return db.allAsync(`
        SELECT
            l.id AS line_id,
            l.name AS line_name,
            l.color,
            s.id AS station_id,
            s.name AS station_name,
            ls.position
        FROM line_stations ls
        JOIN lines l ON l.id = ls.line_id
        JOIN stations s ON s.id = ls.station_id
        ORDER BY l.id, ls.position
    `);
}

// returns all stations (id + name only, no line info)
export function getAllStations() {
    return db.allAsync(`
        SELECT id, name
        FROM stations
        ORDER BY name
    `);
}

// returns all adjacent station pairs (segments)
export function getAllSegments() {
    return db.allAsync(`
        SELECT
            s1.id AS from_id,
            s1.name AS from_name,
            s2.id AS to_id,
            s2.name AS to_name
        FROM line_stations ls1
        JOIN line_stations ls2 ON ls1.line_id = ls2.line_id AND ls2.position = ls1.position + 1
        JOIN stations s1 ON s1.id = ls1.station_id
        JOIN stations s2 ON s2.id = ls2.station_id
        ORDER BY s1.name
    `);
}

// EVENTS

// returns all events
export function getAllEvents() {
    return db.allAsync(`
        SELECT id, description, effect
        FROM events
    `);
}

// USERS

// find a user by username
export function getUserByUsername(username) {
    return db.getAsync(`
        SELECT id, username, password, salt
        FROM users
        WHERE username = ?`,
        [username]
    );
}

// Find a user by ID
export function getUserById(id) {
    return db.getAsync(`
        SELECT id, username
        FROM users
        WHERE id = ?`,
        [id]
    );
}

// GAMES

// create a new game
export function createGame(userId, startStationId, destStationId) {
    return new Promise((resolve, reject) => {
        db.run(`
            INSERT INTO games (user_id, start_station, dest_station, status)
            VALUES(?, ?, ?, 'planning')`,
            [userId, startStationId, destStationId],
            function(err) {
                if(err)
                    reject(err);
                else
                    resolve(this.lastID);
            }
        );
    });
}

// get a single game by ID
export function getGameById(gameId) {
    return db.getAsync(`
        SELECT
            g.id,
            g.user_id,
            g.status,
            g.score,
            g.created_at,
            s1.id AS start_id,
            s1.name AS start_name,
            s2.id AS dest_id,
            s2.name AS dest_name
        FROM games g
        JOIN stations s1 ON s1.id = g.start_station
        JOIN stations s2 ON s2.id = g.dest_station
        WHERE g.id = ?`,
        [gameId]
    );
}

// update a game's status and score at end of execution
export function updateGame(gameId, status, score) {
    return db.runAsync(`
        UPDATE games
        SET status = ?, score = ? WHERE id = ?`,
        [status, score, gameId]
    );
}

// insert one executed segment into game_segments
export function insertGameSegment(gameId, fromStation, toStation, eventId, coinsAfter, stepOrder) {
    return db.runAsync(`
        INSERT INTO game_segments(game_id, from_station, to_station, event_id, coins_after, step_order)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [gameId, fromStation, toStation, eventId, coinsAfter, stepOrder]
    );
}

// get all segments for a game, in order
export function getGameSegments(gameId) {
    return db.allAsync(`
        SELECT
            gs.step_order,
            s1.name AS from_name,
            s2.name AS to_name,
            e.description AS event_description,
            e.effect,
            gs.coins_after
        FROM game_segments gs
        JOIN stations s1 ON s1.id = gs.from_station
        JOIN stations s2 ON s2.id = gs.to_station
        JOIN events   e  ON e.id  = gs.event_id
        WHERE gs.game_id = ?
        ORDER BY gs.step_order`,
        [gameId]
    );
}

// returns the full adjacency list of the network
// used by the BFS algorithm to traverse the network graph
export function getAdjacencyList() {
    return db.allAsync(`
        SELECT
            ls1.station_id AS station_id,
            ls2.station_id AS neighbour_id
        FROM line_stations ls1
        JOIN line_stations ls2
        ON  ls1.line_id  = ls2.line_id
        AND ABS(ls1.position - ls2.position) = 1
  `);
}

// LEADERBOARD

// best score per user, for completed games only
export function getLeaderboard() {
    return db.allAsync(`
        SELECT
            u.username,
            MAX(g.score) AS best_score,
            COUNT(g.id) AS games_played
        FROM games g
        JOIN users u ON u.id = g.user_id
        WHERE g.status = 'completed'
        GROUP BY g.user_id
        ORDER BY best_score DESC
    `);
}