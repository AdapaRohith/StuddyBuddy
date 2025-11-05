const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for HTML pages
app.get('/html/:page', (req, res) => {
    const pageName = req.params.page;
    res.sendFile(path.join(__dirname, 'html', pageName));
});

// API endpoint for testing
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'StudyBuddy API is working!', 
        timestamp: new Date().toISOString() 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`StudyBuddy server is running on http://localhost:${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
});

module.exports = app;