// server/models/User.js

const mongoose = require('mongoose');

// This is the blueprint for a User in our database
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // A username is mandatory
        unique: true,   // Every username must be unique
        trim: true      // Removes any extra spaces from the beginning or end
    },
    email: {
        type: String,
        required: true, // An email is mandatory
        unique: true,   // Every email must be unique
        trim: true,
        lowercase: true // Ensures emails are stored in a consistent format
    },
    profilePictureUrl: {
        type: String,
        default: '' // Default to an empty string
    },
    password: {
        type: String,
        required: true // A password is mandatory
    },
    karmaPoints: {
        type: Number,
        default: 0     // Users start with 0 karma points
    },
    createdAt: {
        type: Date,
        default: Date.now // Records the exact time the user was created
    }
});

// Create and export the model based on the blueprint
module.exports = mongoose.model('User', UserSchema);