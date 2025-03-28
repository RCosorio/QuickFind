import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { 
  FaStore, 
  FaUtensils, 
  FaHome, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaStar, 
  FaCheck, 
  FaArrowLeft,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaComment,
  FaBell,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { Business, BusinessType } from '../types/auth';
import ActiveChat from '../components/chat/ActiveChat';
import ProductModal from '../components/business/ProductModal';

const BusinessDashboard: React.FC = () => {
  const { user, business, createBusiness, logout, updateBusiness } = useAuth();
  const { getAllUnreadCount, clearActiveChat } = useChat();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const navigate = useNavigate();
  
  // State for editing business details
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedBusiness, setEditedBusiness] = useState<Partial<Business> | null>(null);
  
  // States for management modals
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMessagesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clearActiveChat();
    navigate('/business-messages');
  };
  
  // Edit business details handlers
  const startEditing = () => {
    if (business) {
      setEditedBusiness({
        name: business.name,
        description: business.description,
        location: business.location,
        contactInfo: business.contactInfo,
        businessHours: { ...business.businessHours }
      });
      setIsEditing(true);
    }
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    setEditedBusiness(null);
  };
  
  const saveBusinessDetails = async () => {
    if (editedBusiness) {
      try {
        await updateBusiness(editedBusiness);
        setIsEditing(false);
        setEditedBusiness(null);
      } catch (error) {
        console.error("Failed to update business details:", error);
      }
    }
  };
  
  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editedBusiness) {
      setEditedBusiness({
        ...editedBusiness,
        [name]: value
      });
    }
  };
  
  const handleHoursChange = (day: string, value: string) => {
    if (editedBusiness && editedBusiness.businessHours) {
      setEditedBusiness({
        ...editedBusiness,
        businessHours: {
          ...editedBusiness.businessHours,
          [day]: value
        }
      });
    }
  };

  // Product management handlers
  const openProductModal = (item: any = null) => {
    setEditingItem(item);
    setShowProductModal(true);
  };
  
  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingItem(null);
  };
  
  const handleSaveProduct = async (productData: any) => {
    if (!business) return;
    
    try {
      let updatedProducts;
      
      // Determine which field to update based on business type
      if (business.businessType === 'store') {
        // If editing an existing product, replace it; otherwise, add a new one
        if (editingItem) {
          updatedProducts = business.items?.map(item => 
            item.id === productData.id ? productData : item
          ) || [productData];
        } else {
          updatedProducts = [...(business.items || []), productData];
        }
        
        await updateBusiness({ items: updatedProducts });
      } 
      else if (business.businessType === 'restaurant') {
        if (editingItem) {
          updatedProducts = business.menu?.map(item => 
            item.id === productData.id ? productData : item
          ) || [productData];
        } else {
          updatedProducts = [...(business.menu || []), productData];
        }
        
        await updateBusiness({ menu: updatedProducts });
      } 
      else if (business.businessType === 'housing') {
        if (editingItem) {
          updatedProducts = business.rooms?.map(room => 
            room.id === productData.id ? productData : room
          ) || [productData];
        } else {
          updatedProducts = [...(business.rooms || []), productData];
        }
        
        await updateBusiness({ rooms: updatedProducts });
      }
      
      closeProductModal();
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };
  
  const handleDeleteProduct = async (itemId: string) => {
    if (!business) return;
    
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      // Determine which field to update based on business type
      if (business.businessType === 'store') {
        const updatedItems = business.items?.filter(item => item.id !== itemId) || [];
        await updateBusiness({ items: updatedItems });
      } 
      else if (business.businessType === 'restaurant') {
        const updatedMenu = business.menu?.filter(item => item.id !== itemId) || [];
        await updateBusiness({ menu: updatedMenu });
      } 
      else if (business.businessType === 'housing') {
        const updatedRooms = business.rooms?.filter(room => room.id !== itemId) || [];
        await updateBusiness({ rooms: updatedRooms });
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // If no business exists, show create business form
  if (!business) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CreateBusinessForm onBusinessCreated={createBusiness} />
      </div>
    );
  }

  // Business dashboard content
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
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
              <button 
                onClick={handleLogout}
                className="flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
          <p className="text-gray-600 mb-6">{business.description}</p>
          
          {/* Dashboard tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {['Overview', 'Analytics', 'Reviews', 'Management'].map((tab) => (
                <button
                  key={tab}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.toLowerCase() 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          
          {/* Dashboard content based on active tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">Business Details</h2>
                  {!isEditing ? (
                    <button
                      onClick={startEditing}
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit className="mr-1" /> Edit Details
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={saveBusinessDetails}
                        className="flex items-center text-green-600 hover:text-green-800"
                      >
                        <FaSave className="mr-1" /> Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center text-red-600 hover:text-red-800"
                      >
                        <FaTimes className="mr-1" /> Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                {!isEditing ? (
                  // View mode - display business details
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Business Type</h3>
                      <p className="mt-1">{business.businessType.charAt(0).toUpperCase() + business.businessType.slice(1)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="mt-1">{business.location}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                      <p className="mt-1">{business.contactInfo}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Business Hours</h3>
                      <div className="mt-1">
                        {business.businessHours && Object.entries(business.businessHours).map(([day, hours]) => (
                          <div key={day} className="text-sm">
                            <span className="font-medium capitalize">{day}:</span> {hours}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit mode - form for editing business details
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editedBusiness?.name || ''}
                          onChange={handleBusinessChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={editedBusiness?.location || ''}
                          onChange={handleBusinessChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                        <input
                          type="text"
                          name="contactInfo"
                          value={editedBusiness?.contactInfo || ''}
                          onChange={handleBusinessChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={editedBusiness?.description || ''}
                          onChange={handleBusinessChange}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Business Hours</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {editedBusiness?.businessHours && Object.entries(editedBusiness.businessHours).map(([day, hours]) => (
                          <div key={day} className="flex items-center">
                            <span className="font-medium capitalize w-24">{day}:</span>
                            <input
                              type="text"
                              value={hours}
                              onChange={(e) => handleHoursChange(day, e.target.value)}
                              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g. 9:00 AM - 5:00 PM"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h2 className="font-bold text-lg mb-4">Business Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-3xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-500">Views This Week</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-3xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-500">New Customers</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-3xl font-bold text-purple-600">0.0</div>
                    <div className="text-sm text-gray-500">Average Rating</div>
                  </div>
                </div>
                <div className="mt-6 text-center text-sm text-gray-500">
                  Analytics data will be populated as your business receives traffic.
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h2 className="font-bold text-lg mb-4">Customer Reviews</h2>
                {business.reviews && business.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {business.reviews.map(review => (
                      <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{review.userName}</div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <div className="text-xs text-gray-400 mt-2">{review.date}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Reviews will appear here as customers rate your business.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'management' && (
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h2 className="font-bold text-lg mb-4">
                  {business.businessType === 'store' && 'Product Management'}
                  {business.businessType === 'restaurant' && 'Menu Management'}
                  {business.businessType === 'housing' && 'Room Management'}
                </h2>
                
                {/* Type-specific management interface */}
                {business.businessType === 'store' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-600">Manage your store's product catalog.</p>
                      <button 
                        onClick={() => openProductModal()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                      >
                        <FaPlus className="mr-2" /> Add Product
                      </button>
                    </div>
                    {business.items && business.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {business.items.map(item => (
                          <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            {item.photo && (
                              <div className="mb-3 h-40 overflow-hidden rounded-md">
                                <img 
                                  src={item.photo} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Product+Image'}
                                />
                              </div>
                            )}
                            <div className="font-medium mb-2">{item.name}</div>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">${item.price.toFixed(2)}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                            <div className="flex mt-4 space-x-2">
                              <button 
                                onClick={() => openProductModal(item)}
                                className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100"
                                title="Edit Product"
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(item.id)}
                                className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100"
                                title="Delete Product"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 mb-4">No products added yet.</p>
                        <button 
                          onClick={() => openProductModal()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          <FaPlus className="inline-block mr-2" /> Add Your First Product
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {business.businessType === 'restaurant' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-600">Manage your restaurant's menu items.</p>
                      <button 
                        onClick={() => openProductModal()}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                      >
                        <FaPlus className="mr-2" /> Add Menu Item
                      </button>
                    </div>
                    {business.menu && business.menu.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {business.menu.map(item => (
                          <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            {item.photo && (
                              <div className="mb-3 h-40 overflow-hidden rounded-md">
                                <img 
                                  src={item.photo} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Menu+Item'}
                                />
                              </div>
                            )}
                            <div className="font-medium mb-2">{item.name}</div>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">${item.price.toFixed(2)}</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                {item.category}
                              </span>
                            </div>
                            <div className="flex mt-4 space-x-2">
                              <button 
                                onClick={() => openProductModal(item)}
                                className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100"
                                title="Edit Menu Item"
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(item.id)}
                                className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100"
                                title="Delete Menu Item"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 mb-4">No menu items added yet.</p>
                        <button 
                          onClick={() => openProductModal()}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                          <FaPlus className="inline-block mr-2" /> Add Your First Menu Item
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {business.businessType === 'housing' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-gray-600">Manage your housing units.</p>
                      <button 
                        onClick={() => openProductModal()}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                      >
                        <FaPlus className="mr-2" /> Add Room/Unit
                      </button>
                    </div>
                    {business.rooms && business.rooms.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {business.rooms.map(room => (
                          <div key={room.id} className="bg-white p-4 rounded-lg border border-gray-200">
                            {room.photos && room.photos[0] && (
                              <div className="mb-3 h-40 overflow-hidden rounded-md">
                                <img 
                                  src={room.photos[0]} 
                                  alt={room.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Housing+Unit'}
                                />
                              </div>
                            )}
                            <div className="font-medium mb-2">{room.name}</div>
                            <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <span className="text-gray-500">Bedrooms:</span> {room.bedrooms}
                              </div>
                              <div>
                                <span className="text-gray-500">Bathrooms:</span> {room.bathrooms}
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-500">Price:</span> <span className="font-bold">${room.price.toFixed(2)}/month</span>
                              </div>
                            </div>
                            {room.amenities && room.amenities.length > 0 && (
                              <div className="mb-3">
                                <span className="text-gray-500 text-sm">Amenities:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {room.amenities.map((amenity: string, index: number) => (
                                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                      {amenity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {room.available ? 'Available' : 'Not Available'}
                              </span>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => openProductModal(room)}
                                  className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100"
                                  title="Edit Housing Unit"
                                >
                                  <FaEdit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(room.id)}
                                  className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100"
                                  title="Delete Housing Unit"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500 mb-4">No housing units added yet.</p>
                        <button 
                          onClick={() => openProductModal()}
                          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                        >
                          <FaPlus className="inline-block mr-2" /> Add Your First Housing Unit
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showProductModal && (
        <ProductModal
          isOpen={showProductModal}
          onClose={closeProductModal}
          onSave={handleSaveProduct}
          initialData={editingItem}
          businessType={business.businessType}
        />
      )}
      <ActiveChat />
    </div>
  );
};

interface CreateBusinessFormProps {
  onBusinessCreated: (business: Partial<Business>) => Promise<Business>;
}

// Interface for form data
interface BusinessFormData {
  name: string;
  businessType: BusinessType;
  description: string;
  location: string;
  contactInfo: string;
  businessHours: { [key: string]: string };
  email: string;
  phone: string;
  address: string;
  city: string;
}

const CreateBusinessForm: React.FC<CreateBusinessFormProps> = ({ onBusinessCreated }) => {
  const [step, setStep] = useState<number>(1);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { logout } = useAuth();
  const { getAllUnreadCount, clearActiveChat } = useChat();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<BusinessFormData>({
    name: '',
    businessType: 'store',
    description: '',
    location: '',
    contactInfo: '',
    businessHours: {
      monday: '9:00 AM - 5:00 PM',
      tuesday: '9:00 AM - 5:00 PM',
      wednesday: '9:00 AM - 5:00 PM',
      thursday: '9:00 AM - 5:00 PM',
      friday: '9:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMessagesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    clearActiveChat();
    navigate('/business-messages');
  };

  // Helper functions
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle business hours changes
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Extract day from input name (format: businessHours.day)
    const day = name.split('.')[1];
    
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If confirmation has not been shown yet, show it
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    
    // Create business object from form data
    const newBusiness: Partial<Business> = {
      name: formData.name,
      businessType: formData.businessType,
      description: formData.description,
      location: `${formData.address}, ${formData.city}`,
      contactInfo: `Email: ${formData.email}, Phone: ${formData.phone}`,
      businessHours: formData.businessHours
    };
    
    onBusinessCreated(newBusiness);
  };

  // Helper functions for business type icons and names
  const getTypeIcon = (type: BusinessType) => {
    switch (type) {
      case 'store':
        return <FaStore className="h-6 w-6" />;
      case 'restaurant':
        return <FaUtensils className="h-6 w-6" />;
      case 'housing':
        return <FaHome className="h-6 w-6" />;
      default:
        return <FaStore className="h-6 w-6" />;
    }
  };

  const getBusinessTypeName = (type: BusinessType) => {
    switch (type) {
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

  const handleConfirmBusinessCreation = () => {
    // Create business object from form data
    const newBusiness: Partial<Business> = {
      name: formData.name,
      businessType: formData.businessType,
      description: formData.description,
      location: `${formData.address}, ${formData.city}`,
      contactInfo: `Email: ${formData.email}, Phone: ${formData.phone}`,
      businessHours: formData.businessHours
    };
    
    onBusinessCreated(newBusiness);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Your Business Profile</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
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
            <button 
              onClick={handleLogout}
              className="flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center w-full max-w-2xl">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className="flex flex-col items-center">
                    <div 
                      className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${
                        step === stepNumber 
                          ? 'border-blue-500 bg-blue-500 text-white' 
                          : step > stepNumber 
                            ? 'border-green-500 bg-green-500 text-white' 
                            : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      {step > stepNumber ? (
                        <FaCheck className="h-5 w-5" />
                      ) : (
                        <span className="font-medium">{stepNumber}</span>
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      step === stepNumber 
                        ? 'text-blue-500' 
                        : step > stepNumber 
                          ? 'text-green-500' 
                          : 'text-gray-500'
                    }`}>
                      {stepNumber === 1 ? 'Basic Info' : 
                       stepNumber === 2 ? 'Contact & Location' : 
                       'Business Hours'}
                    </span>
                  </div>
                  
                  {stepNumber < 3 && (
                    <div className={`flex-1 h-0.5 ${
                      step > stepNumber ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Business Information */}
          {step === 1 && !showConfirmation && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your business name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type*</label>
                <div className="mb-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${formData.businessType === 'store' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'}`}
                      onClick={() => setFormData(prev => ({ ...prev, businessType: 'store' }))}
                    >
                      <FaStore className="mx-auto text-2xl mb-2 text-blue-500" />
                      <div className="font-medium">Store</div>
                      <div className="text-xs text-gray-500">Retail products</div>
                    </div>
                    <div 
                      className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${formData.businessType === 'restaurant' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-400'}`}
                      onClick={() => setFormData(prev => ({ ...prev, businessType: 'restaurant' }))}
                    >
                      <FaUtensils className="mx-auto text-2xl mb-2 text-green-500" />
                      <div className="font-medium">Restaurant</div>
                      <div className="text-xs text-gray-500">Food services</div>
                    </div>
                    <div 
                      className={`border rounded-lg p-4 text-center cursor-pointer transition-all ${formData.businessType === 'housing' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-400'}`}
                      onClick={() => setFormData(prev => ({ ...prev, businessType: 'housing' }))}
                    >
                      <FaHome className="mx-auto text-2xl mb-2 text-purple-500" />
                      <div className="font-medium">Housing</div>
                      <div className="text-xs text-gray-500">Accommodation</div>
                    </div>
                  </div>
                </div>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                  className="hidden"
                >
                  <option value="store">Store</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="housing">Housing</option>
                </select>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
                  <p className="font-medium text-yellow-800">Important: </p>
                  <p className="text-yellow-700">Business type <span className="font-bold">cannot be changed</span> after account creation. Choose carefully.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your business"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Contact and Location */}
          {step === 2 && !showConfirmation && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="business@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(123) 456-7890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                <textarea
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional contact information (website, social media, etc.)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address*</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full address or area"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                * Required fields
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Business Hours */}
          {step === 3 && !showConfirmation && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Set Your Business Hours</p>
              
              <div className="space-y-3 mb-6">
                {Object.keys(formData.businessHours).map((day) => (
                  <div key={day} className="flex items-center">
                    <span className="w-24 capitalize text-sm font-medium">{day}:</span>
                    <input
                      type="text"
                      name={`businessHours.${day}`}
                      value={formData.businessHours[day]}
                      onChange={handleHoursChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="9:00 AM - 5:00 PM or Closed"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmation(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Review & Create
                </button>
              </div>
            </div>
          )}
          
          {/* Confirmation Step */}
          {showConfirmation && (
            <div className="bg-white p-6 md:p-8 rounded-lg shadow">
              <h3 className="text-lg font-bold text-center mb-6">Business Registration Confirmation</h3>
              
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FaExclamationTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      Important: Once created, your business type cannot be changed.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 space-y-6">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center p-5 bg-gray-50 rounded-lg w-64">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-3 
                      ${formData.businessType === 'store' ? 'bg-blue-100 text-blue-500' : 
                        formData.businessType === 'restaurant' ? 'bg-green-100 text-green-500' : 'bg-purple-100 text-purple-500'}`}>
                      {getTypeIcon(formData.businessType)}
                    </div>
                    <h4 className="text-lg font-medium">{getBusinessTypeName(formData.businessType)}</h4>
                    <p className="text-sm text-gray-500 text-center">
                      {formData.businessType === 'store' ? 'Products & Retail' : 
                       formData.businessType === 'restaurant' ? 'Food & Beverage Services' : 'Accommodation & Rentals'}
                    </p>
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h4 className="font-medium">Business Information</h4>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.email || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{formData.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <span className="font-medium">{formData.address || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-medium">{formData.city || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>
            
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={() => setShowConfirmation(false)}
                >
                  <FaArrowLeft className="mr-2" /> Go Back & Edit
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  onClick={handleConfirmBusinessCreation}
                >
                  <FaCheck className="mr-2" /> Confirm & Create Business
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Active Chat Window */}
      <ActiveChat />
    </div>
  );
};

export default BusinessDashboard; 