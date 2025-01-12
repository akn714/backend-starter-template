// ## Starter Template for Route Logic ##

// Imports
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Model = require('../models/model');

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.JWT_KEY) {
    throw new Error('Missing JWT_KEY in environment variables');
}

const JWT_KEY = process.env.JWT_KEY;

/**
 * Function to verify the authenticity of a user token
 * @param {string} token - The JWT token to verify
 * @returns {string|boolean} - User ID if valid, false otherwise
 */
function is_user_authentic(token) {
    try {
        let payload = jwt.verify(token, JWT_KEY);
        return payload.payload;
    } catch (error) {
        console.log('[-] Error verifying token:', error.message);
        return false;
    }
}

/**
 * Middleware to authorize a user
 * Protects private routes from unauthorized access
 */
const authorize_user = async (req, res, next) => {
    try {
        let token = req.cookies?.login; // Check if token exists in cookies
        let id = is_user_authentic(token);
        if (!id) return res.redirect('/auth/login');

        let user = await Model.findById(id);
        if (user) {
            req.id = id; // Attach user ID to the request object
            next(); // Allow access to the next middleware or route
        } else {
            return res.redirect('/auth/login');
        }
    } catch (error) {
        console.log('[-] Authorization error:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Controller for a private route
 * Sends a response indicating access to a private route
 */
const private_route = async (req, res) => {
    try {
        // Placeholder for future private route logic
        res.status(200).json({
            message: '# You are accessing a private route #',
            userId: req.id, // Include user ID for context
        });
    } catch (error) {
        console.log('[-] Error in private route:', error.message);
        res.status(500).json({
            message: '# An error occurred while accessing the private route #',
            error: error.message,
        });
    }
};

/**
 * Controller for a public route
 * Sends a response indicating access to a public route
 */
const public_route = async (req, res) => {
    try {
        // Placeholder for future public route logic
        res.status(200).json({
            message: '# You are accessing a public route #',
        });
    } catch (error) {
        console.log('[-] Error in public route:', error.message);
        res.status(500).json({
            message: '# An error occurred while accessing the public route #',
            error: error.message,
        });
    }
};

// Exports
module.exports = {
    public_route,
    private_route,
    authorize_user, // Export middleware for use in route definitions
};
