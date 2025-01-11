// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./config/db');
const bodyParser = require('body-parser');
// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});
app.get('/photos',(req,res)=>{res.sendFile(__dirname+'/views/photos.html')});
app.get('/stories',(req,res)=>{res.sendFile(__dirname+'/views/stories.html')});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
app.post('/api/stories', async (req, res) => {
    try {
        const { title, content } = req.body;
        const result = await db.query(
            'INSERT INTO stories (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/stories', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM stories ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/stories/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM stories WHERE id = $1', [req.params.id]);
        res.json({ message: 'Story deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/test-db', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ 
            message: 'Database connected successfully!',
            timestamp: result.rows[0].now
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'Database connection failed',
            details: err.message
        });
    }
});