import { importCustomData, addBusinesses, clearBusinesses, listBusinesses } from '../utils/importCustomData.js';

// Sample business data
const sampleBusinesses = [
  {
    name: 'The Coffee Spot',
    ownerEmail: 'coffee@example.com',
    businessType: 'restaurant',
    description: 'A cozy coffee shop with a wide selection of specialty coffees and pastries.',
    location: '123 Main Street',
    contactInfo: '555-123-4567',
    rating: 4.7,
    photos: [
      'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '7:00 AM - 6:00 PM',
      tuesday: '7:00 AM - 6:00 PM',
      wednesday: '7:00 AM - 6:00 PM',
      thursday: '7:00 AM - 6:00 PM',
      friday: '7:00 AM - 7:00 PM',
      saturday: '8:00 AM - 7:00 PM',
      sunday: '8:00 AM - 5:00 PM'
    },
    menu: [
      {
        id: 'c1',
        name: 'House Blend Coffee',
        description: 'Our signature medium roast coffee',
        price: 3.50,
        category: 'Beverages',
        photo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'c2',
        name: 'Espresso',
        description: 'Strong, concentrated coffee',
        price: 2.75,
        category: 'Beverages',
        photo: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'c3',
        name: 'Chocolate Croissant',
        description: 'Buttery croissant with chocolate filling',
        price: 3.25,
        category: 'Pastries',
        photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    name: 'Student Bookstore',
    ownerEmail: 'books@example.com',
    businessType: 'store',
    description: 'Textbooks, study materials, and school supplies for university students.',
    location: '456 University Avenue',
    contactInfo: '555-987-6543',
    rating: 4.3,
    photos: [
      'https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
    ],
    businessHours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: '10:00 AM - 5:00 PM',
      sunday: 'Closed'
    },
    items: [
      {
        id: 'b1',
        name: 'Calculus Textbook',
        description: 'Calculus: Early Transcendentals, 8th Edition',
        price: 149.99,
        category: 'Textbooks',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1530465548484-4a88188c41e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'b2',
        name: 'Scientific Calculator',
        description: 'Advanced scientific calculator with graphing capabilities',
        price: 79.99,
        category: 'Supplies',
        inStock: true,
        photo: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
      }
    ]
  }
];

// Command line argument parsing
const command = process.argv[2];

const runCommand = async () => {
  try {
    switch (command) {
      case 'import':
        // Replace all existing data with sample data
        await importCustomData(sampleBusinesses);
        break;
      case 'add':
        // Add sample data to existing data
        await addBusinesses(sampleBusinesses);
        break;
      case 'list':
        // List all businesses in the database
        await listBusinesses();
        break;
      case 'clear':
        // Clear all businesses from the database
        await clearBusinesses();
        break;
      default:
        console.log('Available commands:');
        console.log('- import: Replace all businesses with sample data');
        console.log('- add: Add sample businesses to existing data');
        console.log('- list: Display all businesses in the database');
        console.log('- clear: Remove all businesses from the database');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

runCommand();

/*
  HOW TO USE THIS SCRIPT:
  
  1. First, make sure your server is not running or the data files might be locked
  2. Run one of the following commands:

     # To replace all data with sample data:
     npx tsx src/scripts/importSampleData.ts import
     
     # To add sample data to existing data:
     npx tsx src/scripts/importSampleData.ts add
     
     # To list all businesses currently in the database:
     npx tsx src/scripts/importSampleData.ts list
     
     # To clear all businesses from the database:
     npx tsx src/scripts/importSampleData.ts clear
     
  3. To create your own data, modify the sampleBusinesses array in this file
     or create a new script following this pattern.
*/ 