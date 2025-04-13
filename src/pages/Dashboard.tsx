import React, { useState, useEffect, useRef, Component, ErrorInfo } from 'react';
import { FaStore, FaUtensils, FaHome, FaSearch, FaUser, FaSignOutAlt, FaCog, FaCamera, FaKey, FaAngleDown, FaArrowLeft, FaTrash, FaComment } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Business, BusinessType } from '../types/auth';
import BusinessCard from '../components/dashboard/BusinessCard';
import BusinessDetails from '../components/dashboard/BusinessDetails';
import { businessApi } from '../services/api';

// Error boundary component to catch rendering errors
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h2>
          <p className="text-red-600 mb-4">{this.state.error?.message || "Unknown error"}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Dashboard: React.FC = () => {
  console.log("Dashboard component is rendering");
  
  const [activeTab, setActiveTab] = useState<BusinessType>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeProfileSection, setActiveProfileSection] = useState<'main' | 'edit-profile' | 'change-password' | 'account-settings'>('main');
  const [isLoading, setIsLoading] = useState(true);
  const [renderError, setRenderError] = useState<string | null>(null);
  
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
  const { user, logout, updateUserProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [deleteForm, setDeleteForm] = useState({
    password: '',
    confirmDelete: false
  });

  const [formStatus, setFormStatus] = useState({
    profile: { success: false, error: null as string | null },
    password: { success: false, error: null as string | null },
    delete: { success: false, error: null as string | null }
  });

  // Safety check - if no user, redirect to login
  useEffect(() => {
    if (!user) {
      console.log("No user found in Dashboard, redirecting to login");
      navigate('/login');
    }
  }, [user, navigate]);

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
      // Skip if clicking on an input element or within the menu
      const target = event.target as HTMLElement;
      const isFormElement = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'BUTTON' ||
        target.closest('label') !== null;
      
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node) && !isFormElement) {
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
    // Reset status when form changes
    setFormStatus(prev => ({
      ...prev,
      profile: { success: false, error: null }
    }));
  };

  const handlePasswordFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset status when form changes
    setFormStatus(prev => ({
      ...prev,
      password: { success: false, error: null }
    }));
  };

  const handleDeleteFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDeleteForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Reset status when form changes
    setFormStatus(prev => ({
      ...prev,
      delete: { success: false, error: null }
    }));
  };

  const handleSettingsChange = (setting: string, value: any) => {
    setAccountSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormStatus(prev => ({
        ...prev,
        profile: { success: false, error: null }
      }));
      
      // Validate inputs
      if (!profileForm.firstName || !profileForm.lastName) {
        setFormStatus(prev => ({
          ...prev,
          profile: { success: false, error: 'First name and last name are required' }
        }));
        return;
      }
      
      console.log('Updating profile with:', profileForm);
      
      // Call API to update profile
      const success = await updateUserProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName
      });
      
      if (success) {
        setFormStatus(prev => ({
          ...prev,
          profile: { success: true, error: null }
        }));
        
        // Go back to main menu after short delay
        setTimeout(() => {
          setActiveProfileSection('main');
        }, 1500);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setFormStatus(prev => ({
        ...prev,
        profile: { success: false, error: 'Failed to update profile. Please try again.' }
      }));
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFormStatus(prev => ({
        ...prev,
        password: { success: false, error: 'Passwords do not match' }
      }));
      return;
    }
    
    try {
      const success = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      if (success) {
        setFormStatus(prev => ({
          ...prev,
          password: { success: true, error: null }
        }));
        
        // Reset form
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Go back to main menu after short delay
        setTimeout(() => {
          handleProfileNavigation('main');
        }, 1500);
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      setFormStatus(prev => ({
        ...prev,
        password: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verify user confirmed deletion
    if (!deleteForm.confirmDelete) {
      setFormStatus(prev => ({
        ...prev,
        delete: { success: false, error: 'Please confirm account deletion' }
      }));
      return;
    }
    
    try {
      const success = await deleteAccount(deleteForm.password);
      
      if (success) {
        // Account deletion is handled by AuthContext by calling logout
        // We'll navigate to login page just to be sure
        navigate('/login');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      setFormStatus(prev => ({
        ...prev,
        delete: { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  };

  // Modified navigation with fade transition
  const handleSectionTransition = (section: 'main' | 'edit-profile' | 'change-password' | 'account-settings') => {
    if (section === activeProfileSection) return;
    
    // Use a more immediate transition instead of the fade approach
    // which was causing flickering
    setActiveProfileSection(section);
  };

  // Add a new useEffect for debugging
  useEffect(() => {
    console.log("Auth state in Dashboard:", { user, isAuthenticated: !!user });
    
    // Check if the API is accessible
    businessApi.getAll()
      .then(data => console.log("API response:", data.length, "businesses found"))
      .catch(err => console.error("API error:", err));
  }, [user]);

  return (
    <ErrorBoundary>
      {renderError ? (
        <div className="p-8 text-center">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 mb-4">
            {renderError}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      ) : !user ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-baby-blue"></div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white flex flex-col">
          {/* Header */}
          <header className="sticky top-4 z-10 mb-4">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-xl shadow-sm border border-blue-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      <FaSearch className="text-baby-blue mr-1" />
                      <h1 className="text-xl font-semibold text-gray-800">QuickFind</h1>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Beta</span>
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
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={toggleProfileMenu}
                        className="flex items-center space-x-2 py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-expanded={showProfileMenu}
                        aria-haspopup="true"
                      >
                        <div className="w-8 h-8 rounded-full bg-baby-blue flex items-center justify-center text-white">
                          {user?.firstName?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm">{user?.firstName || 'User'}</span>
                        <FaAngleDown className={`text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
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
              initialBusiness={selectedBusiness}
              onClose={closeBusinessDetails}
            />
          )}

          {/* Profile menu modal - Always rendered but conditionally visible */}
          <div className={`fixed inset-0 z-20 ${showProfileMenu ? 'block' : 'hidden'}`}>
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
              className="absolute right-4 top-16 mt-2 z-30 w-80 bg-white rounded-xl border border-blue-100 shadow-xl overflow-hidden animate-slideIn"
              style={{ maxHeight: 'calc(100vh - 5rem)', overflowY: 'auto' }}
            >
              {/* Profile header - only show on main menu */}
              {activeProfileSection === 'main' && (
                <div className="bg-gradient-to-r from-baby-blue to-blue-400 p-6 text-white">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full bg-white bg-opacity-30 flex items-center justify-center overflow-hidden text-xl">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                        <FaCamera className="text-baby-blue text-xs" />
                      </button>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-lg">{user?.firstName || 'User'} {user?.lastName || ''}</h3>
                      <p className="text-sm text-blue-100">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dynamic content with key-based animation */}
              <div className="transition-all duration-150 ease-in-out">
                {activeProfileSection === 'edit-profile' && renderEditProfile()}
                {activeProfileSection === 'change-password' && renderChangePassword()}
                {activeProfileSection === 'account-settings' && renderAccountSettings()}
                {activeProfileSection === 'main' && renderMainMenu()}
              </div>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );

  // Edit profile form with back button using transitions
  function renderEditProfile() {
    return (
      <div className="p-6">
        <button 
          onClick={() => handleProfileNavigation('main')}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Menu
        </button>
        
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Edit Profile
        </h2>
        
        {formStatus.profile.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700">
            {formStatus.profile.error}
          </div>
        )}
        
        {formStatus.profile.success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-700">
            Profile updated successfully!
          </div>
        )}
        
        <form onSubmit={handleSaveProfile}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={profileForm.firstName}
              onChange={handleProfileFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-baby-blue"
              placeholder="Your first name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={profileForm.lastName}
              onChange={handleProfileFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-baby-blue"
              placeholder="Your last name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={profileForm.email}
              disabled
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
              title="Email cannot be changed"
            />
            <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-baby-blue text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    );
  }

  // Change password form with back button using transitions
  function renderChangePassword() {
    return (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button 
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
            onClick={() => handleProfileNavigation('main')}
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
          
          {formStatus.password.success && (
            <div className="mb-4 p-2 bg-green-50 text-green-700 rounded-lg">
              Password changed successfully!
            </div>
          )}
          
          {formStatus.password.error && (
            <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-lg">
              {formStatus.password.error}
            </div>
          )}
          
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
  }

  // Account settings form with back button using transitions
  function renderAccountSettings() {
    return (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <button 
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
            onClick={() => handleProfileNavigation('main')}
          >
            <FaArrowLeft className="text-gray-500" />
          </button>
          <h3 className="text-lg font-medium">Account Settings</h3>
        </div>
        
        {/* Delete Account Section */}
        <div className="mt-8 border-t pt-6">
          <h4 className="text-lg font-medium text-red-600 mb-4">Delete Account</h4>
          <p className="text-sm text-gray-600 mb-4">
            This action will permanently delete your account. Your reviews and inquiries will be preserved. This action cannot be undone.
          </p>
          
          <form onSubmit={handleDeleteAccount}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm with your password</label>
              <input
                type="password"
                name="password"
                value={deleteForm.password}
                onChange={handleDeleteFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="confirmDelete"
                  checked={deleteForm.confirmDelete}
                  onChange={handleDeleteFormChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  required
                />
                <span className="ml-2 text-sm text-gray-700">
                  I understand that this action cannot be undone
                </span>
              </label>
            </div>
            
            {formStatus.delete.error && (
              <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-lg">
                {formStatus.delete.error}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={!deleteForm.confirmDelete}
            >
              <div className="flex items-center justify-center">
                <FaTrash className="mr-2" />
                Delete My Account
              </div>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main menu with updated navigation
  function renderMainMenu() {
    return (
      <div className="py-2">
        <button 
          className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-gray-50"
          onClick={() => handleProfileNavigation('edit-profile')}
        >
          <FaUser className="mr-3 text-gray-500" />
          <span>Edit Profile</span>
        </button>
        <button 
          className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-gray-50"
          onClick={() => handleProfileNavigation('change-password')}
        >
          <FaKey className="mr-3 text-gray-500" />
          <span>Change Password</span>
        </button>
        <button 
          className="w-full px-6 py-3 flex items-center text-gray-700 hover:bg-gray-50"
          onClick={() => handleProfileNavigation('account-settings')}
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
  }
};

export default Dashboard; 