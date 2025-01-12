/**
 * Routes
 * - PRIVATE ROUTES: only authenticated users can visit
 * - PUBLIC ROUTES: everyone can visit
 */

const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// Public routes
router.get('/public-route', controller.public_route);

// Private routes
// router.use(controller.authorize_user); // Middleware for authentication (applied to every private route)
router.get('/private-route', controller.private_route);

router.use((req, res) => {
    res.redirect('/');
})

module.exports = router;
