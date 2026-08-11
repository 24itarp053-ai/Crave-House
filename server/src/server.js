const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const menuRoutes = require('./routes/menuRoutes');

// 1. Load dotenv
dotenv.config();

// 2. Create Express application
const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 3. Enable JSON parsing middleware
app.use(express.json());

// 4. Configure CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));

// 6. Register /api/health
app.get('/api/health', (req, res) => {
  // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const isDbConnected = mongoose.connection.readyState === 1;

  if (isDbConnected) {
    return res.status(200).json({
      success: true,
      message: "Crave House API is running",
      database: "connected"
    });
  } else {
    return res.status(503).json({
      success: false,
      message: "Crave House API is running but Database connection is not ready",
      database: "disconnected"
    });
  }
});

// Register authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);

// 7. Register API 404 handler
app.use('/api', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// 8. Register centralized error handler
app.use((err, req, res, next) => {
  // Server-side logging of detailed error/stack for development
  console.error('Centralized Error Handler:', err.stack || err);

  let statusCode = err.status || err.statusCode || 500;
  let message = "Something went wrong";

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Email already registered';
  }

  res.status(statusCode).json({
    success: false,
    message: message
  });
});

// 5. Connect to MongoDB and 9. Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start listening on port
    app.listen(PORT, () => {
      console.log(`Crave House API running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
