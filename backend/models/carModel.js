const mongoose = require('mongoose');

const carSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a car name'],
        },
        brand: {
            type: String,
            required: [true, 'Please add a brand'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['SUV', 'Sedan', 'Hatchback', 'Luxury'],
        },
        pricePerDay: {
            type: Number,
            required: [true, 'Please add price per day'],
        },
        seatingCapacity: {
            type: Number,
            required: [true, 'Please add seating capacity'],
        },
        fuelType: {
            type: String,
            required: [true, 'Please add fuel type'],
            enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        },
        transmission: {
            type: String,
            required: [true, 'Please add transmission type'],
            enum: ['Manual', 'Automatic'],
        },
        images: [
            {
                type: String,
            },
        ],
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        available: {
            type: Boolean,
            default: true,
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Car', carSchema);
