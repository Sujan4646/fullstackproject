const asyncHandler = require('express-async-handler')
const Booking = require('../models/bookingModel')
const Car = require('../models/carModel')
const sendEmail = require('../utils/sendEmail')

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id }).populate('car')
    res.status(200).json(bookings)
})

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('car').populate('user', 'name email')

    if (!booking) {
        res.status(404)
        throw new Error('Booking not found')
    }

    // Check if logged in user is the one who booked or an admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401)
        throw new Error('User not authorized')
    }

    res.status(200).json(booking)
})

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find().populate('car').populate('user', 'name email')
    res.status(200).json(bookings)
})

// @desc    Set booking
// @route   POST /api/bookings
// @access  Private
const setBooking = asyncHandler(async (req, res) => {
    const { carId, pickupDate, returnDate, paymentId, paymentStatus } = req.body

    if (!carId || !pickupDate || !returnDate) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const car = await Car.findById(carId)

    if (!car) {
        res.status(400)
        throw new Error('Car not found')
    }

    const start = new Date(pickupDate)
    const end = new Date(returnDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

    if (days <= 0) {
        res.status(400)
        throw new Error('Invalid dates')
    }

    // Check availability
    const overlapping = await Booking.findOne({
        car: carId,
        status: { $ne: 'Cancelled' },
        $or: [
            { pickupDate: { $lte: returnDate }, returnDate: { $gte: pickupDate } }
        ]
    })

    if (overlapping) {
        res.status(400)
        throw new Error('Car is not available for these dates')
    }

    const totalCost = days * car.pricePerDay

    const booking = await Booking.create({
        user: req.user.id,
        car: carId,
        pickupDate,
        returnDate,
        totalCost,
        paymentStatus: paymentStatus || (paymentId ? 'Paid' : 'Unpaid'),
        paymentId,
    })

    res.status(200).json(booking)

    // Send confirmation email
    try {
        const message = `
            <h1>Booking Confirmation</h1>
            <p>Dear ${req.user.name},</p>
            <p>Your booking for ${car.brand} ${car.name} has been confirmed.</p>
            <p><b>Pickup Date:</b> ${new Date(pickupDate).toLocaleDateString()}</p>
            <p><b>Return Date:</b> ${new Date(returnDate).toLocaleDateString()}</p>
            <p><b>Total Cost:</b> $${totalCost}</p>
            <p>Thank you for choosing our service!</p>
        `
        await sendEmail({
            email: req.user.email,
            subject: 'Car Booking Confirmation',
            message,
        })
    } catch (error) {
        console.error('Email could not be sent', error)
    }
})

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
const updateBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
        res.status(400)
        throw new Error('Booking not found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Users can only cancel if pending, Admins can update status
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    // If user is updating, they can only cancel? 
    // For simplicity, let's allow updating body if admin, or special cancel logic if user.
    // The request should separate these concerns, but for now allow direct update.

    const updatedBooking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        }
    )

    res.status(200).json(updatedBooking)
})

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
        res.status(400)
        throw new Error('Booking not found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user matches the goal user or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401)
        throw new Error('User not authorized')
    }

    await booking.deleteOne()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getBookings,
    getBookingById,
    getAllBookings,
    setBooking,
    updateBooking,
    deleteBooking,
}
