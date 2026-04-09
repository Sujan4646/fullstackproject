const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/carModel');
const User = require('./models/userModel');

dotenv.config();

const cars = [
    {
        name: 'Model S',
        brand: 'Tesla',
        category: 'Luxury',
        pricePerDay: 12000,
        seatingCapacity: 5,
        fuelType: 'Electric',
        transmission: 'Automatic',
        location: 'New York, NY',
        description: 'High performance electric sedan with autopilot.',
        images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Cayenne',
        brand: 'Porsche',
        category: 'Luxury',
        pricePerDay: 15000,
        seatingCapacity: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: 'Los Angeles, CA',
        description: 'The ultimate luxury SUV experience.',
        images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Civic',
        brand: 'Honda',
        category: 'Sedan',
        pricePerDay: 3200,
        seatingCapacity: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: 'Chicago, IL',
        description: 'Reliable and fuel-efficient urban sedan.',
        images: ['https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Range Rover',
        brand: 'Land Rover',
        category: 'SUV',
        pricePerDay: 18000,
        seatingCapacity: 7,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        location: 'San Francisco, CA',
        description: 'Unmatched off-road capability and luxury.',
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800'],
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-booking');
        console.log('Connected to MongoDB for seeding...');

        await Car.deleteMany({});
        console.log('Cleared existing cars...');

        await Car.insertMany(cars);
        console.log('Seeded sample cars successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
