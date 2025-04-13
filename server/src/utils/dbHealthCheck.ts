import mongoose from 'mongoose';

/**
 * Check the health of the MongoDB connection
 * @returns Object with status of the MongoDB connection
 */
export const checkMongoDBHealth = async (): Promise<{
  status: 'connected' | 'disconnected' | 'error';
  latency?: number;
  error?: string;
}> => {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return {
        status: 'disconnected',
        error: 'MongoDB is not connected'
      };
    }
    
    // Measure latency with a simple ping
    const startTime = Date.now();
    
    // Run a simple command to test the connection
    await mongoose.connection.db.admin().ping();
    
    const latency = Date.now() - startTime;
    
    return {
      status: 'connected',
      latency
    };
  } catch (error) {
    return {
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export default checkMongoDBHealth; 