const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const path = require('path');

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

// Seed database with initial data
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to the database
    const mongoose = await connectDB();
    
    // Get MongoDB collections
    const usersCollection = mongoose.connection.collection('users');
    const businessesCollection = mongoose.connection.collection('businesses');
    const reviewsCollection = mongoose.connection.collection('reviews');
    
    // Create sample users
    console.log('Creating sample users...');
    const users = [
      {
        id: uuidv4(),
        email: 'student@example.com',
        firstName: 'Student',
        lastName: 'User',
        role: 'student',
        password: '123123'
      },
      {
        id: uuidv4(),
        email: 'store@example.com',
        firstName: 'Store',
        lastName: 'Owner',
        role: 'business',
        password: '123123'
      },
      {
        id: uuidv4(),
        email: 'restaurant@example.com',
        firstName: 'Restaurant',
        lastName: 'Owner',
        role: 'business',
        password: '123123'
      },
      {
        id: uuidv4(),
        email: 'housing@example.com',
        firstName: 'Housing',
        lastName: 'Owner',
        role: 'business',
        password: '123123'
      }
    ];
    
    // Save users to database
    const userResult = await usersCollection.insertMany(users);
    console.log(`Created ${userResult.insertedCount} users`);
    
    // Map for storing user IDs by email for reference
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user.id;
    });
    
    // Create sample businesses
    console.log('Creating sample businesses...');
    const businesses = [
      {
        id: uuidv4(),
        name: 'Campus Bookstore',
        ownerEmail: 'store@example.com',
        businessType: 'store',
        description: 'The best campus bookstore with all your academic needs.',
        location: '123 University Ave',
        contactInfo: '555-123-4567',
        rating: 0,
        reviews: [],
        photos: [
          'https://images.unsplash.com/photo-1603818001865-a531f4503b38',
          'https://images.unsplash.com/photo-1612599316791-451087e8f517'
        ],
        businessHours: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: '10:00 AM - 3:00 PM',
          sunday: 'Closed'
        },
        items: [
          {
            id: uuidv4(),
            name: 'University Textbook',
            description: 'Standard textbook for introductory courses.',
            price: 59.99,
            category: 'Books',
            inStock: true
          },
          {
            id: uuidv4(),
            name: 'School Notebook',
            description: 'High-quality notebook for your notes.',
            price: 4.99,
            category: 'Supplies',
            inStock: true
          },
          {
            id: uuidv4(),
            name: 'University Hoodie',
            description: 'Comfortable hoodie with university logo.',
            price: 39.99,
            category: 'Apparel',
            inStock: true
          }
        ]
      },
      {
        id: uuidv4(),
        name: 'Campus Café',
        ownerEmail: 'restaurant@example.com',
        businessType: 'restaurant',
        description: 'Delicious food and beverages for students and faculty.',
        location: '456 College St',
        contactInfo: '555-987-6543',
        rating: 0,
        reviews: [],
        photos: [
          'https://images.unsplash.com/photo-1559925393-8be0ec4767c8',
          'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56'
        ],
        businessHours: {
          monday: '7:00 AM - 8:00 PM',
          tuesday: '7:00 AM - 8:00 PM',
          wednesday: '7:00 AM - 8:00 PM',
          thursday: '7:00 AM - 8:00 PM',
          friday: '7:00 AM - 9:00 PM',
          saturday: '8:00 AM - 9:00 PM',
          sunday: '8:00 AM - 6:00 PM'
        },
        menu: [
          {
            id: uuidv4(),
            name: 'Breakfast Sandwich',
            description: 'Egg and cheese on a freshly baked croissant.',
            price: 5.99,
            category: 'Breakfast',
            available: true
          },
          {
            id: uuidv4(),
            name: 'Chicken Caesar Wrap',
            description: 'Grilled chicken with romaine lettuce and caesar dressing.',
            price: 8.99,
            category: 'Lunch',
            available: true
          },
          {
            id: uuidv4(),
            name: 'Coffee',
            description: 'Freshly brewed coffee.',
            price: 2.49,
            category: 'Beverages',
            available: true
          }
        ]
      },
      {
        id: uuidv4(),
        name: 'Student Housing Complex',
        ownerEmail: 'housing@example.com',
        businessType: 'housing',
        description: 'Affordable and comfortable housing options for students.',
        location: '789 Dorm Road',
        contactInfo: '555-456-7890',
        rating: 0,
        reviews: [],
        photos: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
          'https://images.unsplash.com/photo-1560448204-603b3fc33ddc'
        ],
        businessHours: {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: '10:00 AM - 2:00 PM',
          sunday: 'Closed'
        },
        rooms: [
          {
            id: uuidv4(),
            name: 'Studio Apartment',
            description: 'Cozy studio apartment with all utilities included.',
            price: 650,
            bedrooms: 1,
            bathrooms: 1,
            available: true,
            amenities: ['WiFi', 'Heating', 'Air Conditioning', 'Laundry']
          },
          {
            id: uuidv4(),
            name: 'Two Bedroom Suite',
            description: 'Spacious two bedroom apartment perfect for roommates.',
            price: 950,
            bedrooms: 2,
            bathrooms: 1,
            available: true,
            amenities: ['WiFi', 'Heating', 'Air Conditioning', 'Laundry', 'Parking']
          },
          {
            id: uuidv4(),
            name: 'Deluxe Single Room',
            description: 'Private room in a shared house with access to common areas.',
            price: 550,
            bedrooms: 1,
            bathrooms: 1,
            available: true,
            amenities: ['WiFi', 'Heating', 'Shared Kitchen', 'Shared Living Room']
          }
        ]
      }
    ];
    
    // Save businesses to database
    const businessResult = await businessesCollection.insertMany(businesses);
    console.log(`Created ${businessResult.insertedCount} businesses`);
    
    // Map for storing business IDs by name for reference
    const businessMap = {};
    businesses.forEach(business => {
      businessMap[business.name] = business.id;
    });
    
    // Create sample reviews
    console.log('Creating sample reviews...');
    const studentId = userMap['student@example.com'];
    
    // Get current date
    const today = new Date().toISOString().split('T')[0];
    
    const reviews = [
      {
        id: uuidv4(),
        userId: studentId,
        userName: 'Student User',
        rating: 4,
        comment: 'Great selection of textbooks and supplies! Prices are reasonable for a campus store.',
        date: today,
        businessId: businessMap['Campus Bookstore']
      },
      {
        id: uuidv4(),
        userId: studentId,
        userName: 'Student User',
        rating: 5,
        comment: 'The breakfast sandwiches are amazing! Highly recommend this place for a quick bite between classes.',
        date: today,
        businessId: businessMap['Campus Café']
      },
      {
        id: uuidv4(),
        userId: studentId,
        userName: 'Student User',
        comment: 'Do you have any single rooms available for the upcoming semester?',
        date: today,
        businessId: businessMap['Student Housing Complex']
      }
    ];
    
    // Save reviews to database
    const reviewResult = await reviewsCollection.insertMany(reviews);
    console.log(`Created ${reviewResult.insertedCount} reviews`);
    
    // Update businesses with reviews and ratings
    console.log('Updating businesses with reviews and ratings...');
    for (const review of reviews) {
      // Find business by ID
      const business = await businessesCollection.findOne({ id: review.businessId });
      
      if (!business) {
        console.log(`Business with ID ${review.businessId} not found, skipping`);
        continue;
      }
      
      // Initialize reviews array if it doesn't exist
      if (!business.reviews) {
        business.reviews = [];
      }
      
      // Add review to business
      business.reviews.push(review);
      
      // Calculate rating if the review has a rating
      if (review.rating) {
        // Get all reviews with ratings
        const reviewsWithRatings = business.reviews.filter(r => r.rating !== undefined);
        
        // Calculate average rating
        if (reviewsWithRatings.length > 0) {
          const totalRating = reviewsWithRatings.reduce((sum, r) => sum + (r.rating || 0), 0);
          business.rating = totalRating / reviewsWithRatings.length;
        }
      }
      
      // Update business in database
      await businessesCollection.updateOne(
        { id: business.id },
        { $set: { reviews: business.reviews, rating: business.rating } }
      );
      
      console.log(`Updated business "${business.name}" with review`);
    }
    
    console.log('Database seeding completed successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    
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
seedDatabase(); 