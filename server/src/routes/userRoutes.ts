import express, { Request, Response } from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getReviews,
  updateReview
} from '../utils/mongoUtils.js';
import { Review } from '../models/types.js';

const router = express.Router();

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
    const { id } = req.params;
    const { firstName, lastName } = req.body;
    
    console.log(`Updating user ${id} with:`, req.body);
    
    // Validate required fields
    if (!firstName && !lastName) {
      console.log('Update rejected: No valid fields provided');
      return res.status(400).json({ message: 'Please provide at least one field to update' });
    }
    
    // Check if user exists
    const user = await getUserById(id);
    if (!user) {
      console.log(`Update failed: User with ID ${id} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create update payload
    const updateData: { firstName?: string; lastName?: string } = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    
    // Update user
    const updatedUser = await updateUser(id, updateData);
    
    // Don't return the password to the client
    if (updatedUser && updatedUser.password) {
      const { password, ...userWithoutPassword } = updatedUser;
      console.log(`User ${id} updated successfully`);
      return res.status(200).json(userWithoutPassword);
    }
    
    console.log(`User ${id} updated successfully`);
    res.status(200).json(updatedUser);
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
    const reviews = await getReviews();
    
    // Update any reviews by this user to anonymize them
    for (const review of reviews) {
      if (review.userId === req.params.id) {
        // Keep the review but mark it as from a deleted account
        await updateReview(review.id, { userName: 'Deleted User' });
      }
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