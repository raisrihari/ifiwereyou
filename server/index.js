// server/index.js - FINAL PRODUCTION VERSION

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());

// 2. Body Parser for JSON
app.use(express.json({ extended: false }));


// --- API Routes ---
// This is now the ONLY thing the server does besides connect to the DB.
app.use('/api/users', require('./routes/users'));
app.use('/api/dilemmas', require('./routes/dilemmas'));
app.use('/api/perspectives', require('./routes/perspectives'));

// --- DELETE THE "Serve static assets in production" BLOCK ---
// We no longer need this part because Netlify is our front-end.


// Define the Port and Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));