import express, { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser
} from '../utils/fileUtils.js';
import { ReviewData } from '../models/types.js';

// Define __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to review data file
const DATA_DIR = path.resolve(__dirname, '../../../data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

const router = express.Router();

// Read reviews data
const readReviewsFile = async (): Promise<ReviewData> => {
  try {
    const data = await fs.readJson(REVIEWS_FILE) as ReviewData;
    return data;
  } catch (error) {
    console.error('Error reading reviews file:', error);
    throw error;
  }
};

// Write reviews data
const writeReviewsFile = async (data: ReviewData): Promise<void> => {
  try {
    await fs.writeJson(REVIEWS_FILE, data, { spaces: 2 });
  } catch (error) {
    console.error('Error writing reviews file:', error);
    throw error;
  }
};

// Get all users (for admin purposes, in a real app this would be protected)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await getUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { password, email, ...updateData } = req.body;
    
    // Don't allow email updates as per requirement
    
    const updatedUser = await updateUser(req.params.id, updateData);
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/:id/password', async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Get user
    const user = await getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    if (user.password !== currentPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    const updatedUser = await updateUser(req.params.id, { password: newPassword });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user but keep their reviews
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    
    // Get user
    const user = await getUserById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify password
    if (password && user.password !== password) {
      return res.status(401).json({ message: 'Password is incorrect' });
    }
    
    // Update reviews to anonymize them
    const reviewsData = await readReviewsFile();
    let reviewsUpdated = false;
    
    for (let i = 0; i < reviewsData.reviews.length; i++) {
      if (reviewsData.reviews[i].userId === req.params.id) {
        // Keep the review but mark it as from a deleted account
        reviewsData.reviews[i].userName = 'Deleted User';
        reviewsUpdated = true;
      }
    }
    
    // Save updates to reviews if needed
    if (reviewsUpdated) {
      await writeReviewsFile(reviewsData);
    }
    
    // Delete the user
    const deletedUser = await deleteUser(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User account deleted successfully, but reviews were preserved' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 