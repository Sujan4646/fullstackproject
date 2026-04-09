const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Car = require('./models/carModel');

// Path to .env file in the backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/carbooking');
        const cars = await Car.find({});
        console.log(JSON.stringify(cars.map(c => ({ name: c.name, images: c.images })), null, 2));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkImages();
