import express, { Request, Response } from 'express';
import {
  getUsers,
  getUserByEmail,
  createUser,
  getBusinessAccountByEmail,
  createBusinessAccount,
  getBusinessById,
  getBusinessByOwnerEmail,
  createBusiness
} from '../utils/mongoUtils.js';
import { User, BusinessAccount, Business } from '../models/types.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    
    // Validate required fields
    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const users = await getUsers();
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Also check if this email is used by a business account
    const existingBusinessAccount = await getBusinessAccountByEmail(email);
    if (existingBusinessAccount) {
      return res.status(400).json({ message: 'This email is already used by a business account' });
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      firstName,
      lastName,
      role: 'student', // Now we only have student role for users
      password // In a real app, you would hash this password
    };
    
    const createdUser = await createUser(newUser);
    
    // Don't return the password to the client
    const { password: _, ...userWithoutPassword } = createdUser;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register a new business account
router.post('/business-register', async (req: Request, res: Response) => {
  try {
    const { email, password, businessId, businessName, businessType, location, contactInfo, description } = req.body;
    
    // Validate required fields
    if (!email || !password || !businessName) {
      return res.status(400).json({ message: 'Email, password, and business name are required' });
    }
    
    // Check if business account already exists
    const existingBusinessAccount = await getBusinessAccountByEmail(email);
    if (existingBusinessAccount) {
      return res.status(400).json({ message: 'Business account already exists with this email' });
    }
    
    // Check if regular user exists with this email
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already used by a regular user account' });
    }
    
    // Create business ID if not provided
    const newBusinessId = businessId || uuidv4();
    
    // Create the business account
    const newBusinessAccount: BusinessAccount = {
      id: uuidv4(),
      email,
      password, // In a real app, you would hash this password
      businessId: newBusinessId
    };
    
    const createdBusinessAccount = await createBusinessAccount(newBusinessAccount);
    
    // Don't return the password to the client
    const { password: _, ...accountWithoutPassword } = createdBusinessAccount;
    
    // Create or update the associated business
    let business = await getBusinessById(newBusinessId);
    
    if (!business) {
      // Create a new business record
      console.log(`Creating new business record for ${businessName}`);
      const newBusiness: Business = {
        id: newBusinessId,
        name: businessName,
        ownerEmail: email,
        businessType: businessType || 'store',
        description: description || '',
        location: location || '',
        contactInfo: contactInfo || '',
        rating: 0,
        reviews: [],
        photos: [],
        businessHours: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: '10:00 AM - 3:00 PM',
          sunday: 'Closed'
        }
      };
      
      business = await createBusiness(newBusiness);
      console.log(`Business record created with ID: ${business.id}`);
    }
    
    res.status(201).json({
      message: 'Business account registered successfully',
      businessAccount: accountWithoutPassword,
      businessId: newBusinessId,
      business: business
    });
    
  } catch (error) {
    console.error('Error registering business account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login for regular users
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    console.log(`User login attempt for email: ${email}`);
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      console.log(`User login failed: No user found with email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords (in a real app, would use bcrypt.compare)
    if (user.password !== password) {
      console.log(`User login failed: Incorrect password for ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Prepare user data for response
    // Convert MongoDB _id to string id if needed
    const userData = {
      ...user,
      // Ensure id is always a string, prefer the custom id field but fall back to MongoDB _id
      id: (user.id || (user as any)._id?.toString()),
      // Make sure firstName and lastName are not null or undefined
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      // Add MongoDB _id as a separate field for compatibility
      _id: (user as any)._id?.toString()
    };
    
    // Remove sensitive data
    delete userData.password;
    
    console.log(`User login successful for ${email}, user ID: ${userData.id}`);
    
    res.status(200).json({ 
      user: userData,
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login for business accounts
router.post('/business-login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    console.log(`Business login attempt for email: ${email}`);
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find business account by email
    const businessAccount = await getBusinessAccountByEmail(email);
    if (!businessAccount) {
      console.log(`Business login failed: No business account found with email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Compare passwords (in a real app, would use bcrypt.compare)
    if (businessAccount.password !== password) {
      console.log(`Business login failed: Incorrect password for ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Get associated business data
    const business = await getBusinessById(businessAccount.businessId);
    if (!business) {
      console.log(`Business not found for account with ID ${businessAccount.businessId}`);
      return res.status(404).json({ message: 'Business data not found' });
    }
    
    // Prepare business account data for response
    const accountData = {
      ...businessAccount,
      id: businessAccount.id || (businessAccount as any)._id?.toString(),
      _id: (businessAccount as any)._id?.toString()
    };
    
    // Remove sensitive data
    delete accountData.password;
    
    console.log(`Business login successful for ${email}, account ID: ${accountData.id}`);
    
    res.status(200).json({ 
      businessAccount: accountData,
      business: business,
      message: 'Business login successful' 
    });
  } catch (error) {
    console.error('Business login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 