const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/carModel');

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carbooking');
        
        // 1. Mustang GT (Sport/Muscle car)
        await Car.updateOne(
            { name: 'Mustang GT' },
            { $set: { images: ['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80'] } }
        );
        
        // 2. Urus (Sports Car / SUV)
        await Car.updateOne(
            { name: 'Urus' },
            { $set: { images: ['https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80'] } }
        );
        
        // 3. Land Cruiser (Jeep/Offroad)
        await Car.updateOne(
            { name: 'Land Cruiser' },
            { $set: { images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'] } }
        );
        
        // 4. Ioniq 5 (EV/Modern)
        await Car.updateOne(
            { name: 'Ioniq 5' },
            { $set: { images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80'] } }
        );

        console.log('Successfully updated broken images with stable premium Unsplash photos.');
        process.exit();
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
};

updateImages();
