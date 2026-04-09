const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/carModel');

dotenv.config();

const moreCars = [
    {
        name: 'G-Class',
        brand: 'Mercedes-Benz',
        category: 'SUV',
        pricePerDay: 20000,
        seatingCapacity: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: 'Miami, FL',
        description: 'Iconic luxury SUV with unmatched presence.',
        images: ['https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'M5 Competition',
        brand: 'BMW',
        category: 'Sedan',
        pricePerDay: 17000,
        seatingCapacity: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: 'Dallas, TX',
        description: 'High-performance luxury sports sedan.',
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Mustang GT',
        brand: 'Ford',
        category: 'Luxury',
        pricePerDay: 10000,
        seatingCapacity: 4,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: 'Las Vegas, NV',
        description: 'Classic American muscle car experience.',
        images: ['https://images.unsplash.com/photo-1584345611124-2875c18d1796?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'RS7 Sportback',
        brand: 'Audi',
        category: 'Sedan',
        pricePerDay: 16000,
        seatingCapacity: 4,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: 'Seattle, WA',
        description: 'Sleek design and blistering performance.',
        images: ['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Urus',
        brand: 'Lamborghini',
        category: 'SUV',
        pricePerDay: 35000,
        seatingCapacity: 5,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: 'Beverly Hills, CA',
        description: 'The world\'s first Super Sport Utility Vehicle.',
        images: ['https://images.unsplash.com/photo-1669023030485-573b6ac99761?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Land Cruiser',
        brand: 'Toyota',
        category: 'SUV',
        pricePerDay: 9500,
        seatingCapacity: 7,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        location: 'Denver, CO',
        description: 'Legendary off-road reliability and comfort.',
        images: ['https://images.unsplash.com/photo-1596701046927-44df0e4a7a8d?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Ioniq 5',
        brand: 'Hyundai',
        category: 'Hatchback',
        pricePerDay: 5500,
        seatingCapacity: 5,
        fuelType: 'Electric',
        transmission: 'Automatic',
        location: 'Austin, TX',
        description: 'Award-winning electric vehicle with retro-futuristic design.',
        images: ['https://images.unsplash.com/photo-1651842835926-d62f4dbfb3f7?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Wrangler Rubicon',
        brand: 'Jeep',
        category: 'SUV',
        pricePerDay: 7000,
        seatingCapacity: 5,
        fuelType: 'Petrol',
        transmission: 'Manual',
        location: 'Phoenix, AZ',
        description: 'Ready for any off-road adventure.',
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Corvette Stingray',
        brand: 'Chevrolet',
        category: 'Luxury',
        pricePerDay: 14000,
        seatingCapacity: 2,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        location: 'Miami, FL',
        description: 'Stunning mid-engine sports car.',
        images: ['https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=800'],
    },
    {
        name: 'Model 3',
        brand: 'Tesla',
        category: 'Sedan',
        pricePerDay: 6000,
        seatingCapacity: 5,
        fuelType: 'Electric',
        transmission: 'Automatic',
        location: 'Portland, OR',
        description: 'The car of the future, today.',
        images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'],
    }
];

const embedCars = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/car-booking');
        console.log('Connected to MongoDB to add more cars...');

        await Car.insertMany(moreCars);
        console.log('Successfully added 10 new cars!');

        process.exit();
    } catch (error) {
        console.error('Error adding cars:', error);
        process.exit(1);
    }
};

embedCars();
