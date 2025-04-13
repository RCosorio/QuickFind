import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import { readJsonFile } from '../utils/fileUtils.js';
import { BusinessData, UserData, ReviewData } from '../models/types.js';
import { BusinessModel } from '../models/mongodb/Business.js';
import { UserModel } from '../models/mongodb/User.js';
import { ReviewModel } from '../models/mongodb/Review.js';
import connectDB from '../config/database.js';

// Define __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Paths to data files
const DATA_DIR = path.resolve(__dirname, '../../../data');
const BUSINESSES_FILE = path.join(DATA_DIR, 'businesses.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

const migrateData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Clear existing collections
    await BusinessModel.deleteMany({});
    await UserModel.deleteMany({});
    await ReviewModel.deleteMany({});
    
    // Read JSON data
    const businessesData = await readJsonFile<BusinessData>(BUSINESSES_FILE);
    const usersData = await readJsonFile<UserData>(USERS_FILE);
    const reviewsData = await readJsonFile<ReviewData>(REVIEWS_FILE);
    
    // Insert businesses
    if (businessesData.businesses.length > 0) {
      await BusinessModel.insertMany(businessesData.businesses);
      console.log(`Migrated ${businessesData.businesses.length} businesses`);
    }
    
    // Insert users
    if (usersData.users.length > 0) {
      await UserModel.insertMany(usersData.users);
      console.log(`Migrated ${usersData.users.length} users`);
    }
    
    // Insert reviews
    if (reviewsData.reviews.length > 0) {
      await ReviewModel.insertMany(reviewsData.reviews);
      console.log(`Migrated ${reviewsData.reviews.length} reviews`);
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateData(); 