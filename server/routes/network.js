import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getFullNetwork, getAllStations, getAllSegments } from "../dao.js";

const router = express.Router();

// GET /api/network
// returns the full network
// used in the Setup phase
// protected: only logged-in users can play

router.get('/network', requireAuth, async (req, res, next) => {
    try {
        const rows = await getFullNetwork();
        
        const linesMap = {};
        
        for (const row of rows) {
            if (!linesMap[row.line_id]) {
                linesMap[row.line_id] = {
                    id: row.line_id,
                    name: row.line_name,
                    color: row.color,
                    stations: []
                };
            }
            linesMap[row.line_id].stations.push({
                id: row.station_id,
                name: row.station_name,
                position: row.position,
            });
        }
        
        res.json({ lines: Object.values(linesMap) });
    
    } catch (err) {
        next(err);
    }
});

// ─── GET /api/network/stations ───────────────────────────────────
// returns station id + name ONLY
// Used in the Planning phase map
// player sees stations but not which line connects them.

router.get('/network/stations', requireAuth, async (req, res, next) => {
    try {
        const stations = await getAllStations();
        res.json({ stations });
    } catch (err) {
        next(err);
    }
});

// ─── GET /api/network/segments ───────────────────────────────────
// returns all adjacent station pairs
// used in the Planning phase segment list and selects them to build a route.

router.get('/network/segments', requireAuth, async (req, res, next) => {
    try {
        const segments = await getAllSegments();
        res.json({ segments });
    } catch (err) {
        next(err);
    }
});

export default router;