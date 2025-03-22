import React, { useState, useEffect } from 'react';
import { FaStore, FaUtensils, FaHome, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Business, BusinessType } from '../types/auth';
import BusinessCard from '../components/dashboard/BusinessCard';
import BusinessDetails from '../components/dashboard/BusinessDetails';

// Mock data for businesses
const mockBusinesses: Business[] = [
  {
    id: '1',
    name: 'Corner Grocery Store',
    ownerEmail: 'store@example.com',
    businessType: 'store',
    description: 'A local grocery store with fresh produce and daily necessities.',
    location: '123 Market Street',
    contactInfo: '555-123-4567'
  },
  {
    id: '2',
    name: 'Tech Store',
    ownerEmail: 'tech@example.com',
    businessType: 'store',
    description: 'Latest gadgets and tech accessories at competitive prices.',
    location: '456 Digital Avenue',
    contactInfo: '555-987-6543'
  },
  {
    id: '3',
    name: 'Sunny Café',
    ownerEmail: 'cafe@example.com',
    businessType: 'restaurant',
    description: 'Cozy café serving specialty coffee and homemade pastries.',
    location: '789 Sunny Road',
    contactInfo: '555-234-5678'
  },
  {
    id: '4',
    name: 'Pizza Palace',
    ownerEmail: 'pizza@example.com',
    businessType: 'restaurant',
    description: 'Authentic Italian pizza made in a wood-fired oven.',
    location: '321 Cheese Street',
    contactInfo: '555-876-5432'
  },
  {
    id: '5',
    name: 'Student Apartments',
    ownerEmail: 'apartments@example.com',
    businessType: 'housing',
    description: 'Modern student apartments close to campus with all amenities.',
    location: '654 Campus Drive',
    contactInfo: '555-345-6789'
  },
  {
    id: '6',
    name: 'Cozy Homestay',
    ownerEmail: 'homestay@example.com',
    businessType: 'housing',
    description: 'Family-style homestay options for international students.',
    location: '987 Family Lane',
    contactInfo: '555-765-4321'
  }
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BusinessType>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Filter businesses based on active tab and search query
    const filtered = mockBusinesses.filter(business => {
      const matchesType = business.businessType === activeTab;
      const matchesSearch = searchQuery === '' || 
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesType && matchesSearch;
    });
    
    setBusinesses(filtered);
  }, [activeTab, searchQuery]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (tab: BusinessType) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  const openBusinessDetails = (business: Business) => {
    setSelectedBusiness(business);
  };

  const closeBusinessDetails = () => {
    setSelectedBusiness(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <div className="fixed top-4 left-0 right-0 z-10 px-4 mx-auto">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md py-3 px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-baby-blue">QuickFind</h1>
            </div>
            
            <div className="flex space-x-6">
              <button
                onClick={() => handleTabChange('store')}
                className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
                  activeTab === 'store' 
                    ? 'bg-red-100 text-red-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <FaStore />
                <span>Stores</span>
              </button>
              
              <button
                onClick={() => handleTabChange('restaurant')}
                className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
                  activeTab === 'restaurant' 
                    ? 'bg-green-100 text-green-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <FaUtensils />
                <span>Restaurants</span>
              </button>
              
              <button
                onClick={() => handleTabChange('housing')}
                className={`flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors ${
                  activeTab === 'housing' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <FaHome />
                <span>Housing</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <FaUser className="text-baby-blue" />
                <span className="text-sm">{user?.firstName}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="pt-24 pb-10 px-4 max-w-6xl mx-auto">
        {/* Search bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${activeTab === 'store' ? 'stores' : activeTab === 'restaurant' ? 'restaurants' : 'housing'}`}
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
          />
        </div>
        
        {/* Business list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.length > 0 ? (
            businesses.map(business => (
              <BusinessCard 
                key={business.id} 
                business={business}
                onClick={() => openBusinessDetails(business)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No {activeTab === 'store' ? 'stores' : activeTab === 'restaurant' ? 'restaurants' : 'housing options'} found.</p>
              <p className="text-gray-400 text-sm mt-2">Try a different search term or switch tabs.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Business details modal */}
      {selectedBusiness && (
        <BusinessDetails
          business={selectedBusiness}
          onClose={closeBusinessDetails}
        />
      )}
    </div>
  );
};

export default Dashboard; 