const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/cars', require('./routes/carRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
