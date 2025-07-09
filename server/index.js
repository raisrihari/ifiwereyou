// server/index.js

const express = require('express');
const path = require('path'); // Add this line
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();
const app = express();

// --- MIDDLEWARE ---
const cors = require('cors'); // Make sure this import is at the top
//app.use(cors());
// --- CORS Configuration ---
// This tells our server to only accept requests from our live Netlify site.
const whitelist = ['http://localhost:3000', 'https://ifiwereyou.netlify.app'];
const corsOptions = {
origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
   }
 }
};
app.use(cors(corsOptions));
app.use(express.json({ extended: false }));

// --- API ROUTES ---
app.use('/api/users', require('./routes/users'));
app.use('/api/dilemmas', require('./routes/dilemmas'));
app.use('/api/perspectives', require('./routes/perspectives'));

// --- Serve static assets in production ---
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    // Serve the React app for any route not handled by the API
    app.get('/*', (req, res) => {
       res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));