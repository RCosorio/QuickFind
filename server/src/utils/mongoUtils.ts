import { 
  Business, 
  User, 
  Review,
  BusinessAccount,
  BusinessData, 
  UserData, 
  ReviewData
} from '../models/types.js';
import { BusinessModel } from '../models/mongodb/Business.js';
import { UserModel } from '../models/mongodb/User.js';
import { ReviewModel } from '../models/mongodb/Review.js';
import { BusinessAccountModel } from '../models/mongodb/BusinessAccount.js';

// Business functions
export const getBusinesses = async (): Promise<Business[]> => {
  try {
    console.log('Fetching all businesses');
    const businesses = await BusinessModel.find();
    console.log(`Retrieved ${businesses.length} businesses`);
    
    // Fetch all reviews to ensure they're populated correctly
    const reviews = await ReviewModel.find();
    console.log(`Also fetched ${reviews.length} total reviews for populating businesses`);
    
    // Make sure each business has its reviews
    const businessesWithReviews = businesses.map(business => {
      if (!business.reviews) {
        business.reviews = [];
      }
      
      // Add reviews for this business from the reviews collection
      const businessReviews = reviews.filter(review => review.businessId === business.id);
      if (businessReviews.length > 0 && (!business.reviews.length || business.reviews.length < businessReviews.length)) {
        console.log(`Adding ${businessReviews.length} reviews to business ${business.id}`);
        business.reviews = businessReviews;
      }
      
      return business;
    });
    
    return businessesWithReviews;
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  try {
    console.log(`Fetching business with id: ${id}`);
    // First try with the 'id' field
    let business = await BusinessModel.findOne({ id });
    if (!business) {
      // If not found, try with MongoDB's _id
      console.log(`Business not found with id field, trying with _id`);
      try {
        business = await BusinessModel.findById(id);
      } catch (err) {
        console.log('Not a valid MongoDB ObjectId, skipping _id search');
      }
    }
    
    if (business) {
      console.log(`Found business: ${business.name}`);
      
      // Get reviews directly from ReviewModel to ensure we have all of them
      const reviews = await ReviewModel.find({ businessId: business.id });
      console.log(`Found ${reviews.length} reviews for business ${business.id} in the Reviews collection`);
      
      // Always update the business with the latest reviews from the Reviews collection
      console.log(`Updating business reviews with ${reviews.length} reviews from collection`);
      business.reviews = reviews;
      
      // Always update the business rating as well based on fetched reviews
      if (reviews.length > 0) {
        const reviewsWithRatings = reviews.filter(review => review.rating !== undefined);
        if (reviewsWithRatings.length > 0) {
          const totalRating = reviewsWithRatings.reduce((sum, review) => sum + (review.rating || 0), 0);
          business.rating = totalRating / reviewsWithRatings.length;
        }
      }
      
      // Log reviews details for debugging
      if (business.reviews && business.reviews.length > 0) {
        console.log(`Reviews for business ${id}:`, 
          business.reviews.map(r => ({ id: r.id, userName: r.userName, rating: r.rating }))
        );
      }
    } else {
      console.log(`No business found with id: ${id}`);
    }
    
    return business;
  } catch (error) {
    console.error(`Error fetching business ${id}:`, error);
    throw error;
  }
};

export const createBusiness = async (newBusiness: Business): Promise<Business> => {
  try {
    const business = new BusinessModel(newBusiness);
    return await business.save();
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
};

export const updateBusiness = async (id: string, updatedBusiness: Partial<Business>): Promise<Business | null> => {
  try {
    console.log(`Updating business ${id} with:`, JSON.stringify(updatedBusiness));
    
    // Check if we're updating reviews
    if (updatedBusiness.reviews) {
      console.log(`Updating business with ${updatedBusiness.reviews.length} reviews`);
      
      // Log reviews details for debugging
      if (updatedBusiness.reviews.length > 0) {
        console.log(`Review details being saved:`, 
          updatedBusiness.reviews.map(r => ({ id: r.id, userName: r.userName, rating: r.rating }))
        );
      }
      
      // Verify that all reviews have the required fields
      const validReviews = updatedBusiness.reviews.map(review => {
        // Ensure the review has all required fields
        if (!review.id || !review.userId || !review.userName || !review.comment || !review.date || !review.businessId) {
          console.warn('Review is missing required fields:', review);
        }
        return review;
      });
      
      // Update the reviews array
      updatedBusiness.reviews = validReviews;
    }
    
    // Use findOneAndUpdate with explicit fields to ensure we only update what we want
    const updateFields: any = {};
    
    // Only include fields that are provided in the updatedBusiness object
    if (updatedBusiness.name) updateFields.name = updatedBusiness.name;
    if (updatedBusiness.description) updateFields.description = updatedBusiness.description;
    if (updatedBusiness.location) updateFields.location = updatedBusiness.location;
    if (updatedBusiness.contactInfo) updateFields.contactInfo = updatedBusiness.contactInfo;
    if (updatedBusiness.ownerEmail) updateFields.ownerEmail = updatedBusiness.ownerEmail;
    if (updatedBusiness.businessType) updateFields.businessType = updatedBusiness.businessType;
    if (updatedBusiness.photos) updateFields.photos = updatedBusiness.photos;
    if (updatedBusiness.businessHours) updateFields.businessHours = updatedBusiness.businessHours;
    if (updatedBusiness.menu) updateFields.menu = updatedBusiness.menu;
    if (updatedBusiness.items) updateFields.items = updatedBusiness.items;
    if (updatedBusiness.rooms) updateFields.rooms = updatedBusiness.rooms;
    
    // Special handling for reviews and rating to ensure they're properly updated
    if (updatedBusiness.reviews !== undefined) {
      updateFields.reviews = updatedBusiness.reviews;
    }
    if (updatedBusiness.rating !== undefined) {
      updateFields.rating = updatedBusiness.rating;
    }
    
    console.log('Final update fields:', Object.keys(updateFields));
    
    const business = await BusinessModel.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true }
    );
    
    if (business) {
      console.log(`Business updated successfully: ${business.name}`);
      console.log(`Business now has ${business.reviews?.length || 0} reviews after update`);
    } else {
      console.log(`No business found to update with id: ${id}`);
    }
    
    return business;
  } catch (error) {
    console.error(`Error updating business ${id}:`, error);
    throw error;
  }
};

export const deleteBusiness = async (id: string): Promise<Business | null> => {
  try {
    return await BusinessModel.findOneAndDelete({ id });
  } catch (error) {
    console.error(`Error deleting business ${id}:`, error);
    throw error;
  }
};

// User functions
export const getUsers = async (): Promise<User[]> => {
  try {
    return await UserModel.find();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    return await UserModel.findOne({ id });
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await UserModel.findOne({ email });
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
};

export const createUser = async (user: User): Promise<User> => {
  try {
    const newUser = new UserModel(user);
    return await newUser.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, updatedUser: Partial<User>): Promise<User | null> => {
  try {
    return await UserModel.findOneAndUpdate(
      { id },
      { $set: updatedUser },
      { new: true }
    );
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<User | null> => {
  try {
    return await UserModel.findOneAndDelete({ id });
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Business Account functions
export const getBusinessAccounts = async (): Promise<BusinessAccount[]> => {
  try {
    return await BusinessAccountModel.find();
  } catch (error) {
    console.error('Error fetching business accounts:', error);
    throw error;
  }
};

export const getBusinessAccountById = async (id: string): Promise<BusinessAccount | null> => {
  try {
    return await BusinessAccountModel.findOne({ id });
  } catch (error) {
    console.error(`Error fetching business account ${id}:`, error);
    throw error;
  }
};

export const getBusinessAccountByEmail = async (email: string): Promise<BusinessAccount | null> => {
  try {
    console.log(`Fetching business account with email: ${email}`);
    return await BusinessAccountModel.findOne({ email });
  } catch (error) {
    console.error(`Error fetching business account with email ${email}:`, error);
    throw error;
  }
};

export const getBusinessAccountByBusinessId = async (businessId: string): Promise<BusinessAccount | null> => {
  try {
    return await BusinessAccountModel.findOne({ businessId });
  } catch (error) {
    console.error(`Error fetching business account for business ${businessId}:`, error);
    throw error;
  }
};

export const createBusinessAccount = async (businessAccount: BusinessAccount): Promise<BusinessAccount> => {
  try {
    console.log('Creating new business account:', businessAccount.email);
    const newBusinessAccount = new BusinessAccountModel(businessAccount);
    return await newBusinessAccount.save();
  } catch (error) {
    console.error('Error creating business account:', error);
    throw error;
  }
};

export const updateBusinessAccount = async (id: string, updatedAccount: Partial<BusinessAccount>): Promise<BusinessAccount | null> => {
  try {
    return await BusinessAccountModel.findOneAndUpdate(
      { id },
      { $set: updatedAccount },
      { new: true }
    );
  } catch (error) {
    console.error(`Error updating business account ${id}:`, error);
    throw error;
  }
};

export const deleteBusinessAccount = async (id: string): Promise<BusinessAccount | null> => {
  try {
    return await BusinessAccountModel.findOneAndDelete({ id });
  } catch (error) {
    console.error(`Error deleting business account ${id}:`, error);
    throw error;
  }
};

// Review functions
export const getReviews = async (): Promise<Review[]> => {
  try {
    console.log('Fetching all reviews');
    const reviews = await ReviewModel.find();
    console.log(`Retrieved ${reviews.length} reviews`);
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getReviewsByBusinessId = async (businessId: string): Promise<Review[]> => {
  try {
    console.log(`Fetching reviews for business: ${businessId}`);
    const reviews = await ReviewModel.find({ businessId });
    console.log(`Found ${reviews.length} reviews for business ${businessId}`);
    return reviews;
  } catch (error) {
    console.error(`Error fetching reviews for business ${businessId}:`, error);
    throw error;
  }
};

export const getReviewById = async (id: string): Promise<Review | null> => {
  try {
    return await ReviewModel.findOne({ id });
  } catch (error) {
    console.error(`Error fetching review ${id}:`, error);
    throw error;
  }
};

export const createReview = async (review: Review): Promise<Review> => {
  try {
    console.log('Creating new review:', JSON.stringify(review));
    const newReview = new ReviewModel(review);
    const savedReview = await newReview.save();
    console.log('Review saved successfully:', savedReview.id);
    return savedReview;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const updateReview = async (id: string, updatedReview: Partial<Review>): Promise<Review | null> => {
  try {
    return await ReviewModel.findOneAndUpdate(
      { id },
      { $set: updatedReview },
      { new: true }
    );
  } catch (error) {
    console.error(`Error updating review ${id}:`, error);
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<Review | null> => {
  try {
    return await ReviewModel.findOneAndDelete({ id });
  } catch (error) {
    console.error(`Error deleting review ${id}:`, error);
    throw error;
  }
};

export const getBusinessByOwnerEmail = async (email: string): Promise<Business | null> => {
  try {
    console.log(`Fetching business with owner email: ${email}`);
    const business = await BusinessModel.findOne({ ownerEmail: email });
    
    if (business) {
      console.log(`Found business: ${business.name} for owner: ${email}`);
      
      // Get reviews for this business
      const reviews = await ReviewModel.find({ businessId: business.id });
      if (reviews.length > 0) {
        console.log(`Found ${reviews.length} reviews for business ${business.id}`);
        business.reviews = reviews;
        
        // Update rating
        const reviewsWithRatings = reviews.filter(review => review.rating !== undefined);
        if (reviewsWithRatings.length > 0) {
          const totalRating = reviewsWithRatings.reduce((sum, review) => sum + (review.rating || 0), 0);
          business.rating = totalRating / reviewsWithRatings.length;
        }
      }
    } else {
      console.log(`No business found with owner email: ${email}`);
    }
    
    return business;
  } catch (error) {
    console.error(`Error fetching business by email ${email}:`, error);
    throw error;
  }
};