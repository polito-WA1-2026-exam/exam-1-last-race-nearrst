import express  from "express";
import passport from "passport";

const router = express.Router();

// POST /api/sessions — Login
router.post('/sessions', (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password || typeof username !== 'string' || typeof password !== 'string')
        return res.status(400).json({ error: 'Username and password are required.' });

    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).json({ error: info?.message || 'Invalid credentials.' });

        // log the user in
        // sets up the session
        req.login(user, err => {
            if (err)
                return next(err);
            return res.status(201).json({ id: user.id, username: user.username });
        });
    })(req, res, next);
});

// DELETE /api/sessions/current — Logout
router.delete('/sessions/current', (req, res, next) => {
    req.logout(err => {
        if (err)
            return next(err);
        res.json({ message: 'Logged out successfully.' });
    });
});

// GET /api/sessions/current — Who am I?
router.get('/sessions/current', (req, res) => {
    if (req.isAuthenticated())
        return res.json({ id: req.user.id, username: req.user.username });
    return res.status(401).json({ error: 'Not authenticated.' });
});

export default router;