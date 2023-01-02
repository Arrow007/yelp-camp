if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Express
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const mongoSanitize = require('express-mongo-sanitize');
const dbURL = process.env.MONGO_URL;
const localDB = 'mongodb://localhost:27017/yelp-camp'
const mongoose = require('mongoose');
const port = 3000;

// Passport
const passport = require('passport');
const local = require('passport-local');
const User = require('./models/user');

// Session
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Mongoose
mongoose.set('strictQuery', false);
mongoose.connect(dbURL);
// mongoose.connect(localDB);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database connected!');
});

const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.STORE_SECRET
    }
});

store.on('error', function (e) {
    console.log('Sesh store error:', e);
})

const sessionConfig = {
    store,
    name: 'sesh',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));

// Flash
const flash = require('connect-flash');
app.use(flash());

// Import Routes
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use(mongoSanitize());
// app.use(helmet())

// Routes
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes)

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(port, () => {
    console.log(`Listening on ${port}!`)
})