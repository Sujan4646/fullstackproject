const mongoose = require('mongoose');
require('dotenv').config();

const cities = [
  'Chennai', 'Mumbai', 'Kolkata', 'Bangalore', 'Hyderabad', 'Cochin',
  'Delhi', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow'
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/carbooking').then(async () => {
  const Car = require('./models/carModel');
  const cars = await Car.find({});

  for (let i = 0; i < cars.length; i++) {
    const city = cities[i % cities.length];
    await Car.updateOne({ _id: cars[i]._id }, { $set: { location: city } });
    console.log(`${cars[i].name} -> ${city}`);
  }

  console.log('\nAll locations updated to Indian metro cities!');
  process.exit();
}).catch(e => { console.error(e); process.exit(1); });
