const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/carModel');

dotenv.config();

// Assign realistic premium prices (above ₹3000/day) per car name
const priceMap = {
    'Model S':           12000,
    'Cayenne':           15000,
    'Civic':              3200,
    'Range Rover':       18000,
    'G-Class':           20000,
    'M5 Competition':    17000,
    'Mustang GT':        10000,
    'RS7 Sportback':     16000,
    'Urus':              35000,
    'Land Cruiser':       9500,
    'Ioniq 5':            5500,
    'Wrangler Rubicon':   7000,
    'Corvette Stingray': 14000,
    'Model 3':            6000,
};

const updatePrices = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-booking');
        console.log('Connected to MongoDB...');

        const cars = await Car.find({});
        console.log(`Found ${cars.length} cars. Updating prices...`);

        for (const car of cars) {
            const newPrice = priceMap[car.name];
            if (newPrice) {
                await Car.updateOne({ _id: car._id }, { $set: { pricePerDay: newPrice } });
                console.log(`✅ ${car.brand} ${car.name}: ₹${newPrice}/day`);
            } else {
                // For any car not in the map, set a default above 3000
                const fallback = Math.floor(Math.random() * 7000) + 3500;
                await Car.updateOne({ _id: car._id }, { $set: { pricePerDay: fallback } });
                console.log(`✅ ${car.brand} ${car.name}: ₹${fallback}/day (fallback)`);
            }
        }

        console.log('\n🎉 All car prices updated successfully above ₹3000!');
        process.exit();
    } catch (error) {
        console.error('Error updating prices:', error);
        process.exit(1);
    }
};

updatePrices();
