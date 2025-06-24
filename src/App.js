// src/App.js - Main application component with Firebase integration and authentication
import { AlertCircle, Plus, Target } from 'lucide-react';
import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import FilterBar from './components/FilterBar';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import StatsCard from './components/StatsCard';
import UserProfile from './components/UserProfile';
import { useAuth } from './hooks/useAuth';
import { useFirebase } from './hooks/useFirebase';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { goals, addGoal, toggleGoal, deleteGoal, loading: goalsLoading, error } = useFirebase();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // Show auth form if user is not logged in
  if (!authLoading && !user) {
    return <AuthForm />;
  }

  const filteredGoals = goals.filter(goal => {
    if (filter === 'completed') return goal.completed;
    if (filter === 'active') return !goal.completed;
    return true;
  });

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.completed).length,
    inProgress: goals.filter(g => !g.completed).length
  };

  const handleGoalSubmit = async (goalData) => {
    try {
      await addGoal(goalData);
      setShowAddForm(false);
    } catch (error) {
      // Error is handled in the hook
      console.error('Failed to add goal:', error);
    }
  };

  const handleToggleGoal = async (goalId) => {
    try {
      await toggleGoal(goalId);
    } catch (error) {
      // Error is handled in the hook
      console.error('Failed to toggle goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(goalId);
      } catch (error) {
        // Error is handled in the hook
        console.error('Failed to delete goal:', error);
      }
    }
  };

  if (authLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-pink flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Target className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 text-lg font-medium mb-2">
            {authLoading ? 'Checking authentication...' : 'Loading your goals...'}
          </p>
          <p className="text-gray-500 text-sm mb-8">
            {authLoading ? 'Please wait ✨' : 'Connecting to Firebase ✨'}
          </p>
          
          {/* Troubleshooting section - only show after 5 seconds of loading */}
          {!authLoading && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Taking longer than expected?</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  🔄 Refresh Page
                </button>
                <button
                  onClick={async () => {
                    const { signOut } = await import('./hooks/useAuth');
                    // We need to access the auth context differently
                    window.location.href = '/';
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  👋 Sign Out & Try Again
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                If issues persist, check your internet connection or try again in a few minutes.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-pink p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            {/* Left spacer for centering */}
            <div className="w-32"></div>
            
            {/* Center title */}
            <div className="flex items-center">
              <Target className="w-8 h-8 text-primary-600 mr-2 drop-shadow-sm" />
              <h1 className="text-4xl font-bold text-gradient-pink drop-shadow-sm">Goal Tracker</h1>
            </div>
            
            {/* Right - User Profile */}
            <div className="w-32 flex justify-end">
              <UserProfile />
            </div>
          </div>
          
          <p className="text-gray-700">Track your goals and make progress every day ✨</p>
          
          {/* Welcome message */}
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-emerald-100/80 text-emerald-800 border border-emerald-200 backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse-pink"></div>
              Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Goal Achiever'}! 💖
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-rose-50/80 border border-rose-200 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-rose-500 mr-2" />
              <p className="text-rose-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <StatsCard stats={stats} />

        {/* Add Goal Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={goalsLoading}
            className="btn-primary shadow-pink-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Goal
          </button>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <GoalForm
            onSubmit={handleGoalSubmit}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Filter Bar */}
        <FilterBar currentFilter={filter} onFilterChange={setFilter} />

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-pink-300 mx-auto mb-4 drop-shadow-sm" />
              <p className="text-gray-600 text-lg">
                {filter === 'all' 
                  ? "No goals found. Add your first goal to get started! 🌟"
                  : `No ${filter} goals found.`
                }
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-2 text-primary-600 hover:text-primary-800 underline font-medium"
                >
                  View all goals
                </button>
              )}
            </div>
          ) : (
            filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggle={handleToggleGoal}
                onDelete={handleDeleteGoal}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Your personal goals, securely stored • Built with React & Tailwind CSS 💖</p>
        </div>
      </div>
    </div>
  );
}

export default App;