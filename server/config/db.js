// server/config/db.js

const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // We need to specify the path to find the .env file

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully!');
    } catch (error) {
        console.error('MongoDB Connection Failed:', error.message);
        // Exit the application with a failure code
        process.exit(1);
    }
};

module.exports = connectDB;