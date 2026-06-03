import sqlite3 from 'sqlite3';
import { promisify } from 'node:util';

const db = new sqlite3.Database('./valdermoor.db', err => {
    if (err)
        console.error('Failed to connect to database:', err);
    else {
        console.log('Connected to Valdermoor database.');
        db.run('PRAGMA foreign_keys = ON');
    }
});

// Promisified helpers so all queries use async/await
db.runAsync  = promisify(db.run.bind(db));
db.getAsync  = promisify(db.get.bind(db));
db.allAsync  = promisify(db.all.bind(db));

export default db;