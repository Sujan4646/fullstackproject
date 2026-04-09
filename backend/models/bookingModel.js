const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        car: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Car',
        },
        pickupDate: {
            type: Date,
            required: true,
        },
        returnDate: {
            type: Date,
            required: true,
        },
        totalCost: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
            default: 'Pending',
        },
        paymentStatus: {
            type: String,
            required: true,
            enum: ['Paid', 'Unpaid'],
            default: 'Unpaid',
        },
        paymentId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
