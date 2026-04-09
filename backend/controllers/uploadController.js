const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const asyncHandler = require('express-async-handler');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Upload image
// @route   POST /api/upload
// @access  Public
const uploadImage = asyncHandler(async (req, res) => {
    // Support single upload (req.file) and multiple uploads (req.files)
    if ((!req.file || Object.keys(req.file).length === 0) && (!req.files || req.files.length === 0)) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';

    try {
        const uploadPromises = [];

        if (req.files && req.files.length > 0) {
            req.files.forEach((f) => {
                if (useCloudinary) {
                    uploadPromises.push(
                        cloudinary.uploader.upload(f.path, { folder: 'car-booking' })
                            .then((result) => ({ localPath: f.path, url: result.secure_url, isCloudinary: true }))
                    );
                } else {
                    // Just return the local path as /uploads/filename
                    uploadPromises.push(
                        Promise.resolve({ localPath: f.path, url: `/uploads/${f.filename}`, isCloudinary: false })
                    );
                }
            });
        } else if (req.file) {
            if (useCloudinary) {
                uploadPromises.push(
                    cloudinary.uploader.upload(req.file.path, { folder: 'car-booking' })
                        .then((result) => ({ localPath: req.file.path, url: result.secure_url, isCloudinary: true }))
                );
            } else {
                uploadPromises.push(
                    Promise.resolve({ localPath: req.file.path, url: `/uploads/${req.file.filename}`, isCloudinary: false })
                );
            }
        }

        const results = await Promise.all(uploadPromises);

        // Delete local files ONLY if they were uploaded to Cloudinary
        results.forEach((r) => {
            try {
                if (r.isCloudinary && r.localPath && fs.existsSync(r.localPath)) {
                    fs.unlinkSync(r.localPath);
                }
            } catch (error) {
                console.error('Error deleting local file:', error);
            }
        });

        const urls = results.map((r) => r.url);

        // Return array of URLs (keep compatibility: return `url` for single)
        if (urls.length === 1) return res.status(200).json({ url: urls[0], urls });

        res.status(200).json({ urls });
    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Image upload failed');
    }
});

module.exports = {
    uploadImage,
};
