import express, { Request, Response } from 'express';
import { getUsers, createUser } from '../utils/fileUtils.js';
import { User } from '../models/types.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password, role } = req.body;
    
    // Validate required fields
    if (!email || !firstName || !lastName || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const users = await getUsers();
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      firstName,
      lastName,
      role,
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

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Don't return the password to the client
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 