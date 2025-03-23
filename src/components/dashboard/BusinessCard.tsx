import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaStore, FaUtensils, FaHome, FaClock, FaStar } from 'react-icons/fa';
import { Business } from '../../types/auth';
import ChatButton from '../chat/ChatButton';

interface BusinessCardProps {
  business: Business;
  onClick: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onClick }) => {
  const getTypeIcon = () => {
    switch (business.businessType) {
      case 'store':
        return <FaStore className="text-red-500" />;
      case 'restaurant':
        return <FaUtensils className="text-green-500" />;
      case 'housing':
        return <FaHome className="text-purple-500" />;
      default:
        return null;
    }
  };

  const getBackgroundClass = () => {
    switch (business.businessType) {
      case 'store':
        return 'bg-red-50 border-red-200';
      case 'restaurant':
        return 'bg-green-50 border-green-200';
      case 'housing':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Get a featured highlight from a review if available
  const getFeaturedReview = () => {
    if (!business.reviews || business.reviews.length === 0) return null;
    
    // Find a review with a high rating and a comment
    const goodReview = business.reviews.find(review => 
      review.rating >= 4 && review.comment && review.comment.length > 10
    );
    
    if (goodReview) {
      return (
        <div className="mt-3 p-2 bg-white rounded-lg border border-gray-100">
          <div className="flex items-center mb-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < goodReview.rating ? "text-yellow-400" : "text-gray-200"} size={12} />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-500">{goodReview.userName}</span>
          </div>
          <p className="text-xs text-gray-600 italic line-clamp-2">"{goodReview.comment}"</p>
        </div>
      );
    }
    
    return null;
  };

  // Get business type specific information
  const getSpecificInfo = () => {
    switch (business.businessType) {
      case 'restaurant':
        if (business.menu && business.menu.length > 0) {
          return (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">Popular items: </span>
              {business.menu.slice(0, 2).map(item => item.name).join(', ')}
              {business.menu.length > 2 ? ' and more...' : ''}
            </div>
          );
        }
        break;
      case 'store':
        if (business.items && business.items.length > 0) {
          return (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">Products: </span>
              {business.items.slice(0, 2).map(item => item.name).join(', ')}
              {business.items.length > 2 ? ' and more...' : ''}
            </div>
          );
        }
        break;
      case 'housing':
        if (business.rooms && business.rooms.length > 0) {
          const availableRooms = business.rooms.filter(room => room.available).length;
          return (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">
                {availableRooms > 0 ? `${availableRooms} units available` : 'No current vacancies'}
              </span>
            </div>
          );
        }
        break;
    }
    return null;
  };

  // Format business hours for display
  const getBusinessHours = () => {
    if (!business.businessHours) return null;
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const hours = business.businessHours[today];
    
    if (!hours) return null;
    
    return (
      <div className="flex items-center text-gray-500 text-sm mb-2">
        <FaClock className="mr-2 text-gray-400" />
        <span>{hours}</span>
      </div>
    );
  };

  return (
    <div
      className={`cursor-pointer rounded-xl shadow-sm border ${getBackgroundClass()} hover:shadow-md transition-shadow overflow-hidden h-full flex flex-col`}
      onClick={onClick}
    >
      {/* Image section */}
      {business.photos && business.photos.length > 0 && (
        <div className="h-40 w-full overflow-hidden">
          <img 
            src={business.photos[0]} 
            alt={business.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{business.name}</h3>
          <div className="ml-2 flex-shrink-0">{getTypeIcon()}</div>
        </div>
        
        {/* Rating */}
        {business.rating !== undefined && (
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(business.rating || 0) ? "text-yellow-400" : "text-gray-200"} size={14} />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              {business.rating.toFixed(1)}
              {business.reviews && <span className="text-xs"> ({business.reviews.length})</span>}
            </span>
          </div>
        )}
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {business.description}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span className="truncate">{business.location}</span>
        </div>
        
        {getBusinessHours()}
        
        <div className="flex items-center text-gray-500 text-sm">
          <FaPhone className="mr-2 text-gray-400" />
          <span>{business.contactInfo}</span>
        </div>
        
        {getSpecificInfo()}
        
        {getFeaturedReview()}
      </div>
      
      <div className="px-5 py-3 bg-white flex justify-between">
        <ChatButton 
          business={business}
          className="text-baby-blue hover:underline text-sm font-medium"
        />
        <button 
          className="text-baby-blue hover:underline text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default BusinessCard; 