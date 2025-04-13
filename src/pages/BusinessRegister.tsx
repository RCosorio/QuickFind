import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaEnvelope, FaLock, FaMapMarkerAlt, FaPhone, FaBuilding, FaStore, FaUtensils, FaHome, FaCheckCircle } from 'react-icons/fa';
import FormInput from '../components/auth/FormInput';
import Button from '../components/auth/Button';
import { useAuth } from '../context/AuthContext';
import { BusinessType } from '../types/auth';

const BusinessRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerEmail: '',
    password: '',
    confirmPassword: '',
    businessType: 'store' as BusinessType,
    description: '',
    location: '',
    contactInfo: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { registerBusiness, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact information is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const success = await registerBusiness(
        {
          name: formData.businessName,
          ownerEmail: formData.ownerEmail,
          businessType: formData.businessType,
          description: formData.description,
          location: formData.location,
          contactInfo: formData.contactInfo
        },
        formData.password
      );
      
      if (success) {
        setSuccessMessage('Business account created successfully! Redirecting to login...');
        
        // Clear form data
        setFormData({
          businessName: '',
          ownerEmail: '',
          password: '',
          confirmPassword: '',
          businessType: 'store' as BusinessType,
          description: '',
          location: '',
          contactInfo: ''
        });
        
        // Navigate to business login page after a short delay
        setTimeout(() => {
          navigate('/business-login', { 
            state: { 
              message: 'Business registration successful! Please sign in with your new account.' 
            } 
          });
        }, 2000);
      }
    } catch (err) {
      setErrors({ 
        form: 'Registration failed. Please try again later.' 
      });
    }
  };

  const getBusinessTypeIcon = () => {
    switch (formData.businessType) {
      case 'store':
        return <FaStore className="text-red-500" />;
      case 'restaurant':
        return <FaUtensils className="text-green-500" />;
      case 'housing':
        return <FaHome className="text-purple-500" />;
      default:
        return <FaBuilding className="text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <FaBriefcase className="text-4xl text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Register Your Business</h1>
          <p className="text-gray-600 mt-2">Join QuickFind and connect with users in your area</p>
        </div>
        
        <div className="flex justify-center gap-8 mb-6">
          <div 
            className={`flex flex-col items-center cursor-pointer ${formData.businessType === 'store' ? 'opacity-100 scale-110' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setFormData({...formData, businessType: 'store'})}
          >
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <FaStore className="text-2xl text-red-500" />
            </div>
            <span className="text-sm mt-1 font-medium">Store</span>
          </div>
          <div 
            className={`flex flex-col items-center cursor-pointer ${formData.businessType === 'restaurant' ? 'opacity-100 scale-110' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setFormData({...formData, businessType: 'restaurant'})}
          >
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <FaUtensils className="text-2xl text-green-500" />
            </div>
            <span className="text-sm mt-1 font-medium">Restaurant</span>
          </div>
          <div 
            className={`flex flex-col items-center cursor-pointer ${formData.businessType === 'housing' ? 'opacity-100 scale-110' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setFormData({...formData, businessType: 'housing'})}
          >
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
              <FaHome className="text-2xl text-purple-500" />
            </div>
            <span className="text-sm mt-1 font-medium">Housing</span>
          </div>
        </div>
        
        {errors.form && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.form}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg text-green-700 text-sm flex items-center">
            <FaCheckCircle className="mr-2" />
            {successMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute top-9 left-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <FormInput
                  id="businessName"
                  name="businessName"
                  label="Business Name"
                  type="text"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Your Business Name"
                  required
                  error={errors.businessName}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <div className="absolute top-9 left-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <FormInput
                  id="ownerEmail"
                  name="ownerEmail"
                  label="Business Email"
                  type="email"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  placeholder="business@example.com"
                  required
                  error={errors.ownerEmail}
                  className="pl-10"
                />
              </div>
              
              <div className="mb-4 hidden">
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="store">General Store</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="housing">Housing</option>
                </select>
              </div>
              
              <div className="relative">
                <div className="absolute top-9 left-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <FormInput
                  id="location"
                  name="location"
                  label="Business Location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="123 Business Street, City"
                  required
                  error={errors.location}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute top-9 left-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <FormInput
                  id="contactInfo"
                  name="contactInfo"
                  label="Contact Information"
                  type="text"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="Phone number or other contact info"
                  required
                  error={errors.contactInfo}
                  className="pl-10"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your business"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              
              <div className="relative">
                <div className="absolute top-9 left-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <FormInput
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  error={errors.password}
                  className="pl-10"
                />
              </div>
              
              <div className="relative">
                <div className="absolute top-9 left-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required
                  error={errors.confirmPassword}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 mb-6">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms and Conditions for Businesses
                </Link>
              </label>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              fullWidth
              className="bg-gradient-to-r from-blue-500 to-blue-700"
            >
              Register Business
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/business-login')}
              fullWidth
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Back to Login
            </Button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-2">
            Note: One business account is limited to managing ONE business.
          </p>
          <Link 
            to="/login" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Looking for user login?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegister; 