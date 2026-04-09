# Car Booking Management System (MERN Stack)

A full-stack car booking application built with MongoDB, Express.js, React.js, and Node.js.

## Features
- **User Authentication**: Register/Login with JWT.
- **Car Browsing**: Filter by category, price, fuel type.
- **Booking System**: Select dates, calculate cost, mock payment.
- **User Dashboard**: View and cancel bookings.
- **Admin Dashboard**: 
  - **Analytics**: View total users, cars, bookings, and revenue.
  - **Car Management**: Add new cars with image uploads (Cloudinary) and delete cars.
  - **Booking Management**: Confirm or Cancel user bookings.
- **Responsive Design**: Modern dark-themed UI.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running (or use MongoDB Atlas URI)
- Cloudinary Account (for image uploads)

### Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder with the following details:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   
   # Cloudinary Keys (Required for Image Upload)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   Start the server:
   ```bash
   npm start
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the App**
   Open http://localhost:5173 (or port shown by Vite) in your browser.

## Admin Access
To access the Admin Dashboard:
1. Register a new user via the app.
2. Manually update the user's `role` to `'admin'` in your MongoDB database (in the `users` collection).
3. Log out and log back in to see the "Admin" link in the header.

## Technologies Used
- **Frontend**: React, Vite, React Router, Context API, Vanilla CSS.
- **Backend**: Node.js, Express, Mongoose, JWT, BCrypt, Multer (File Uploads).
- **Services**: Cloudinary (Images), MongoDB Atlas (Database).

## Deployment configuration
- **Vercel**: `vercel.json` included for both frontend and backend.
- **Netlify**: `netlify.toml` included for frontend.

## MongoDB Atlas — Quick Connect

If you prefer MongoDB Atlas (hosted DB) follow these steps:

1. Create an account at https://www.mongodb.com/cloud/atlas and create a free cluster.
2. In the Atlas UI create a database user (give it a password) and note the username/password.
3. Whitelist your IP (or use 0.0.0.0/0 temporarily for development) under Network Access.
4. Get the connection string from "Connect" → "Connect your application" and copy the URI. It looks like:

   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

5. In the `backend` folder, copy `backend/.env.example` to `backend/.env` and replace `MONGO_URI` with your Atlas URI, and set `JWT_SECRET` and Cloudinary keys:

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

6. Restart the backend server:

   ```bash
   cd backend
   npm start
   ```

7. Confirm connection: backend logs will show `MongoDB Connected: <host>` on successful connect.

Security notes:
- Do NOT commit your real `.env` to source control. Keep credentials secret.
- For production, use environment variables provided by your hosting platform.
