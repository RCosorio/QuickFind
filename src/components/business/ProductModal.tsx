import React, { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { BusinessType } from '../../types/auth';

// Modal for adding/editing products
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  initialData: any | null;
  businessType: BusinessType;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData,
  businessType
}) => {
  // Initialize form data based on business type
  const getInitialFormData = () => {
    if (businessType === 'store') {
      return {
        id: initialData?.id || `item-${Date.now()}`,
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        category: initialData?.category || 'General',
        inStock: initialData?.inStock !== undefined ? initialData.inStock : true,
        photo: initialData?.photo || ''
      };
    } else if (businessType === 'restaurant') {
      return {
        id: initialData?.id || `menu-${Date.now()}`,
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        category: initialData?.category || 'Main Course',
        photo: initialData?.photo || ''
      };
    } else if (businessType === 'housing') {
      return {
        id: initialData?.id || `room-${Date.now()}`,
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        bedrooms: initialData?.bedrooms || 1,
        bathrooms: initialData?.bathrooms || 1,
        available: initialData?.available !== undefined ? initialData.available : true,
        photos: initialData?.photos || [],
        amenities: initialData?.amenities || []
      };
    }
    return {};
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [amenity, setAmenity] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else if (name === 'price') {
      // Convert price to number
      setFormData({
        ...formData,
        [name]: value === '' ? '' : parseFloat(value)
      });
    } else if (name === 'bedrooms' || name === 'bathrooms') {
      // Convert to number for housing
      setFormData({
        ...formData,
        [name]: value === '' ? '' : parseInt(value, 10)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const addAmenity = () => {
    if (amenity.trim() !== '' && businessType === 'housing') {
      setFormData({
        ...formData,
        amenities: [...(formData.amenities || []), amenity.trim()]
      });
      setAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    if (businessType === 'housing' && formData.amenities) {
      const newAmenities = [...formData.amenities];
      newAmenities.splice(index, 1);
      setFormData({
        ...formData,
        amenities: newAmenities
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {initialData ? 'Edit' : 'Add New'} {
                businessType === 'store' ? 'Product' : 
                businessType === 'restaurant' ? 'Menu Item' : 'Housing Unit'
              }
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {businessType === 'housing' ? 'Unit Name' : 'Name'}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder={businessType === 'housing' ? 'e.g. Cozy Studio Apartment' : 'e.g. Product Name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your item..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                  {businessType === 'housing' ? ' per month' : ''}
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step={businessType === 'housing' ? "100" : "0.01"}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              {businessType !== 'housing' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  {businessType === 'restaurant' ? (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Appetizer">Appetizer</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Dessert">Dessert</option>
                      <option value="Beverage">Beverage</option>
                      <option value="Sides">Sides</option>
                      <option value="Special">Special</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Electronics, Clothing, Books"
                    />
                  )}
                </div>
              )}

              {businessType === 'store' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                    In Stock
                  </label>
                </div>
              )}

              {businessType === 'housing' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        required
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.5"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="available"
                      name="available"
                      checked={formData.available}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                      Available for Rent
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => setAmenity(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. WiFi, AC, Parking"
                      />
                      <button
                        type="button"
                        onClick={addAmenity}
                        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                    {formData.amenities && formData.amenities.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {formData.amenities.map((item: string, index: number) => (
                          <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                            <span className="text-sm">{item}</span>
                            <button
                              type="button"
                              onClick={() => removeAmenity(index)}
                              className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                              <FaTimes size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input
                  type="text"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">Enter a URL for your product image</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {initialData ? 'Update' : 'Add'} {
                  businessType === 'store' ? 'Product' : 
                  businessType === 'restaurant' ? 'Menu Item' : 'Housing Unit'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 