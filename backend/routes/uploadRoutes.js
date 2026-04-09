const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const { uploadImage } = require('../controllers/uploadController');

// Accept multiple files from field name 'images'
router.post('/', upload.array('images', 10), uploadImage);

module.exports = router;
