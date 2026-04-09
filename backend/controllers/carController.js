const asyncHandler = require('express-async-handler')
const Car = require('../models/carModel')
const Review = require('../models/reviewModel')

// @desc    Get cars
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
    const { category, brand, fuelType, minPrice, maxPrice, search, location } = req.query;

    let query = { available: true };

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (fuelType) query.fuelType = fuelType;
    if (location) query.location = { $regex: location, $options: 'i' };

    if (minPrice || maxPrice) {
        query.pricePerDay = {};
        if (minPrice) query.pricePerDay.$gte = Number(minPrice);
        if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const cars = await Car.find(query);
    res.status(200).json(cars);
})

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id)
    if (!car) {
        res.status(404)
        throw new Error('Car not found')
    }
    const reviews = await Review.find({ car: req.params.id }).populate('user', 'name');
    res.status(200).json({ ...car._doc, reviews });
})

// @desc    Create new review
// @route   POST /api/cars/:id/reviews
// @access  Private
const createCarReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body

    const car = await Car.findById(req.params.id)

    if (car) {
        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            car: req.params.id,
        })

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Car already reviewed')
        }

        const review = await Review.create({
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            car: req.params.id,
        })

        const reviews = await Review.find({ car: req.params.id })
        car.numReviews = reviews.length
        car.rating =
            reviews.reduce((acc, item) => item.rating + acc, 0) /
            reviews.length

        await car.save()
        res.status(201).json({ message: 'Review added', review })
    } else {
        res.status(404)
        throw new Error('Car not found')
    }
})

// @desc    Set car
// @route   POST /api/cars
// @access  Private/Admin
const setCar = asyncHandler(async (req, res) => {
    const {
        name,
        brand,
        category,
        pricePerDay,
        seatingCapacity,
        fuelType,
        transmission,
        images,
        description,
        available,
        location,
    } = req.body

    if (
        !name ||
        !brand ||
        !category ||
        !pricePerDay ||
        !seatingCapacity ||
        !fuelType ||
        !transmission ||
        !description ||
        !location
    ) {
        res.status(400)
        throw new Error('Please add all required fields')
    }

    const car = await Car.create({
        name,
        brand,
        category,
        pricePerDay,
        seatingCapacity,
        fuelType,
        transmission,
        images,
        description,
        available,
        location,
    })

    res.status(200).json(car)
})

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id)

    if (!car) {
        res.status(400)
        throw new Error('Car not found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user is admin
    if (req.user.role !== 'admin') {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedCar)
})

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id)

    if (!car) {
        res.status(400)
        throw new Error('Car not found')
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Make sure the logged in user is admin
    if (req.user.role !== 'admin') {
        res.status(401)
        throw new Error('User not authorized')
    }

    await car.deleteOne()

    res.status(200).json({ id: req.params.id })
})

// @desc    Delete review
// @route   DELETE /api/cars/:id/reviews/:reviewId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id)

    if (!car) {
        res.status(404)
        throw new Error('Car not found')
    }

    const review = await Review.findById(req.params.reviewId)

    if (!review) {
        res.status(404)
        throw new Error('Review not found')
    }

    // Check for user
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401)
        throw new Error('User not authorized')
    }

    await review.deleteOne()

    // Update car rating and numReviews
    const reviews = await Review.find({ car: req.params.id })
    car.numReviews = reviews.length
    car.rating = reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0

    await car.save()

    res.status(200).json({ message: 'Review removed' })
})

module.exports = {
    getCars,
    getCarById,
    createCarReview,
    deleteReview,
    setCar,
    updateCar,
    deleteCar,
}
