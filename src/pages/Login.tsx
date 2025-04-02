import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaSchool, FaSearch } from 'react-icons/fa';
import FormInput from '../components/auth/FormInput';
import Button from '../components/auth/Button';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
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
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
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
          <div className="text-2xl font-bold text-baby-blue mb-4">QuickFind</div>
          <div className="flex justify-center mb-3">
            <div className="h-20 w-20 rounded-full bg-baby-blue bg-opacity-20 flex items-center justify-center">
              <FaUser className="text-4xl text-baby-blue" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">User Login</h1>
          <p className="text-gray-600 mt-2">
            <span className="inline-flex items-center">
              <FaSearch className="text-baby-blue mr-1" />
              Access your QuickFind account
            </span>
          </p>
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
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              name="email"
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <div className="absolute top-9 left-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              required
              name="password"
              className="pl-10"
            />
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-baby-blue focus:ring-baby-blue border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <Link to="/forgot-password" className="text-sm text-baby-blue hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            fullWidth
            className="mt-6"
          >
            Sign In
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-baby-blue hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <FaSchool className="text-gray-500" />
            <p className="text-gray-600 font-semibold">Business Owner?</p>
          </div>
          <Link 
            to="/business-login" 
            className="flex items-center justify-center w-full py-2 px-4 border border-baby-blue rounded-lg text-baby-blue hover:bg-baby-blue hover:bg-opacity-10 transition-colors"
          >
            Access Business Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 