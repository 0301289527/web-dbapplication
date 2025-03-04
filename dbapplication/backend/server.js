const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Connect to the database (create it if it does not exist)
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create Database Tables
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
)`);

// Create a user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [name, email], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, email });
    });
});

// Get all users (Read)
app.get('/users', (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Delete a user（Delete）
app.delete('/users/:id', (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, req.params.id, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'User deleted', changes: this.changes });
    });
});
const path = require('path');

// Let Express serve static files in the backend directory
app.use(express.static(path.join(__dirname)));

console.log(`Test page available at http://localhost:${port}/test.html`);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
