import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { BusinessData } from '../models/types.js';
import { v4 as uuidv4 } from 'uuid';
import { getBusinesses } from './fileUtils.js';

// Define __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to data files
const DATA_DIR = path.resolve(__dirname, '../../../data');
const BUSINESSES_FILE = path.join(DATA_DIR, 'businesses.json');

/**
 * Imports custom business data
 * @param businesses Array of business objects to import
 */
export const importCustomData = async (businesses: any[]): Promise<void> => {
  try {
    // Ensure the data directory exists
    await fs.ensureDir(DATA_DIR);
    
    console.log('Importing custom data...');
    
    // Ensure each business has a unique ID
    const processedBusinesses = businesses.map(business => ({
      ...business,
      id: business.id || uuidv4()
    }));
    
    // Write the custom data to the businesses.json file
    await fs.writeJson(BUSINESSES_FILE, { businesses: processedBusinesses }, { spaces: 2 });
    
    console.log('Custom data imported successfully!');
  } catch (error) {
    console.error('Error importing custom data:', error);
    throw error;
  }
};

/**
 * Add businesses to the existing data
 * @param businesses Array of business objects to add
 */
export const addBusinesses = async (businesses: any[]): Promise<void> => {
  try {
    // Ensure the data directory exists
    await fs.ensureDir(DATA_DIR);
    
    console.log('Adding businesses to existing data...');
    
    // Get existing businesses
    const existingBusinesses = await getBusinesses();
    
    // Ensure each new business has a unique ID
    const processedBusinesses = businesses.map(business => ({
      ...business,
      id: business.id || uuidv4()
    }));
    
    // Combine existing and new businesses
    const allBusinesses = [...existingBusinesses, ...processedBusinesses];
    
    // Write the combined data to the businesses.json file
    await fs.writeJson(BUSINESSES_FILE, { businesses: allBusinesses }, { spaces: 2 });
    
    console.log('Businesses added successfully!');
  } catch (error) {
    console.error('Error adding businesses:', error);
    throw error;
  }
};

/**
 * Display the current businesses in the database
 */
export const listBusinesses = async (): Promise<void> => {
  try {
    const businesses = await getBusinesses();
    
    console.log('Current businesses in the database:');
    console.log(JSON.stringify(businesses, null, 2));
    console.log(`Total: ${businesses.length} businesses`);
  } catch (error) {
    console.error('Error listing businesses:', error);
    throw error;
  }
};

/**
 * Clear all businesses from the database
 */
export const clearBusinesses = async (): Promise<void> => {
  try {
    console.log('Clearing all businesses...');
    
    // Write an empty businesses array to the file
    await fs.writeJson(BUSINESSES_FILE, { businesses: [] }, { spaces: 2 });
    
    console.log('All businesses have been cleared!');
  } catch (error) {
    console.error('Error clearing businesses:', error);
    throw error;
  }
};

// If this file is run directly with a command argument
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const command = process.argv[2];
  
  switch (command) {
    case 'list':
      listBusinesses()
        .then(() => console.log('Listing completed'))
        .catch(err => console.error('Listing failed:', err));
      break;
    case 'clear':
      clearBusinesses()
        .then(() => console.log('Clearing completed'))
        .catch(err => console.error('Clearing failed:', err));
      break;
    default:
      console.log('Available commands:');
      console.log('- list: Display all businesses in the database');
      console.log('- clear: Remove all businesses from the database');
      console.log('To import custom data, create your own script and import the importCustomData or addBusinesses functions');
  }
} 