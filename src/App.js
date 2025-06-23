// src/App.js - Main application component with Firebase integration
import { AlertCircle, Plus, Target } from 'lucide-react';
import React, { useState } from 'react';
import FilterBar from './components/FilterBar';
import GoalCard from './components/GoalCard';
import GoalForm from './components/GoalForm';
import StatsCard from './components/StatsCard';
import { useFirebase } from './hooks/useFirebase';

function App() {
  const { goals, addGoal, toggleGoal, deleteGoal, loading, error } = useFirebase();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 text-lg">Loading your goals...</p>
          <p className="text-gray-500 text-sm mt-2">Connecting to Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-4xl font-bold text-gray-800">Goal Tracker</h1>
          </div>
          <p className="text-gray-600">Track your goals and make progress every day</p>
          {/* Show connection status */}
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              Connected to Firebase
            </span>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <StatsCard stats={stats} />

        {/* Add Goal Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center shadow-lg transition-colors"
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
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {filter === 'all' 
                  ? "No goals found. Add your first goal to get started!"
                  : `No ${filter} goals found.`
                }
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 underline"
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
          <p>Data synced with Firebase • Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;