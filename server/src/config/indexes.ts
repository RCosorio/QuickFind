import { UserModel } from '../models/mongodb/User.js';
import { BusinessModel } from '../models/mongodb/Business.js';
import { ReviewModel } from '../models/mongodb/Review.js';

/**
 * Creates indexes for MongoDB collections to improve query performance
 */
export const createIndexes = async (): Promise<void> => {
  try {
    // User indexes
    await UserModel.collection.createIndex({ id: 1 }, { unique: true });
    await UserModel.collection.createIndex({ email: 1 }, { unique: true });
    
    // Business indexes
    await BusinessModel.collection.createIndex({ id: 1 }, { unique: true });
    await BusinessModel.collection.createIndex({ ownerEmail: 1 });
    await BusinessModel.collection.createIndex({ businessType: 1 });
    
    // Review indexes
    await ReviewModel.collection.createIndex({ id: 1 }, { unique: true });
    await ReviewModel.collection.createIndex({ businessId: 1 });
    await ReviewModel.collection.createIndex({ userId: 1 });
    
    console.log('MongoDB indexes created successfully');
  } catch (error) {
    console.error('Error creating MongoDB indexes:', error);
  }
};

export default createIndexes; 