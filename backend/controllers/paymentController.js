const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const Car = require('../models/carModel');

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
    const { amount, carId, pickupDate, returnDate } = req.body;

    if (!amount || !carId) {
        res.status(400);
        throw new Error('Amount and carId are required');
    }

    // Amount should be in cents
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        metadata: {
            carId,
            pickupDate,
            returnDate,
            userId: req.user.id.toString(),
        },
    });

    res.status(200).json({
        clientSecret: paymentIntent.client_secret,
    });
});

module.exports = {
    createPaymentIntent,
};
