const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/messages
// @access  Public
const submitMessage = asyncHandler(async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    const newMessage = await Message.create({
        name,
        email,
        message,
    });

    if (newMessage) {
        // Send email to admin or user confirmation?
        // Let's send confirmation email to the user
        try {
            await sendEmail({
                email: email,
                subject: 'Message Received - Car Booking',
                message: `
                    <h1>Thank You For Contacting Us!</h1>
                    <p>Dear ${name},</p>
                    <p>We've received your message and will get back to you soon.</p>
                    <p><b>Your Message:</b> ${message}</p>
                `,
            });
        } catch (error) {
            console.error('Contact email could not be sent', error);
        }

        res.status(201).json({ message: 'Message sent successfully' });
    } else {
        res.status(400);
        throw new Error('Invalid message data');
    }
});

// @desc    Get all messages (Admin)
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
});

module.exports = {
    submitMessage,
    getMessages,
};
