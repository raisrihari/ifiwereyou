// server/index.js

const express = require('express');
const path = require('path'); // Add this line
const connectDB = require('./config/db');
const cors = require('cors'); // Add this line
require('dotenv').config();

connectDB();
const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json({ extended: false }));

// --- API ROUTES ---
//app.use('/api/users', require('./routes/users'));
//app.use('/api/dilemmas', require('./routes/dilemmas'));
//app.use('/api/perspectives', require('./routes/perspectives'));

// --- Serve static assets in production ---
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    //app.get('*', (req, res) => {
      //  res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    //});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));