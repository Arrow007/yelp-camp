// Express
const express = require('express');
const router = express.Router();

// Users Controller
const users = require('../controllers/users');

// Utilities
const catchAsync = require('../utilities/catchAsync');

// Passport
const passport = require('passport');
const passportOptions = {
    failureFlash: true,
    failureRedirect: '/login',
    keepSessionInfo: true
};

// Routes
router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', passportOptions), users.login);

router.route('/logout')
    .get(users.logout);

module.exports = router;