import React, { useState, useRef, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaStore, 
  FaUtensils, 
  FaHome, 
  FaTimes, 
  FaStar, 
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaDollarSign,
  FaComment,
  FaQuestionCircle
} from 'react-icons/fa';
import { Business, MenuItem, StoreItem, HousingUnit, Review } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import { reviewApi } from '../../services/api';
import { businessApi } from '../../services/api';

interface BusinessDetailsProps {
  initialBusiness: Business;
  onClose: () => void;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ initialBusiness, onClose }) => {
  const [business, setBusiness] = useState<Business>(initialBusiness);
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'reviews'>('info');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [isInquiry, setIsInquiry] = useState(false);
  const { user } = useAuth();
  const reviewFormRef = useRef<HTMLDivElement>(null);

  // Update business state if props change
  useEffect(() => {
    console.log("Business details updated from props:", initialBusiness);
    console.log("Business has reviews:", initialBusiness.reviews?.length || 0);
    setBusiness(initialBusiness);
    
    // ENHANCED: Always fetch reviews directly when component mounts or business changes
    const fetchReviews = async () => {
      try {
        if (initialBusiness.id) {
          console.log(`Fetching reviews directly for business: ${initialBusiness.id}`);
          const fetchedReviews = await reviewApi.getForBusiness(initialBusiness.id);
          console.log(`Fetched ${fetchedReviews.length} reviews from API:`, 
            fetchedReviews.map(r => ({ id: r.id, userName: r.userName, comment: r.comment?.substring(0, 20) })));
          
          // Always update with the latest reviews
          const updatedBusiness = {
            ...initialBusiness,
            reviews: fetchedReviews,
            // Recalculate rating based on fetched reviews
            rating: fetchedReviews.length > 0 
              ? fetchedReviews
                  .filter(r => r.rating !== undefined)
                  .reduce((sum, r) => sum + (r.rating || 0), 0) / 
                fetchedReviews.filter(r => r.rating !== undefined).length
              : initialBusiness.rating
          };
          
          console.log('Setting business state with', fetchedReviews.length, 'reviews');
          setBusiness(updatedBusiness);
        }
      } catch (error) {
        console.error('Error fetching reviews for business', error);
      }
    };
    
    fetchReviews();
  }, [initialBusiness]);

  const getTypeIcon = () => {
    switch (business.businessType) {
      case 'store':
        return <FaStore className="text-xl text-red-500" />;
      case 'restaurant':
        return <FaUtensils className="text-xl text-green-500" />;
      case 'housing':
        return <FaHome className="text-xl text-purple-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (business.businessType) {
      case 'store':
        return 'bg-red-100 text-red-800';
      case 'restaurant':
        return 'bg-green-100 text-green-800';
      case 'housing':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = () => {
    switch (business.businessType) {
      case 'store':
        return 'Store';
      case 'restaurant':
        return 'Restaurant';
      case 'housing':
        return 'Housing';
      default:
        return 'Business';
    }
  };

  const getTypeName = () => {
    switch (business.businessType) {
      case 'store':
        return 'Products';
      case 'restaurant':
        return 'Menu';
      case 'housing':
        return 'Rooms';
      default:
        return 'Items';
    }
  };

  const nextPhoto = () => {
    if (!business.photos) return;
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === business.photos!.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    if (!business.photos) return;
    setCurrentPhotoIndex((prevIndex) => 
      prevIndex === 0 ? business.photos!.length - 1 : prevIndex - 1
    );
  };

  // Render photo gallery
  const renderPhotoGallery = () => {
    if (!business.photos || business.photos.length === 0) return null;

    return (
      <div className="relative h-64 bg-gray-100">
        <img 
          src={business.photos[currentPhotoIndex]} 
          alt={`${business.name} - Photo ${currentPhotoIndex + 1}`} 
          className="w-full h-full object-cover"
        />
        
        {business.photos.length > 1 && (
          <>
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
            >
              <FaChevronLeft className="text-gray-800" />
            </button>
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
            >
              <FaChevronRight className="text-gray-800" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {business.photos.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  // Format business hours for current day
  const getCurrentBusinessHours = () => {
    if (!business.businessHours) return null;
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return business.businessHours[today];
  };

  // Render business hours
  const renderBusinessHours = () => {
    if (!business.businessHours) return null;

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Business Hours</h3>
        <div className="space-y-1">
          {days.map((day) => (
            <div key={day} className={`flex justify-between text-sm ${day === today ? 'font-medium' : ''}`}>
              <span className="capitalize">{day}</span>
              <span>{business.businessHours?.[day] || 'Closed'}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render menu items for restaurants
  const renderMenuItems = () => {
    if (business.businessType !== 'restaurant' || !business.menu || business.menu.length === 0) {
      return <p className="text-gray-500 text-center py-4">No menu items available</p>;
    }

    // Group menu items by category
    const categories = [...new Set(business.menu.map(item => item.category))];

    return (
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="font-medium text-gray-800 border-b pb-2 mb-3">{category}</h3>
            <div className="space-y-4">
              {business.menu
                ?.filter(item => item.category === category)
                .map((item) => renderMenuItem(item))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render a single menu item
  const renderMenuItem = (item: MenuItem) => {
    return (
      <div key={item.id} className="flex">
        {item.photo && (
          <div className="w-16 h-16 mr-3">
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover rounded" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="font-medium">{item.name}</h4>
            <p className="font-medium text-gray-700">₱{item.price.toFixed(2)}</p>
          </div>
          <p className="text-sm text-gray-600">{item.description}</p>
          {item.available !== undefined && (
            <div className="mt-1">
              <span className={`text-xs px-2 py-0.5 rounded ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {item.available ? 'Available' : 'Not Available'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render store items
  const renderStoreItems = () => {
    if (business.businessType !== 'store' || !business.items || business.items.length === 0) {
      return <p className="text-gray-500 text-center py-4">No items available</p>;
    }

    // Group items by category
    const categories = [...new Set(business.items.map(item => item.category))];

    return (
      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h3 className="font-medium text-gray-800 border-b pb-2 mb-3">{category}</h3>
            <div className="grid gap-4 grid-cols-2">
              {business.items
                ?.filter(item => item.category === category)
                .map((item) => renderStoreItem(item))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render a single store item
  const renderStoreItem = (item: StoreItem) => {
    return (
      <div key={item.id} className="border rounded-lg overflow-hidden bg-white">
        {item.photo && (
          <div className="h-32 w-full">
            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-3">
          <div className="flex justify-between items-start">
            <h4 className="font-medium">{item.name}</h4>
            <p className="font-medium text-gray-700">₱{item.price.toFixed(2)}</p>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
          <div className="mt-2">
            <span className={`text-xs px-2 py-0.5 rounded ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {item.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render housing units
  const renderHousingUnits = () => {
    if (business.businessType !== 'housing' || !business.rooms || business.rooms.length === 0) {
      return <p className="text-gray-500 text-center py-4">No units available</p>;
    }

    return (
      <div className="space-y-4">
        {business.rooms.map((room) => renderHousingUnit(room))}
      </div>
    );
  };

  // Render a single housing unit
  const renderHousingUnit = (unit: HousingUnit) => {
    return (
      <div key={unit.id} className="border rounded-lg overflow-hidden bg-white">
        {unit.photos && unit.photos.length > 0 && (
          <div className="h-48 w-full relative">
            <img src={unit.photos[0]} alt={unit.name} className="w-full h-full object-cover" />
            {unit.photos.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                +{unit.photos.length - 1} more
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-lg">{unit.name}</h4>
            <div>
              <p className="font-bold text-gray-800">₱{unit.price.toFixed(0)}</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-2 text-sm">
            <span><strong>{unit.bedrooms}</strong> {unit.bedrooms === 1 ? 'bed' : 'beds'}</span>
            <span><strong>{unit.bathrooms}</strong> {unit.bathrooms === 1 ? 'bath' : 'baths'}</span>
          </div>
          
          <p className="text-sm text-gray-600 mt-3">{unit.description}</p>
          
          {unit.amenities && unit.amenities.length > 0 && (
            <div className="mt-3">
              <h5 className="text-sm font-medium text-gray-700 mb-1">Amenities:</h5>
              <div className="flex flex-wrap gap-1">
                {unit.amenities.map((amenity, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <span className={`text-sm px-2 py-1 rounded font-medium ${unit.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {unit.available ? 'Available Now' : 'Not Available'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Render reviews with inquiry form
  const renderReviews = () => {
    console.log("Rendering reviews section");
    console.log("Business state:", { 
      id: business.id, 
      name: business.name,
      hasReviews: !!business.reviews?.length,
      reviewsCount: business.reviews?.length || 0 
    });
    
    // If no reviews, show empty state but still show the form
    const hasReviews = business.reviews && business.reviews.length > 0;
    
    // Log review details if they exist
    if (hasReviews) {
      console.log("Reviews to display:", business.reviews?.map(review => ({
        id: review.id,
        userName: review.userName,
        date: review.date,
        comment: review.comment?.substring(0, 20) + '...'
      })));
    }
    
    // Sort reviews by date (most recent first)
    const sortedReviews = hasReviews && business.reviews 
      ? [...business.reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : [];

    // Access user data more safely
    const userIdExists = user && user.id !== undefined && user.id !== null;

    return (
      <div className="space-y-6">
        {/* Rating summary - only show if there are reviews */}
        {hasReviews && business.rating !== undefined && (
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-gray-800 mr-4">{business.rating.toFixed(1)}</div>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.round(business.rating || 0) ? "text-yellow-400" : "text-gray-200"} />
                ))}
              </div>
              <div className="text-sm text-gray-500">{business.reviews?.length || 0} {(business.reviews?.length || 0) === 1 ? 'review' : 'reviews'}</div>
            </div>
          </div>
        )}
        
        {/* Review/Inquiry Form - only show if user is logged in and has ID */}
        {user ? (
          <div 
            ref={reviewFormRef}
            className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200"
          >
            <h3 className="font-medium text-gray-800 mb-3">
              Leave a Review or Inquiry
            </h3>
            
            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded mb-4">
                {submitSuccess}
              </div>
            )}
            
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
                {submitError}
              </div>
            )}
            
            {!userIdExists ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4">
                User ID is not available. Please log out and log in again.
              </div>
            ) : (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!user) return;
                  
                  console.log("Starting review submission process");
                  console.log("User:", user);
                  setIsSubmitting(true);
                  setSubmitError('');
                  setSubmitSuccess('');
                  
                  try {
                    // Make sure we have valid user data
                    if (!user.id) {
                      console.error("Invalid user ID:", user.id);
                      setSubmitError("User ID is not available. Please log out and log in again.");
                      return;
                    }
                    
                    // Ensure we have proper user names
                    const firstName = user.firstName || 'Guest';
                    const lastName = user.lastName || `${Math.floor(Math.random() * 1000)}`;
                    const fullName = `${firstName} ${lastName}`.trim();
                    
                    // Prepare review data - only include rating if not an inquiry
                    const reviewData: any = {
                      userId: user.id,
                      userName: fullName !== ' ' ? fullName : 'Guest User',
                      comment: reviewText
                    };
                    
                    console.log("User ID from context:", user.id);
                    console.log("Type of user.id:", typeof user.id);
                    
                    // Only include rating if this is a review (not an inquiry)
                    if (!isInquiry) {
                      reviewData.rating = rating;
                    }
                    
                    console.log("Submitting review/inquiry data:", reviewData);
                    console.log("Business ID:", business.id);
                    console.log("Type of business.id:", typeof business.id);
                    
                    // Submit review/inquiry
                    const submittedReview = await reviewApi.add(business.id, reviewData);
                    console.log("Review submitted successfully:", submittedReview);
                    
                    setReviewText('');
                    setRating(5);
                    setIsInquiry(false);
                    setSubmitSuccess(isInquiry ? 'Your inquiry has been submitted!' : 'Your review has been submitted!');
                    
                    // Refresh the business data without page reload
                    try {
                      console.log("Refreshing business data for ID:", business.id);
                      
                      // First get the updated business
                      const updatedBusiness = await businessApi.getById(business.id);
                      console.log("Updated business data received:", updatedBusiness);
                      
                      // Then explicitly fetch the latest reviews
                      const latestReviews = await reviewApi.getForBusiness(business.id);
                      console.log(`Fetched ${latestReviews.length} latest reviews from API`);
                      
                      // Make sure we have the latest reviews
                      updatedBusiness.reviews = latestReviews;
                      
                      // Recalculate rating if needed
                      if (latestReviews.length > 0) {
                        const reviewsWithRatings = latestReviews.filter(r => r.rating !== undefined);
                        if (reviewsWithRatings.length > 0) {
                          updatedBusiness.rating = reviewsWithRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / 
                            reviewsWithRatings.length;
                        }
                      }
                      
                      console.log("Final business with reviews:", {
                        name: updatedBusiness.name,
                        reviewCount: updatedBusiness.reviews.length,
                        rating: updatedBusiness.rating
                      });
                      
                      // This will ensure we have the latest data including the new review
                      setBusiness(updatedBusiness);
                    } catch (err) {
                      console.error('Error refreshing business data:', err);
                    }
                  } catch (error) {
                    console.error('Error submitting review:', error);
                    if (error instanceof Error) {
                      console.error('Error details:', error.message);
                      setSubmitError(`Failed to submit your ${isInquiry ? 'inquiry' : 'review'}: ${error.message}`);
                    } else {
                      setSubmitError(`Failed to submit your ${isInquiry ? 'inquiry' : 'review'}. Please try again.`);
                    }
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {/* Toggle for Review/Inquiry type */}
                <div className="mb-4 flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">This is an:</span>
                  <div className="flex bg-gray-200 rounded-full p-1">
                    <button
                      type="button"
                      className={`py-1 px-3 rounded-full text-sm font-medium transition-colors ${
                        !isInquiry 
                          ? 'bg-baby-blue text-white' 
                          : 'text-gray-600 hover:bg-gray-300'
                      }`}
                      onClick={() => setIsInquiry(false)}
                    >
                      Review
                    </button>
                    <button
                      type="button"
                      className={`py-1 px-3 rounded-full text-sm font-medium transition-colors ${
                        isInquiry 
                          ? 'bg-baby-blue text-white' 
                          : 'text-gray-600 hover:bg-gray-300'
                      }`}
                      onClick={() => setIsInquiry(true)}
                    >
                      Inquiry
                    </button>
                  </div>
                </div>
                
                {/* Only show rating if not an inquiry */}
                {!isInquiry && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-2xl focus:outline-none"
                        >
                          <FaStar 
                            className={star <= rating ? "text-yellow-400" : "text-gray-300"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {isInquiry ? 'Your Question' : 'Your Review'}
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder={isInquiry 
                      ? "Ask a question to the business owner..." 
                      : "Write your review about your experience with this business..."}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !reviewText.trim()}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    isSubmitting || !reviewText.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-baby-blue text-white hover:bg-blue-600'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : isInquiry ? 'Submit Inquiry' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
            <p className="text-gray-600 mb-2">You need to be logged in to leave a review or inquiry.</p>
          </div>
        )}
        
        {/* Section title */}
        <h3 className="font-semibold text-gray-800 text-lg mb-4">
          {hasReviews ? 'Reviews & Inquiries' : 'No Reviews or Inquiries Yet'}
        </h3>
        
        {/* Individual reviews */}
        {sortedReviews.length > 0 ? (
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{review.userName}</span>
                  <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                </div>
                {review.rating !== undefined ? (
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating! ? "text-yellow-400" : "text-gray-200"} size={14} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500 mb-2">
                    <FaQuestionCircle className="mr-1" size={14} />
                    <span className="text-xs">Inquiry</span>
                  </div>
                )}
                <p className="text-gray-700">{review.comment}</p>
                
                {/* Show business owner replies if they exist */}
                {review.ownerReply && (
                  <div className="mt-3 ml-6 p-3 bg-gray-50 rounded-lg border-l-2 border-baby-blue">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">Response from {business.name}</span>
                      <span className="text-xs text-gray-500">{new Date(review.ownerReplyDate || '').toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.ownerReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Be the first to leave a review or ask a question!</p>
        )}
      </div>
    );
  };

  // Render business type specific content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <div className="space-y-4">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-800">Location</h3>
                <p className="text-gray-600">{business.location}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaPhone className="text-gray-400 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-800">Contact</h3>
                <p className="text-gray-600">{business.contactInfo}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaEnvelope className="text-gray-400 mt-1 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-800">Email</h3>
                <p className="text-gray-600">{business.ownerEmail}</p>
              </div>
            </div>
            
            {renderBusinessHours()}
          </div>
        );
      case 'menu':
        switch (business.businessType) {
          case 'restaurant':
            return renderMenuItems();
          case 'store':
            return renderStoreItems();
          case 'housing':
            return renderHousingUnits();
          default:
            return <p className="text-gray-500 text-center py-4">No items available</p>;
        }
      case 'reviews':
        return renderReviews();
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-90vh overflow-hidden flex flex-col">
        {/* Business Header */}
        <div className="relative">
          {business.photos && business.photos.length > 0 && (
            <div className="h-56 bg-gray-200 relative">
              <img 
                src={business.photos[currentPhotoIndex]} 
                alt={business.name} 
                className="w-full h-full object-cover"
              />
              {business.photos.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4">
                  <button 
                    onClick={prevPhoto}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    onClick={nextPhoto}
                    className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-white p-2 rounded-full text-gray-700 hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>
          )}
          
          {!business.photos && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-white p-2 rounded-full text-gray-700 hover:bg-gray-100 z-10"
            >
              <FaTimes />
            </button>
          )}
          
          <div className={`px-6 pt-6 ${!business.photos ? 'pt-12' : ''}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold text-gray-800">{business.name}</h2>
                  <div className="ml-3">{getTypeIcon()}</div>
                </div>
                
                {business.rating !== undefined && (
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(business.rating || 0) ? "text-yellow-400" : "text-gray-200"} size={16} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {business.rating.toFixed(1)}
                      {business.reviews && <span className="text-sm"> ({business.reviews.length} reviews)</span>}
                    </span>
                  </div>
                )}
                
                <p className="text-gray-600 mt-2">{business.description}</p>
              </div>
              
              {/* Remove ChatButton and replace with a button to jump to reviews section */}
              {user && (
                <button 
                  onClick={() => {
                    setActiveTab('reviews');
                    // Scroll to review form after tab change
                    setTimeout(() => {
                      reviewFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-white bg-baby-blue hover:bg-blue-600 py-2 px-4 rounded-lg text-sm font-medium flex items-center"
                >
                  <FaComment className="mr-2" />
                  {business.reviews?.some(review => review.userId === user.id) 
                    ? 'View Reviews & Inquiries' 
                    : 'Ask a Question'}
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap items-center mt-4 text-sm text-gray-600">
              <div className="flex items-center mr-6 mb-2">
                <FaMapMarkerAlt className="text-gray-400 mr-2" />
                <span>{business.location}</span>
              </div>
              
              {getCurrentBusinessHours() && (
                <div className="flex items-center mr-6 mb-2">
                  <FaClock className="text-gray-400 mr-2" />
                  <span>{getCurrentBusinessHours()}</span>
                </div>
              )}
              
              <div className="flex items-center mb-2">
                <FaPhone className="text-gray-400 mr-2" />
                <span>{business.contactInfo}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mt-6">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'info' ? 'text-baby-blue border-b-2 border-baby-blue' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('info')}
            >
              Info
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'menu' ? 'text-baby-blue border-b-2 border-baby-blue' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('menu')}
            >
              {getTypeName()}
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'reviews' ? 'text-baby-blue border-b-2 border-baby-blue' : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews & Inquiries
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails; 