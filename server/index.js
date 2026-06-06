// imports
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./db.js";
import "./passport-config.js";
import authRouter from "./routes/auth.js";
import networkRouter from "./routes/network.js";
import gameRouter from "./routes/game.js";
import leaderboardRouter from "./routes/leaderboard.js";

// init express
const app = new express();
const port = 3001;

// parse incoming JSON request bodies
app.use(express.json());

// allow requests from React dev server
// allow cookies to be sent
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// session middleware
app.use(session({
  secret: 'valdermoor-secret-key', // in a real app this goes in .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// ROUTES

// health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', user: req.user || null });
});

// auth routes
app.use('/api', authRouter);

// network routes
app.use('/api', networkRouter);

// game routes
app.use('/api', gameRouter);

// leaderboard routes
app.use('/api', leaderboardRouter);

// GLOBAL ERROR HANDLER

// catches any error passed via next(err) in route handlers
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal sever error!'
  });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});