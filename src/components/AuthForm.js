// src/components/AuthForm.js - Authentication form component
import { AlertCircle, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const { signIn, signUp, signInWithGoogle, loading, error, clearError } = useAuth();

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.displayName) {
        errors.displayName = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, formData.displayName);
      } else {
        result = await signIn(formData.email, formData.password);
      }

      if (result.success) {
        // Reset form on success
        setFormData({ email: '', password: '', displayName: '', confirmPassword: '' });
        setValidationErrors({});
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    await signInWithGoogle();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: '', password: '', displayName: '', confirmPassword: '' });
    setValidationErrors({});
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-pink flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-pink-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gradient-pink mb-2">
              {isSignUp ? '✨ Join Goal Tracker' : '💖 Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? 'Start tracking your goals today!' : 'Continue your journey to success'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-rose-50/80 border border-rose-200 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-rose-500 mr-2" />
                <p className="text-rose-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Display Name - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className={`w-full p-4 border rounded-xl transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                    validationErrors.displayName 
                      ? 'border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200' 
                      : 'border-pink-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200'
                  }`}
                  placeholder="Enter your full name"
                />
                {validationErrors.displayName && (
                  <p className="text-rose-600 text-xs mt-2">{validationErrors.displayName}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full p-4 border rounded-xl transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                  validationErrors.email 
                    ? 'border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200' 
                    : 'border-pink-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200'
                }`}
                placeholder="Enter your email"
              />
              {validationErrors.email && (
                <p className="text-rose-600 text-xs mt-2">{validationErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full p-4 pr-12 border rounded-xl transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                    validationErrors.password 
                      ? 'border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200' 
                      : 'border-pink-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-rose-600 text-xs mt-2">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password - Only for Sign Up */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full p-4 border rounded-xl transition-all duration-200 bg-white/70 backdrop-blur-sm ${
                    validationErrors.confirmPassword 
                      ? 'border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200' 
                      : 'border-pink-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-200'
                  }`}
                  placeholder="Confirm your password"
                />
                {validationErrors.confirmPassword && (
                  <p className="text-rose-600 text-xs mt-2">{validationErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                isSignUp ? '✨ Create Account' : '💖 Sign In'
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-4 text-sm text-gray-500 font-medium">or</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 py-4 px-6 rounded-xl font-semibold flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 border border-gray-300 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={toggleAuthMode}
                className="ml-2 text-primary-600 hover:text-primary-800 font-medium underline transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;