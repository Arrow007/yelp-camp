// Express
const express = require('express');
const router = express.Router();

// Campgrounds Controller
const campgrounds = require('../controllers/campgrounds')

// Utilities
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('./middleware');

// Routes
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

router.route('/new')
    .get(isLoggedIn, campgrounds.createCampgroundForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground));

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(campgrounds.updateCampgroundForm));

module.exports = router;