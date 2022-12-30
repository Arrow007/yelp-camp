const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (e) => {
            if (e) {
                return next(e);
            }
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');

    const redirectUrl = req.session.returnTo || '/campgrounds'
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((e) => {
        if (e) {
            return next(e);
        }

        req.flash('success', 'You have been successfully logged out!');
        res.redirect('/campgrounds');
    });
}