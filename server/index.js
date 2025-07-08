// server/index.js - RESTORED FULL VERSION

const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON bodies. We know this works now!
app.use(express.json({ extended: false }));

const PORT = 5000;

// Define our routes
app.use('/api/users', require('./routes/users'));
app.use('/api/dilemmas', require('./routes/dilemmas'));
app.use('/api/perspectives', require('./routes/perspectives'));
// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));