import sqlite3 from 'sqlite3';
import crypto from 'node:crypto';
import fs from 'node:fs';

const db = new sqlite3.Database('./valdermoor.db');

// Helper: run a SQL string and return a promise
function run(sql) {
    return new Promise((resolve, reject) => {
        db.exec(sql, err => err ? reject(err) : resolve());
    });
}

// Helper: run a single INSERT with params
function insert(sql, params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, err => err ? reject(err) : resolve());
    });
}

// Hash password using crypto
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return { hash, salt };
}

async function init() {
    const schema = fs.readFileSync('./schema.sql', 'utf8');
    const seed = fs.readFileSync('./seed.sql',   'utf8');

    await run(schema);
    console.log('Schema created.');

    await run(seed);
    console.log('Seed data inserted.');

    const users = [
        { username: 'aragorn', password: 'sword123' },
        { username: 'gandalf', password: 'youshall' },
        { username: 'frodo',   password: 'shire999' },
    ];

    for (const user of users) {
        const { hash, salt } = hashPassword(user.password);
        await insert(
            'INSERT INTO users (username, password, salt) VALUES (?, ?, ?)',
            [user.username, hash, salt]
        );
    }

    console.log('Users created: aragorn / gandalf / frodo');

    // seed completed games for aragorn and gandalf

    await insert(`
        INSERT INTO games (user_id, start_station, dest_station, status, score)
        VALUES (?, ?, ?, 'completed', ?)`,
        [1, 1, 14, 47]
    );
    await insert(`
        INSERT INTO games (user_id, start_station, dest_station, status, score)
        VALUES (?, ?, ?, 'completed', ?)`,
        [1, 6, 4, 23]
    );

    await insert(`
        INSERT INTO games (user_id, start_station, dest_station, status, score)
        VALUES (?, ?, ?, 'completed', ?)`,
        [2, 3, 8, 31]
    );
    await insert(`
        INSERT INTO games (user_id, start_station, dest_station, status, score)
        VALUES (?, ?, ?, 'completed', ?)`,
        [2, 7, 1, 18]
    );

    console.log('Seeded game history for aragorn and gandalf.');
    db.close();
}

init().catch(err => {
    console.error('Init failed:', err);
    db.close();
});