import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa';
import FormInput from '../components/auth/FormInput';
import Button from '../components/auth/Button';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const success = await register(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: 'student'
        },
        formData.password
      );
      
      if (success) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        
        // Clear form data
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Navigate to login page after a short delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please sign in with your new account.' 
            } 
          });
        }, 1500);
      }
    } catch (err) {
      setErrors({ 
        form: 'Registration failed. Please try again later.' 
      });
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="h-20 w-20 rounded-full bg-baby-blue bg-opacity-20 flex items-center justify-center">
              <FaUserGraduate className="text-4xl text-baby-blue" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">User Sign Up</h1>
          <p className="text-gray-600 mt-2">Join QuickFind and discover local services</p>
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute top-9 left-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <FormInput
                id="firstName"
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                error={errors.firstName}
                name="firstName"
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <div className="absolute top-9 left-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <FormInput
                id="lastName"
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                error={errors.lastName}
                name="lastName"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute top-9 left-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              error={errors.email}
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
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              error={errors.password}
              name="password"
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <div className="absolute top-9 left-3 flex items-center pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              error={errors.confirmPassword}
              name="confirmPassword"
              className="pl-10"
            />
          </div>
          
          <div className="mt-2">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-baby-blue focus:ring-baby-blue border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-baby-blue hover:underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={loading}
            fullWidth
            className="mt-6"
          >
            Create Account
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-baby-blue hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <Link 
            to="/business-register" 
            className="flex items-center justify-center w-full py-2 px-4 border border-baby-blue rounded-lg text-baby-blue hover:bg-baby-blue hover:bg-opacity-10 transition-colors"
          >
            Register as a Business
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 