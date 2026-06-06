import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getLeaderboard } from "../dao.js";

const router = express.Router();

// GET /api/leaderboard
// returns the best score per user across all completed games, ordered by best score descending
// protected: only logged-in users can see the leaderboard

router.get('/leaderboard', requireAuth, async (req, res, next) => {
    try {
        const rows = await getLeaderboard();

        const leaderboard = rows.map((row, index) => ({
            rank: index + 1,
            username: row.username,
            bestScore: row.best_score,
            gamesPlayed: row.games_played,
        }));

        res.json({ leaderboard });

    } catch (err) {
        next(err);
    }
});

export default router;