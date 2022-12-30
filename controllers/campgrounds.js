const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.createCampgroundForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();

    req.flash('success', 'Successfully made a campground!');

    res.redirect(`campgrounds/${campground._id}`);
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });

    req.flash('success', 'Successfully updated a campground!')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted a campground!')

    res.redirect('/campgrounds');
}

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!campground) {
        req.flash('error', 'This campground does not exist!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}

module.exports.updateCampgroundForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!campground) {
        req.flash('error', 'This campground does not exist!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
}