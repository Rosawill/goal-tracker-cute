// src/hooks/useAuth.js - Custom hook for authentication
import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/auth';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // Get additional user data from Firestore
        const userData = await authService.getUserDocument(authUser.uid);
        setUser(userData || authUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, displayName) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.signUp(email, password, displayName);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.signIn(email, password);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await authService.signInWithGoogle();
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
      setUser(null);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const result = await authService.resetPassword(email);
      
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};