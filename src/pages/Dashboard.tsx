import React, { useState, useEffect, useRef } from 'react';
import { FaStore, FaUtensils, FaHome, FaSearch, FaUser, FaSignOutAlt, FaCog, FaCamera, FaKey, FaAngleDown, FaArrowLeft, FaTrash, FaComment } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useNavigate, Link } from 'react-router-dom';
import { Business, BusinessType } from '../types/auth';
import BusinessCard from '../components/dashboard/BusinessCard';
import BusinessDetails from '../components/dashboard/BusinessDetails';
import { businessApi } from '../services/api';
import ActiveChat from '../components/chat/ActiveChat';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BusinessType>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeProfileSection, setActiveProfileSection] = useState<'main' | 'edit-profile' | 'change-password' | 'account-settings'>('main');
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountSettings, setAccountSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'english'
  });
  
  // Add fade effect state for menu transitions
  const [isFading, setIsFading] = useState(false);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { getAllUnreadCount, clearActiveChat } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch businesses from API
    const fetchBusinesses = async () => {
      setIsLoading(true);
      try {
        const allBusinesses = await businessApi.getAll();
        const filtered = allBusinesses.filter(business => {
          const matchesType = business.businessType === activeTab;
          const matchesSearch = searchQuery === '' || 
            business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.location.toLowerCase().includes(searchQuery.toLowerCase());
          
          return matchesType && matchesSearch;
        });
        
        setBusinesses(filtered);
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setBusinesses([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinesses();
  }, [activeTab, searchQuery]);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
        // Reset to main menu when closing
        setActiveProfileSection('main');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]);

  const handleLogout = () => {
    setShowProfileMenu(false);
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

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    // Reset to main section when toggling
    setActiveProfileSection('main');
  };

  const handleProfileNavigation = (section: 'main' | 'edit-profile' | 'change-password' | 'account-settings') => {
    setActiveProfileSection(section);
  };

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSettingsChange = (setting: string, value: any) => {
    setAccountSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the user profile with an API call
    console.log('Saving profile:', profileForm);
    // Simulate success
    setTimeout(() => {
      handleProfileNavigation('main');
      // Update local display
      // In a real app, this would happen after API confirms success
    }, 500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update the password with an API call
    console.log('Changing password:', passwordForm);
    // Simulate success
    setTimeout(() => {
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      handleProfileNavigation('main');
    }, 500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would update settings with an API call
    console.log('Saving settings:', accountSettings);
    // Simulate success
    setTimeout(() => {
      handleProfileNavigation('main');
    }, 500);
  };

  // Modified navigation with fade transition
  const handleSectionTransition = (section: 'main' | 'edit-profile' | 'change-password' | 'account-settings') => {
    if (section === activeProfileSection) return;
    
    // Use a more immediate transition instead of the fade approach
    // which was causing flickering
    setActiveProfileSection(section);
  };

  // User profile modal component
  const ProfileMenu = () => {
    // Main menu with updated navigation
    const renderMainMenu = () => (
      <div className="py-2">
        <button 
          className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-gray-50"
          onClick={() => handleSectionTransition('edit-profile')}
        >
          <FaUser className="mr-3 text-gray-500" />
          <span>Edit Profile</span>
        </button>
        <button 
          className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-gray-50"
          onClick={() => handleSectionTransition('change-password')}
        >
          <FaKey className="mr-3 text-gray-500" />
          <span>Change Password</span>
        </button>
        <button 
          className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-gray-50"
          onClick={() => handleSectionTransition('account-settings')}
        >
          <FaCog className="mr-3 text-gray-500" />
          <span>Account Settings</span>
        </button>
        <div className="border-t my-2"></div>
        <button 
          className="w-full px-6 py-3 flex items-center text-red-600 hover:bg-gray-50"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-3" />
          <span>Log Out</span>
        </button>
      </div>
    );

    // Edit profile form with back button using transitions
    const renderEditProfile = () => (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button 
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
            onClick={() => handleSectionTransition('main')}
          >
            <FaArrowLeft className="text-gray-500" />
          </button>
          <h3 className="text-lg font-medium">Edit Profile</h3>
        </div>
        
        <form onSubmit={handleSaveProfile}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-baby-blue flex items-center justify-center text-white text-2xl">
                {profileForm.firstName.charAt(0)}
              </div>
              <button type="button" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow">
                <FaCamera className="text-baby-blue" />
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profileForm.firstName}
              onChange={handleProfileFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profileForm.lastName}
              onChange={handleProfileFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-baby-blue text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    );

    // Change password form with back button using transitions
    const renderChangePassword = () => (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button 
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
            onClick={() => handleSectionTransition('main')}
          >
            <FaArrowLeft className="text-gray-500" />
          </button>
          <h3 className="text-lg font-medium">Change Password</h3>
        </div>
        
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
              required
            />
            {passwordForm.newPassword && passwordForm.confirmPassword && 
             passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-baby-blue text-white rounded-lg hover:bg-blue-500 transition-colors"
            disabled={passwordForm.newPassword !== passwordForm.confirmPassword}
          >
            Update Password
          </button>
        </form>
      </div>
    );

    // Account settings form with back button using transitions
    const renderAccountSettings = () => (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button 
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
            onClick={() => handleSectionTransition('main')}
          >
            <FaArrowLeft className="text-gray-500" />
          </button>
          <h3 className="text-lg font-medium">Account Settings</h3>
        </div>
        
        <form onSubmit={handleSaveSettings}>
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="toggleEmail"
                  checked={accountSettings.emailNotifications} 
                  onChange={() => handleSettingsChange('emailNotifications', !accountSettings.emailNotifications)}
                  className="sr-only"
                />
                <label 
                  htmlFor="toggleEmail"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${accountSettings.emailNotifications ? 'bg-baby-blue' : 'bg-gray-300'}`}
                >
                  <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${accountSettings.emailNotifications ? 'translate-x-4' : 'translate-x-0'}`}></span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Receive email notifications about new listings and updates</p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Dark Mode</label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="toggleDarkMode"
                  checked={accountSettings.darkMode} 
                  onChange={() => handleSettingsChange('darkMode', !accountSettings.darkMode)}
                  className="sr-only"
                />
                <label 
                  htmlFor="toggleDarkMode"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${accountSettings.darkMode ? 'bg-baby-blue' : 'bg-gray-300'}`}
                >
                  <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${accountSettings.darkMode ? 'translate-x-4' : 'translate-x-0'}`}></span>
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Switch between light and dark theme</p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={accountSettings.language}
              onChange={(e) => handleSettingsChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-baby-blue focus:border-transparent"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-baby-blue text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            Save Settings
          </button>
          
          <div className="mt-8 pt-6 border-t">
            <button
              type="button"
              className="w-full py-2 px-4 flex items-center justify-center text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FaTrash className="mr-2" />
              <span>Delete Account</span>
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">This action is permanent and cannot be undone.</p>
          </div>
        </form>
      </div>
    );

    // Get the current active content to display
    const getActiveContent = () => {
      switch (activeProfileSection) {
        case 'edit-profile':
          return renderEditProfile();
        case 'change-password':
          return renderChangePassword();
        case 'account-settings':
          return renderAccountSettings();
        default:
          return renderMainMenu();
      }
    };

    return (
      <div className="fixed inset-0 z-20">
        {/* Backdrop - always present */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm animate-fadeIn"
          onClick={() => {
            setShowProfileMenu(false);
            setActiveProfileSection('main');
          }}
        ></div>
        
        {/* Menu content */}
        <div 
          ref={profileMenuRef}
          className="absolute right-4 top-16 mt-2 z-30 w-80 bg-white rounded-xl shadow-xl overflow-hidden animate-slideIn"
          style={{ maxHeight: 'calc(100vh - 5rem)', overflowY: 'auto' }}
        >
          {/* Profile header - only show on main menu */}
          {activeProfileSection === 'main' && (
            <div className="bg-gradient-to-r from-baby-blue to-blue-400 p-6 text-white">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center overflow-hidden text-xl">
                    {user?.firstName?.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                    <FaCamera className="text-baby-blue text-xs" />
                  </button>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-lg">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sm text-blue-100">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Dynamic content with key-based animation */}
          <div className="transition-all duration-150 ease-in-out">
            {getActiveContent()}
          </div>
        </div>
      </div>
    );
  };

  const handleMessagesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clearActiveChat();
    navigate('/messages');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold text-baby-blue">QuickFind</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex space-x-2">
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
                
                <button
                  onClick={handleMessagesClick}
                  className="flex items-center space-x-1 py-2 px-3 rounded-lg transition-colors text-gray-500 hover:bg-gray-100"
                >
                  <div className="relative">
                    <FaComment />
                    {getAllUnreadCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {getAllUnreadCount() > 9 ? '9+' : getAllUnreadCount()}
                      </span>
                    )}
                  </div>
                  <span>Messages</span>
                </button>
              </div>
              
              <div className="relative">
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-expanded={showProfileMenu}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-baby-blue flex items-center justify-center text-white">
                    {user?.firstName?.charAt(0)}
                  </div>
                  <span className="text-sm">{user?.firstName}</span>
                  <FaAngleDown className={`text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
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
        
        {/* Loading indicator */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-baby-blue"></div>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
      
      {/* Business details modal */}
      {selectedBusiness && (
        <BusinessDetails
          business={selectedBusiness}
          onClose={closeBusinessDetails}
        />
      )}

      {/* Profile menu modal - rendered as a portal in a fixed container */}
      {showProfileMenu && (
        <ProfileMenu />
      )}
      
      {/* Active Chat Window - ensure it's always the last element */}
      <ActiveChat />
    </div>
  );
};

export default Dashboard; 