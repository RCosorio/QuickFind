const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Setup environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Try to get MONGO_URI from .env file
    let mongoURI = process.env.MONGO_URI;
    
    // If not found, use default connection string
    if (!mongoURI) {
      console.log('MongoDB connection string not found in .env file, using default connection');
      mongoURI = 'mongodb://localhost:27017/quickfind';
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
    
    return mongoose;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Clear database collections
const clearDatabase = async () => {
  try {
    console.log('Starting database cleanup...');
    
    // Connect to the database
    const mongoose = await connectDB();
    
    // Access the collections directly
    const collections = ['businesses', 'users', 'reviews'];
    
    for (const collectionName of collections) {
      console.log(`Clearing ${collectionName} collection...`);
      const collection = mongoose.connection.collection(collectionName);
      const result = await collection.deleteMany({});
      console.log(`Deleted ${result.deletedCount} documents from ${collectionName}`);
    }
    
    console.log('Database cleanup completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    
    // Attempt to close connection
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (err) {
      console.error('Error closing MongoDB connection:', err);
    }
    
    process.exit(1);
  }
};

// Run the script
clearDatabase(); 