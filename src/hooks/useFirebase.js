// src/hooks/useFirebase.js - Custom hook for Firebase operations with authentication
import { useEffect, useState } from 'react';
import firebaseService from '../services/firebase';
import { useAuth } from './useAuth';

export const useFirebase = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      // User not logged in, clear goals and stop loading
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates for the current user
    const unsubscribe = firebaseService.subscribeToGoals(user.uid, (updatedGoals) => {
      setGoals(updatedGoals);
      setLoading(false);
      
      // Clear any previous errors on successful load
      if (updatedGoals.length >= 0) {
        setError(null);
      }
    });

    // Set a timeout to handle cases where Firebase doesn't respond
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError('Failed to connect to database. Please check your internet connection.');
      }
    }, 10000); // 10 second timeout

    // Cleanup function
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [user]); // Remove 'loading' dependency

  const addGoal = async (goalData) => {
    if (!user) {
      throw new Error('User must be logged in to add goals');
    }

    try {
      setError(null);
      await firebaseService.addGoal(goalData, user.uid);
      // No need to update local state - real-time listener will handle it
    } catch (err) {
      const errorMessage = 'Failed to add goal. Please try again.';
      setError(errorMessage);
      console.error('Error adding goal:', err);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
      throw err;
    }
  };

  const toggleGoal = async (goalId) => {
    if (!user) {
      throw new Error('User must be logged in to update goals');
    }

    try {
      setError(null);
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        await firebaseService.toggleGoal(goalId, goal.completed, user.uid);
      }
    } catch (err) {
      const errorMessage = 'Failed to update goal. Please try again.';
      setError(errorMessage);
      console.error('Error toggling goal:', err);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
      throw err;
    }
  };

  const deleteGoal = async (goalId) => {
    if (!user) {
      throw new Error('User must be logged in to delete goals');
    }

    try {
      setError(null);
      await firebaseService.deleteGoal(goalId, user.uid);
    } catch (err) {
      const errorMessage = 'Failed to delete goal. Please try again.';
      setError(errorMessage);
      console.error('Error deleting goal:', err);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
      throw err;
    }
  };

  const updateGoal = async (goalId, updates) => {
    if (!user) {
      throw new Error('User must be logged in to update goals');
    }

    try {
      setError(null);
      await firebaseService.updateGoal(goalId, updates, user.uid);
    } catch (err) {
      const errorMessage = 'Failed to update goal. Please try again.';
      setError(errorMessage);
      console.error('Error updating goal:', err);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
      throw err;
    }
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    toggleGoal,
    deleteGoal,
    updateGoal
  };
};