const express = require('express');
const router = express.Router();
const {
    getBookings,
    getBookingById,
    getAllBookings,
    setBooking,
    updateBooking,
    deleteBooking,
} = require('../controllers/bookingController');

const { protect, admin } = require('../middleware/authMiddleware');

router.get('/all', protect, admin, getAllBookings);
router.route('/').get(protect, getBookings).post(protect, setBooking);
router.route('/:id').get(protect, getBookingById).delete(protect, deleteBooking).put(protect, updateBooking);

module.exports = router;
