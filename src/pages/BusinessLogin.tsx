import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaEnvelope, FaLock, FaUserGraduate, FaBuilding, FaStore, FaUtensils, FaHome } from 'react-icons/fa';
import FormInput from '../components/auth/FormInput';
import Button from '../components/auth/Button';
import { useAuth } from '../context/AuthContext';

const BusinessLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      const success = await login(email, password, true); // true indicates business login
      if (success) {
        navigate('/business-dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <FaBriefcase className="text-4xl text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Business Portal</h1>
          <p className="text-gray-600 mt-2">Manage your QuickFind business account</p>
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <FaStore className="text-red-500" />
            </div>
            <span className="text-xs mt-1">Store</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <FaUtensils className="text-green-500" />
            </div>
            <span className="text-xs mt-1">Restaurant</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <FaHome className="text-purple-500" />
            </div>
            <span className="text-xs mt-1">Housing</span>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute top-9 left-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <FormInput
              id="email"
              name="email"
              label="Business Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="business@example.com"
              required
              className="pl-10"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              className="pl-10"
            />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <Link to="/business-forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            fullWidth
            className="mt-6 bg-gradient-to-r from-blue-500 to-blue-700"
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have a business account?{' '}
            <Link to="/business-register" className="text-blue-600 hover:underline">
              Register your business
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <FaUserGraduate className="text-gray-500" />
            <p className="text-gray-600 font-semibold">Looking for user login?</p>
          </div>
          <Link 
            to="/login" 
            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go to User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessLogin; 