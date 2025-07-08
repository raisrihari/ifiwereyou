// server/middleware/auth.js

const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' });

module.exports = function(req, res, next) {
    // 1. Get the token from the request header
    const token = req.header('x-auth-token');

    // 2. Check if no token is present
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. If a token is found, verify it
    try {
        // Decode the token using our JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user information from the token's payload to the request object
        req.user = decoded.user;
        
        // Call next() to proceed to the next piece of middleware or the route handler
        next();

    } catch (error) {
        // If the token is not valid (e.g., it's expired or malformed)
        res.status(401).json({ msg: 'Token is not valid' });
    }
};