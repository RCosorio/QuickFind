import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaStore, FaUtensils, FaHome } from 'react-icons/fa';
import { Business } from '../../types/auth';

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

  return (
    <div
      className={`cursor-pointer rounded-xl shadow-sm border ${getBackgroundClass()} hover:shadow-md transition-shadow overflow-hidden`}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{business.name}</h3>
          <div className="ml-2 flex-shrink-0">{getTypeIcon()}</div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {business.description}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span className="truncate">{business.location}</span>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm">
          <FaPhone className="mr-2 text-gray-400" />
          <span>{business.contactInfo}</span>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-white flex justify-end">
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