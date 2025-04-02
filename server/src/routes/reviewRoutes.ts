import express, { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { ReviewData, Review } from '../models/types.js';
import { v4 as uuidv4 } from 'uuid';
import { getBusinessById, updateBusiness } from '../utils/fileUtils.js';

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

// Get all reviews
router.get('/', async (_req: Request, res: Response) => {
  try {
    const data = await readReviewsFile();
    res.status(200).json(data.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a specific business
router.get('/business/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const data = await readReviewsFile();
    const businessReviews = data.reviews.filter(review => review.businessId === businessId);
    res.status(200).json(businessReviews);
  } catch (error) {
    console.error('Error fetching business reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a review for a business
router.post('/business/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const { userId, userName, rating, comment } = req.body;
    
    // Validate required fields (rating is now optional)
    if (!userId || !userName || !comment) {
      return res.status(400).json({ message: 'User ID, name, and comment are required' });
    }
    
    // Check if business exists
    const business = await getBusinessById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    // Create new review
    const newReview: Review = {
      id: uuidv4(),
      userId,
      userName,
      comment,
      date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
      businessId
    };
    
    // Add rating if it was provided
    if (rating !== undefined) {
      newReview.rating = Number(rating);
    }
    
    // Add review to reviews file
    const reviewsData = await readReviewsFile();
    reviewsData.reviews.push(newReview);
    await writeReviewsFile(reviewsData);
    
    // Update business with new review
    if (!business.reviews) {
      business.reviews = [];
    }
    business.reviews.push(newReview);
    
    // Update business rating - only count reviews with ratings
    const reviewsWithRatings = business.reviews.filter(review => review.rating !== undefined);
    
    // Calculate average rating if there are reviews with ratings
    if (reviewsWithRatings.length > 0) {
      const totalRating = reviewsWithRatings.reduce((sum, review) => sum + (review.rating || 0), 0);
      business.rating = totalRating / reviewsWithRatings.length;
    } else {
      business.rating = 0;
    }
    
    // Update business in file
    await updateBusiness(businessId, { 
      reviews: business.reviews,
      rating: business.rating 
    });
    
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a review
router.delete('/:reviewId', async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    
    // Get review data
    const reviewsData = await readReviewsFile();
    const reviewIndex = reviewsData.reviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const review = reviewsData.reviews[reviewIndex];
    const businessId = review.businessId;
    
    // Remove review from reviews file
    reviewsData.reviews.splice(reviewIndex, 1);
    await writeReviewsFile(reviewsData);
    
    // Update business
    const business = await getBusinessById(businessId);
    if (business && business.reviews) {
      // Remove review from business
      business.reviews = business.reviews.filter(r => r.id !== reviewId);
      
      // Update business rating - only count reviews with ratings
      const reviewsWithRatings = business.reviews.filter(review => review.rating !== undefined);
      
      // Calculate average rating if there are reviews with ratings
      if (reviewsWithRatings.length > 0) {
        const totalRating = reviewsWithRatings.reduce((sum, review) => sum + (review.rating || 0), 0);
        business.rating = totalRating / reviewsWithRatings.length;
      } else {
        business.rating = 0;
      }
      
      // Update business in file
      await updateBusiness(businessId, { 
        reviews: business.reviews,
        rating: business.rating 
      });
    }
    
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a business owner reply to a review
router.post('/:reviewId/reply', async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { businessId, businessOwnerEmail, reply } = req.body;
    
    // Validate required fields
    if (!businessId || !businessOwnerEmail || !reply) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if business exists and the requestor is the owner
    const business = await getBusinessById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    
    if (business.ownerEmail !== businessOwnerEmail) {
      return res.status(403).json({ message: 'Only the business owner can reply to reviews' });
    }
    
    // Get review data
    const reviewsData = await readReviewsFile();
    const reviewIndex = reviewsData.reviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if review belongs to the business
    if (reviewsData.reviews[reviewIndex].businessId !== businessId) {
      return res.status(403).json({ message: 'This review does not belong to your business' });
    }
    
    // Check if review already has a reply
    if (reviewsData.reviews[reviewIndex].ownerReply) {
      return res.status(400).json({ message: 'You have already replied to this review' });
    }
    
    // Add reply to review
    reviewsData.reviews[reviewIndex].ownerReply = reply;
    reviewsData.reviews[reviewIndex].ownerReplyDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Save changes
    await writeReviewsFile(reviewsData);
    
    // Update business reviews as well
    if (business.reviews) {
      const businessReviewIndex = business.reviews.findIndex(r => r.id === reviewId);
      if (businessReviewIndex !== -1) {
        business.reviews[businessReviewIndex].ownerReply = reply;
        business.reviews[businessReviewIndex].ownerReplyDate = reviewsData.reviews[reviewIndex].ownerReplyDate;
        
        // Update business in file
        await updateBusiness(businessId, { reviews: business.reviews });
      }
    }
    
    res.status(200).json(reviewsData.reviews[reviewIndex]);
  } catch (error) {
    console.error('Error adding reply to review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 