// Express
const express = require('express');
const router = express.Router({
    mergeParams: true
});

// Reviews Controller
const reviews = require('../controllers/reviews');

// Utilities
const catchAsync = require('../utilities/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('./middleware');

// Routes
router.route('/')
    .post(isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;