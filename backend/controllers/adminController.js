const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');
const Car = require('../models/carModel');
const User = require('../models/userModel');
const Review = require('../models/reviewModel');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'Completed' });

    // Calculate total revenue
    const revenueResult = await Booking.aggregate([
        { $match: { status: 'Completed', paymentStatus: 'Paid' } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalCost' } } }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
        totalUsers,
        totalCars,
        totalBookings,
        totalReviews,
        totalRevenue,
        pendingBookings,
        confirmedBookings,
        completedBookings
    });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
});

// @desc    Get all cars (including unavailable)
// @route   GET /api/admin/cars
// @access  Private/Admin
const getAllCars = asyncHandler(async (req, res) => {
    const cars = await Car.find({}).sort({ createdAt: -1 });
    res.status(200).json(cars);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get recent bookings
// @route   GET /api/admin/recent-bookings
// @access  Private/Admin
const getRecentBookings = asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const bookings = await Booking.find({})
        .populate('user', 'name email')
        .populate('car', 'name brand')
        .sort({ createdAt: -1 })
        .limit(limit);

    res.status(200).json(bookings);
});

// @desc    Get revenue trends (last 7 days)
// @route   GET /api/admin/revenue-trends
// @access  Private/Admin
const getRevenueTrends = asyncHandler(async (req, res) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trends = await Booking.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo },
                paymentStatus: 'Paid'
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: '$totalCost' },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json(trends);
});

// @desc    Get car analytics
// @route   GET /api/admin/car-analytics
// @access  Private/Admin
const getCarAnalytics = asyncHandler(async (req, res) => {
    const carStats = await Booking.aggregate([
        { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
        {
            $group: {
                _id: '$car',
                totalBookings: { $sum: 1 },
                totalRevenue: { $sum: '$totalCost' }
            }
        },
        { $sort: { totalBookings: -1 } },
        { $limit: 10 }
    ]);

    // Populate car details
    await Booking.populate(carStats, { path: '_id', select: 'name brand category' });

    res.status(200).json(carStats);
});

// @desc    Get booking insights
// @route   GET /api/admin/booking-insights
// @access  Private/Admin
const getBookingInsights = asyncHandler(async (req, res) => {
    const statusBreakdown = await Booking.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const paymentBreakdown = await Booking.aggregate([
        {
            $group: {
                _id: '$paymentStatus',
                count: { $sum: 1 },
                total: { $sum: '$totalCost' }
            }
        }
    ]);

    res.status(200).json({
        statusBreakdown,
        paymentBreakdown
    });
});

module.exports = {
    getAdminStats,
    getAllUsers,
    getAllCars,
    deleteUser,
    updateUserRole,
    getRecentBookings,
    getRevenueTrends,
    getCarAnalytics,
    getBookingInsights
};
