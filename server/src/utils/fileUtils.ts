import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  BusinessData, 
  UserData, 
  ReviewData,
  Business,
  User
} from '../models/types.js';

// Define __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to data files
const DATA_DIR = path.resolve(__dirname, '../../../data');
const BUSINESSES_FILE = path.join(DATA_DIR, 'businesses.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

// Ensure the data directory exists
const ensureDataDir = async (): Promise<void> => {
  await fs.ensureDir(DATA_DIR);
};

// Initialize data files with default data if they don't exist
export const initializeDataFiles = async (): Promise<void> => {
  try {
    await ensureDataDir();
    
    // Initialize businesses data with empty array if it doesn't exist
    if (!await fs.pathExists(BUSINESSES_FILE)) {
      // Initialize with empty data
      await fs.writeJson(BUSINESSES_FILE, { businesses: [] } as BusinessData, { spaces: 2 });
      console.log('Initialized businesses data file');
    }
    
    // Initialize users data if it doesn't exist
    if (!await fs.pathExists(USERS_FILE)) {
      await fs.writeJson(USERS_FILE, { users: [] } as UserData, { spaces: 2 });
      console.log('Initialized users data file');
    }
    
    // Initialize reviews data if it doesn't exist
    if (!await fs.pathExists(REVIEWS_FILE)) {
      await fs.writeJson(REVIEWS_FILE, { reviews: [] } as ReviewData, { spaces: 2 });
      console.log('Initialized reviews data file');
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
    throw error;
  }
};

// Read data from a JSON file
export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  try {
    const data = await fs.readJson(filePath) as T;
    return data;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    throw error;
  }
};

// Write data to a JSON file
export const writeJsonFile = async <T>(filePath: string, data: T): Promise<void> => {
  try {
    await fs.writeJson(filePath, data, { spaces: 2 });
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    throw error;
  }
};

// Get all businesses
export const getBusinesses = async (): Promise<Business[]> => {
  const data = await readJsonFile<BusinessData>(BUSINESSES_FILE);
  return data.businesses;
};

// Get a business by ID
export const getBusinessById = async (id: string): Promise<Business | undefined> => {
  const data = await readJsonFile<BusinessData>(BUSINESSES_FILE);
  return data.businesses.find(business => business.id === id);
};

// Update a business
export const updateBusiness = async (id: string, updatedBusiness: Partial<Business>): Promise<Business | null> => {
  const data = await readJsonFile<BusinessData>(BUSINESSES_FILE);
  const index = data.businesses.findIndex(business => business.id === id);
  
  if (index !== -1) {
    data.businesses[index] = { ...data.businesses[index], ...updatedBusiness };
    await writeJsonFile(BUSINESSES_FILE, data);
    return data.businesses[index];
  }
  return null;
};

// Create a new business
export const createBusiness = async (newBusiness: Business): Promise<Business> => {
  const data = await readJsonFile<BusinessData>(BUSINESSES_FILE);
  data.businesses.push(newBusiness);
  await writeJsonFile(BUSINESSES_FILE, data);
  return newBusiness;
};

// Delete a business
export const deleteBusiness = async (id: string): Promise<Business | null> => {
  const data = await readJsonFile<BusinessData>(BUSINESSES_FILE);
  const index = data.businesses.findIndex(business => business.id === id);
  
  if (index !== -1) {
    const deletedBusiness = data.businesses[index];
    data.businesses.splice(index, 1);
    await writeJsonFile(BUSINESSES_FILE, data);
    return deletedBusiness;
  }
  return null;
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const data = await readJsonFile<UserData>(USERS_FILE);
  return data.users;
};

// Get a user by ID
export const getUserById = async (id: string): Promise<User | undefined> => {
  const data = await readJsonFile<UserData>(USERS_FILE);
  return data.users.find(user => user.id === id);
};

// Create a user
export const createUser = async (user: User): Promise<User> => {
  const data = await readJsonFile<UserData>(USERS_FILE);
  data.users.push(user);
  await writeJsonFile(USERS_FILE, data);
  return user;
};

// Update a user
export const updateUser = async (id: string, updatedUser: Partial<User>): Promise<User | null> => {
  const data = await readJsonFile<UserData>(USERS_FILE);
  const index = data.users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    data.users[index] = { ...data.users[index], ...updatedUser };
    await writeJsonFile(USERS_FILE, data);
    return data.users[index];
  }
  return null;
};

// Delete a user
export const deleteUser = async (id: string): Promise<User | null> => {
  const data = await readJsonFile<UserData>(USERS_FILE);
  const index = data.users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    const deletedUser = data.users[index];
    data.users.splice(index, 1);
    await writeJsonFile(USERS_FILE, data);
    return deletedUser;
  }
  return null;
}; 