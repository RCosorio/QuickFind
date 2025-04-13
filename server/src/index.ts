import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import createIndexes from './config/indexes.js';
import errorHandler from './middleware/errorHandler.js';
import businessRoutes from './routes/businessRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import checkMongoDBHealth from './utils/dbHealthCheck.js';

// Define __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize the server
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Create indexes for better performance
    await createIndexes();
    
    // Routes
    app.use('/api/businesses', businessRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/reviews', reviewRoutes);
    
    // Health check endpoint
    app.get('/health', async (req, res) => {
      const dbHealth = await checkMongoDBHealth();
      
      res.status(200).json({
        status: 'ok',
        message: 'Server is running with MongoDB',
        database: dbHealth
      });
    });
    
    // Error handling middleware
    app.use(errorHandler);
    
    // 404 handler for undefined routes
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
      });
    });
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    
    // Handle graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`${signal} received, shutting down gracefully`);
      
      // Close server
      server.close(() => {
        console.log('HTTP server closed');
      });
      
      // Close MongoDB connection
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    };
    
    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 