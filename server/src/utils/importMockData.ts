import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { mockBusinesses } from '../data/mockData.js';

// Define __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to data files
const DATA_DIR = path.resolve(__dirname, '../../../data');
const BUSINESSES_FILE = path.join(DATA_DIR, 'businesses.json');

/**
 * Imports mock data from the local server mock data file
 */
export const importMockData = async (): Promise<void> => {
  try {
    // Ensure the data directory exists
    await fs.ensureDir(DATA_DIR);
    
    console.log('Importing mock data...');
    
    // Write the mock data to the businesses.json file
    await fs.writeJson(BUSINESSES_FILE, { businesses: mockBusinesses }, { spaces: 2 });
    
    console.log('Mock data imported successfully!');
  } catch (error) {
    console.error('Error importing mock data:', error);
    throw error;
  }
};

// If this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  importMockData()
    .then(() => console.log('Import completed'))
    .catch(err => console.error('Import failed:', err));
} 