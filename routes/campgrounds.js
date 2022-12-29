const express = require('express');
const router = express.Router();

// Utilities
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

// Database
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');

// Validation
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// Routes

router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();

    req.flash('success', 'Successfully made a campground!');

    res.redirect(`campgrounds/${campground._id}`);
}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.put('/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });

    req.flash('success', 'Successfully updated a campground!')

    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted a campground!')

    res.redirect('/campgrounds');
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');

    if (!campground) {
        req.flash('error', 'This campground does not exist!');
        res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
        req.flash('error', 'This campground does not exist!');
        res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
}))

module.exports = router;