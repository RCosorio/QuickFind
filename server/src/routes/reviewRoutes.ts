import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getReviewById,
  getReviewsByBusinessId,
  createReview,
  updateReview,
  deleteReview,
  getBusinessById, 
  updateBusiness,
  getReviews
} from '../utils/mongoUtils.js';
import { Review } from '../models/types.js';

const router = express.Router();

// Get all reviews
router.get('/', async (_req: Request, res: Response) => {
  try {
    const reviews = await getReviews();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a specific business
router.get('/business/:businessId', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const businessReviews = await getReviewsByBusinessId(businessId);
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
    
    console.log('Review submission request received:');
    console.log('Business ID:', businessId);
    console.log('Request body:', req.body);
    console.log('User ID:', userId, 'Type:', typeof userId);
    console.log('User Name:', userName, 'Type:', typeof userName);
    console.log('Comment:', comment, 'Type:', typeof comment);
    console.log('Rating:', rating, 'Type:', typeof rating);
    
    // Validate required fields (rating is now optional)
    if (!userId || !userName || !comment) {
      console.log('Validation failed:', { 
        hasUserId: !!userId, 
        hasUserName: !!userName, 
        hasComment: !!comment 
      });
      return res.status(400).json({ 
        message: 'User ID, name, and comment are required',
        received: { userId, userName, comment }
      });
    }
    
    // Check if business exists
    const business = await getBusinessById(businessId);
    if (!business) {
      console.log(`Business not found with ID: ${businessId}`);
      return res.status(404).json({ message: 'Business not found' });
    }
    
    console.log('Business found:', business.name);
    
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
    
    console.log('New review object created:', newReview);
    
    // Save review to MongoDB Review collection
    const savedReview = await createReview(newReview);
    console.log('Review saved to MongoDB Review collection:', savedReview.id);
    
    // Initialize business reviews array if it doesn't exist
    if (!business.reviews) {
      business.reviews = [];
    }
    
    // Check if the review already exists in the business to avoid duplicates
    const existingReviewIndex = business.reviews.findIndex(r => r.id === newReview.id);
    if (existingReviewIndex !== -1) {
      // Replace the existing review
      console.log(`Review with ID ${newReview.id} already exists in business, replacing it`);
      business.reviews[existingReviewIndex] = newReview;
    } else {
      // Add the new review to the business
      business.reviews.push(newReview);
      console.log(`Added new review with ID ${newReview.id} to business`);
    }
    
    // Update business rating - only count reviews with ratings
    const reviewsWithRatings = business.reviews.filter(review => review.rating !== undefined);
    
    // Calculate average rating if there are reviews with ratings
    if (reviewsWithRatings.length > 0) {
      const totalRating = reviewsWithRatings.reduce((sum, review) => sum + (review.rating || 0), 0);
      business.rating = totalRating / reviewsWithRatings.length;
      console.log(`Calculated new rating for business: ${business.rating.toFixed(1)}`);
    } else {
      business.rating = 0;
      console.log('No rated reviews, setting business rating to 0');
    }
    
    console.log(`Updating business with new review. New rating: ${business.rating}`);
    console.log(`Business now has ${business.reviews.length} reviews`);
    
    // Update business in MongoDB with explicit fields to update
    const updatedBusiness = await updateBusiness(businessId, { 
      reviews: business.reviews,
      rating: business.rating 
    });
    
    if (!updatedBusiness) {
      console.error('Business update failed after adding review');
      // Still return success for the review since it was saved to the Review collection
    } else {
      console.log(`Business updated with review. Now has ${updatedBusiness.reviews?.length || 0} reviews`);
    }
    
    // Fetch the updated business to verify
    const verifiedBusiness = await getBusinessById(businessId);
    console.log(`Verification: Updated business has ${verifiedBusiness?.reviews?.length || 0} reviews`);
    
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
});

// Delete a review
router.delete('/:reviewId', async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    
    // Get review from MongoDB
    const review = await getReviewById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const businessId = review.businessId;
    
    // Delete review from MongoDB
    await deleteReview(reviewId);
    
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
      
      // Update business in MongoDB
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
    
    // Get review from MongoDB
    const review = await getReviewById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if review belongs to the business
    if (review.businessId !== businessId) {
      return res.status(403).json({ message: 'This review does not belong to your business' });
    }
    
    // Check if review already has a reply
    if (review.ownerReply) {
      return res.status(400).json({ message: 'You have already replied to this review' });
    }
    
    // Add reply to review in MongoDB
    const updatedReview = await updateReview(reviewId, {
      ownerReply: reply,
      ownerReplyDate: new Date().toISOString().split('T')[0] // Format as YYYY-MM-DD
    });
    
    // Update business reviews as well
    if (business.reviews) {
      const businessReviewIndex = business.reviews.findIndex(r => r.id === reviewId);
      if (businessReviewIndex !== -1) {
        business.reviews[businessReviewIndex].ownerReply = reply;
        business.reviews[businessReviewIndex].ownerReplyDate = updatedReview?.ownerReplyDate;
        
        // Update business in MongoDB
        await updateBusiness(businessId, { reviews: business.reviews });
      }
    }
    
    res.status(200).json(updatedReview);
  } catch (error) {
    console.error('Error adding reply to review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 