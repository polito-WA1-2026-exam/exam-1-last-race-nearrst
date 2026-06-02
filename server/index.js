// imports
import express from "express";
import cors from "cors";
import './db.js';

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

// health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});