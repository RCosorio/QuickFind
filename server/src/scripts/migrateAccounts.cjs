// CommonJS syntax
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const path = require('path');

// Setup environment variables
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quickfind';

async function migrateAccounts() {
  try {
    console.log('Starting migration of business users to BusinessAccount collection');
    
    // Connect to MongoDB
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully');
    
    // Get MongoDB collections directly
    const usersCollection = mongoose.connection.collection('users');
    const businessAccountsCollection = mongoose.connection.collection('businessaccounts');
    const businessesCollection = mongoose.connection.collection('businesses');
    
    // Find all business users (from before the migration)
    const businessUsers = await usersCollection.find({ role: 'business' }).toArray();
    console.log(`Found ${businessUsers.length} business users to migrate`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process each business user
    for (const user of businessUsers) {
      try {
        console.log(`\nProcessing user: ${user.email}`);
        
        // Check if this user already has a business account
        const existingAccount = await businessAccountsCollection.findOne({ email: user.email });
        if (existingAccount) {
          console.log(`Business account already exists for ${user.email}, skipping`);
          continue;
        }
        
        // Find the business associated with this user
        console.log(`Finding business for owner email: ${user.email}`);
        let business = await businessesCollection.findOne({ ownerEmail: user.email });
        
        let businessId;
        if (business) {
          console.log(`Found existing business: ${business.name} (${business.id})`);
          businessId = business.id;
        } else {
          console.log(`No business found for ${user.email}, creating placeholder business`);
          // Create a placeholder business if needed
          const newBusiness = {
            id: uuidv4(),
            name: `${user.firstName}'s Business`,
            ownerEmail: user.email,
            businessType: 'store', // Default value
            description: 'Business migrated from user account',
            location: 'Not specified',
            contactInfo: user.email,
            reviews: [],
            rating: 0
          };
          
          const result = await businessesCollection.insertOne(newBusiness);
          if (!result.acknowledged) {
            throw new Error('Failed to create business');
          }
          
          businessId = newBusiness.id;
          console.log(`Created placeholder business with ID: ${businessId}`);
        }
        
        // Create business account
        const businessAccount = {
          id: uuidv4(),
          email: user.email,
          password: user.password, // Reuse password from user account
          businessId: businessId
        };
        
        const acctResult = await businessAccountsCollection.insertOne(businessAccount);
        if (!acctResult.acknowledged) {
          throw new Error('Failed to create business account');
        }
        
        console.log(`Created business account: ${businessAccount.id} for business: ${businessId}`);
        
        // Update user account or delete it based on preference
        // Option 1: Delete the business user from User collection
        // await usersCollection.deleteOne({ _id: user._id });
        // console.log(`Deleted user ${user.email} from User collection`);
        
        // Option 2: Mark as migrated (safer option)
        const updateResult = await usersCollection.updateOne(
          { _id: user._id },
          { $set: { role: 'student', migrated: true } }
        );
        
        if (updateResult.modifiedCount === 1) {
          console.log(`Updated user ${user.email} role to 'student' and marked as migrated`);
        } else {
          console.log(`Warning: Failed to update user ${user.email}`);
        }
        
        successCount++;
      } catch (err) {
        console.error(`Error migrating user ${user.email}:`, err);
        errorCount++;
      }
    }
    
    console.log('\n=== Migration Complete ===');
    console.log(`Total business users found: ${businessUsers.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    
    return { success: true, message: 'Migration completed' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: error.message };
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
}

// Execute the migration
migrateAccounts()
  .then(result => {
    console.log(`Migration ${result.success ? 'successful' : 'failed'}: ${result.message}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Unhandled error during migration:', err);
    process.exit(1);
  }); 