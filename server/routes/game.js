import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getAdjacencyList, getAllStations, createGame, getGameById, updateGame, getGameSegments } from "../dao.js";
import { getValidDestinations } from "../utils/bfs.js";
import { validateRoute } from "../utils/validateRoute.js";
import { executeRoute } from "../utils/executeRoute.js";

const router = express.Router();

// POST /api/games
// starts a new game for the logged-in user
// randomly assigns a start station and a destination station
router.post('/games', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;

        // 1. fetch all stations and the adjacency list from DB
        const [stations, adjacencyRows] = await Promise.all([
            getAllStations(),
            getAdjacencyList(),
        ]);

        // 2. keep trying random start stations until we find one that has at least one valid destination >= 3 stops away
        let startStation    = null;
        let validDests      = [];
        let attempts        = 0;
        const maxAttempts   = 20;

        while (validDests.length === 0 && attempts < maxAttempts) {
            const randomIndex = Math.floor(Math.random() * stations.length);
            startStation = stations[randomIndex];
            validDests = getValidDestinations(adjacencyRows, startStation.id, 3);
            attempts++;
        }

        if (validDests.length === 0) {
            // Should never happen with a well-connected network, but handle it gracefully
            return res.status(500).json({ error: 'Could not find a valid game configuration.' });
        }

        // 3. pick a random destination from the valid candidates
        const randomDest = validDests[Math.floor(Math.random() * validDests.length)];
        const destStation = stations.find(s => s.id === randomDest.stationId);

        // 4. create the game record in the DB
        const gameId = await createGame(userId, startStation.id, destStation.id);

        // 5. return the game info to the client
        res.status(201).json({
            gameId,
            startStation: { id: startStation.id, name: startStation.name },
            destStation: { id: destStation.id,  name: destStation.name },
        });

    } catch (err) {
        next(err);
    }
});

// GET /api/games/:id
// returns the current state of a game
router.get('/games/:id', requireAuth, async (req, res, next) => {
    try {
        const gameId = parseInt(req.params.id);

        // validate that id is a real integer
        if (isNaN(gameId)) {
            return res.status(400).json({ error: 'Invalid game ID.' });
        }

        const game = await getGameById(gameId);

        if (!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }

        // security: users can only see their own games
        if (game.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden.' });
        }

        res.json({
            id: game.id,
            status: game.status,
            score: game.score,
            startStation: { id: game.start_id, name: game.start_name },
            destStation: { id: game.dest_id,  name: game.dest_name },
        });

    } catch (err) {
        next(err);
    }
});

// POST /api/games/:id/route
// submits the player's planned route for validation and execution
router.post('/games/:id/route', requireAuth, async (req, res, next) => {
    try {
        const gameId = parseInt(req.params.id);

        if (isNaN(gameId)) {
            return res.status(400).json({ error: 'Invalid game ID.' });
        }

        // fetch and verify the game
        const game = await getGameById(gameId);

        if (!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }

        if (game.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden.' });
        }

        // prevent submitting a route twice
        if (game.status !== 'planning') {
            return res.status(409).json({ error: 'Route already submitted for this game.' });
        }

        // validate input
        const { route } = req.body;

        if (!Array.isArray(route) || route.length < 2) {
            return res.status(400).json({ error: 'Route must be an array of at least 2 station IDs.' });
        }

        // ensure all route entries are integers
        const parsedRoute = route.map(id => parseInt(id));
            if (parsedRoute.some(isNaN)) {
                return res.status(400).json({ error: 'All route entries must be valid station IDs.' });
            }

        // validate the route against game rules
        const validation = await validateRoute(
            parsedRoute,
            game.start_id,
            game.dest_id
        );

        if (!validation.valid) {
            // invalid route: player loses all coins, score is 0
            await updateGame(gameId, 'failed', 0);
            return res.status(422).json({
                valid: false,
                reason: validation.reason,
                score: 0,
            });
        }

        // execute the route and apply events
        const { steps, finalScore } = await executeRoute(gameId, parsedRoute);

        return res.json({
            valid: true,
            steps,
            finalScore,
        });
    
    } catch (err) {
        next(err);
    }
});

// GET /api/games/:id/segments
// returns the execution steps for a completed game
router.get('/games/:id/segments', requireAuth, async (req, res, next) => {
    try {
        const gameId = parseInt(req.params.id);

        if (isNaN(gameId)) {
            return res.status(400).json({ error: 'Invalid game ID.' });
        }

        const game = await getGameById(gameId);

        if (!game) {
            return res.status(404).json({ error: 'Game not found.' });
        }

        if (game.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden.' });
        }

        if (game.status !== 'completed') {
            return res.status(409).json({ error: 'Game has not been executed yet.' });
        }

        const segments = await getGameSegments(gameId);
        res.json({ segments });

    } catch (err) {
        next(err);
    }
});

export default router;