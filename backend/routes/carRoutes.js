const express = require('express');
const router = express.Router();
const {
    getCars,
    getCarById,
    createCarReview,
    deleteReview,
    setCar,
    updateCar,
    deleteCar,
} = require('../controllers/carController');

const { protect, admin } = require('../middleware/authMiddleware')

router.route('/').get(getCars).post(protect, admin, setCar)
router.route('/:id').get(getCarById).delete(protect, admin, deleteCar).put(protect, admin, updateCar)
router.post('/:id/reviews', protect, createCarReview)
router.delete('/:id/reviews/:reviewId', protect, deleteReview)

module.exports = router;
