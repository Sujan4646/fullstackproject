const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/carbooking');
        console.log('Connected to MongoDB to add super admin user...');

        // Delete if already exists
        await User.deleteOne({ email: 'sujan.g2024lalds@sece.ac.in' });

        const adminUser = new User({
            name: 'Sujan',
            email: 'sujan.g2024lalds@sece.ac.in',
            password: 'password123',
            role: 'admin',
        });

        await adminUser.save(); // Model's pre-save middleware will inherently hash the password
        
        console.log('Successfully created admin portal user for Sujan!');
        process.exit();
    } catch (error) {
        console.error('Error adding user:', error);
        process.exit(1);
    }
};

seedUser();
