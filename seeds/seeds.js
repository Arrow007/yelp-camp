// Mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
    console.log('Database connected!');
});

const Campground = require('../models/campground');

// Dependencies
const cities = require('./cities');
const { places, descriptors } = require('./names');

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    console.log('Seeding database...');

    await Campground.deleteMany({});
    console.log('> Deleted all contents of database.')

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = (Math.floor((Math.random() * 50) + 15) + 0.99)
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Est corporis similique sed magni possimus repellendus impedit assumenda veritatis nam dolores!',
            price: randomPrice,
            image: 'https://picsum.photos/1920/1080',
            author: '63adcf731a8a70e97184cd9d'
        })

        await camp.save();
        console.log(`> Seeded new random campground. (${i + 1})`)
    }

    console.log('Seeding completed!');
}

seedDB().then(() => {
    mongoose.connection.close();
    console.log('Database closed!');
});