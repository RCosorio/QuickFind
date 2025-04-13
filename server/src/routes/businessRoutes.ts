import express, { Request, Response } from 'express';
import {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getBusinessByOwnerEmail
} from '../utils/mongoUtils.js';
import { Business } from '../models/types.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all businesses
router.get('/', async (req: Request, res: Response) => {
  try {
    const businesses = await getBusinesses();
    res.status(200).json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
  
// Get business by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const business = await getBusinessById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.status(200).json(business);
  } catch (error) {
    console.error('Error fetching business:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new business
router.post('/', async (req: Request, res: Response) => {
  try {
    const businessData = req.body;
    const newBusiness: Business = {
      ...businessData,
      id: uuidv4()
    };
    
    const createdBusiness = await createBusiness(newBusiness);
    res.status(201).json(createdBusiness);
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update business
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedBusiness = await updateBusiness(req.params.id, req.body);
    if (!updatedBusiness) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.status(200).json(updatedBusiness);
  } catch (error) {
    console.error('Error updating business:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete business
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedBusiness = await deleteBusiness(req.params.id);
    if (!deletedBusiness) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (error) {
    console.error('Error deleting business:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get business by owner email
router.get('/owner/:email', async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    console.log(`Fetching business by owner email: ${email}`);
    
    const business = await getBusinessByOwnerEmail(email);
    if (!business) {
      return res.status(404).json({ message: 'No business found for this owner' });
    }
    
    res.status(200).json(business);
  } catch (error) {
    console.error('Error fetching business by owner email:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 