const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getAllUsers,
    getAllCars,
    deleteUser,
    updateUserRole,
    getRecentBookings,
    getRevenueTrends,
    getCarAnalytics,
    getBookingInsights
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Stats and Analytics
router.get('/stats', protect, admin, getAdminStats);
router.get('/recent-bookings', protect, admin, getRecentBookings);
router.get('/revenue-trends', protect, admin, getRevenueTrends);
router.get('/car-analytics', protect, admin, getCarAnalytics);
router.get('/booking-insights', protect, admin, getBookingInsights);

// User Management
router.get('/users', protect, admin, getAllUsers);
router.get('/cars', protect, admin, getAllCars);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/role', protect, admin, updateUserRole);

module.exports = router;
