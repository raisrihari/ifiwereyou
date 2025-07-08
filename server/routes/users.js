// server/routes/users.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' });
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const User = require('../models/User');
const auth = require('../middleware/auth');
// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User with this email already exists' });

        user = await User.findOne({ username });
        if (user) return res.status(400).json({ msg: 'Username is already taken' });

        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
        
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/users/me
// @desc    Get current logged-in user's data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// Add to server/routes/users.js

// @route   POST /api/users/upload-picture
// @desc    Upload a profile picture for the logged-in user
// @access  Private
router.post('/upload-picture', auth, upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded.' });
        }

        // Upload image to Cloudinary from buffer
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "profile_pictures" },
                (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        // Find user and update their profile picture URL
        const user = await User.findById(req.user.id);
        user.profilePictureUrl = result.secure_url;
        await user.save();

        res.json({ profilePictureUrl: user.profilePictureUrl });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// In server/routes/users.js

// @route   GET /api/users/profile/:username
// @desc    Get a user's public profile and their stories by username
// @access  Public
router.get('/profile/:username', async (req, res) => {
    try {
        // 1. Find the user by their username (case-insensitive)
        //    and select only the public fields we need.
        const user = await User.findOne({ 
            username: { $regex: `^${req.params.username}$`, $options: 'i' } 
        }).select('username createdAt profilePictureUrl');

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }
        
        // 2. Find all dilemmas written by this user that are NOT anonymous.
        const dilemmas = await Dilemma.find({ author: user._id, isAnonymous: false })
            .sort({ createdAt: -1 })
            .populate('author', 'username'); // Still populate for the cards

        // 3. Send back only the user object and their dilemmas.
        res.json({ user, dilemmas });

    } catch (error) {
        console.error(`Error in /profile/:username route: ${error.message}`);
        res.status(500).send('Server Error');
    }
});

module.exports = router;