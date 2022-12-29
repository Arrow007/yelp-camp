const express = require('express');
const router = express.Router({
    mergeParams: true
});

// Utilities
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

// Database
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');

// Validation

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// Routes

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash('success', 'Succesfully posted a review!');

    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted a review!');

    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;