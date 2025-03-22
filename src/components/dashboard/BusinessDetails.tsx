import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaStore, FaUtensils, FaHome, FaTimes } from 'react-icons/fa';
import { Business } from '../../types/auth';

interface BusinessDetailsProps {
  business: Business;
  onClose: () => void;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({ business, onClose }) => {
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

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-20"
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-lg">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header with close button */}
          <div className="relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={onClose}
            >
              <FaTimes className="text-lg" />
            </button>
            
            <div className="p-6 pb-4">
              <div className="flex items-center mb-1">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getTypeColor()} flex items-center`}>
                  {getTypeIcon()}
                  <span className="ml-1.5">{getTypeText()}</span>
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{business.name}</h2>
              <p className="text-gray-600">{business.description}</p>
            </div>
          </div>
          
          {/* Body with details */}
          <div className="border-t border-gray-100 p-6 space-y-4">
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
          </div>
          
          {/* Actions */}
          <div className="border-t border-gray-100 p-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDetails; 