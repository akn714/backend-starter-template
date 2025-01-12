/**
 * AUTH ROUTES:
 * GET /login
 * GET /signup
 * 
 * POST /login
 * POST /signup
 */

const express = require('express');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/logout', authController.logout);

// auth routes
router.get('/signup', authController.get_signup_page);
router.get('/login', authController.get_login_page);

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use((req, res)=>{
    res.redirect('/');
})

module.exports = router

