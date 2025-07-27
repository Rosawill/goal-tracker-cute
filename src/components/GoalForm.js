// src/components/GoalForm.js - Goal creation form component with pink theme and better spacing
import React, { useState } from 'react';

const GoalForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    // NEW: Timeline fields
    goalType: 'custom',
    dueDate: '',
    isRecurring: false,
    recurringType: 'weekly'
  });

  const handleSubmit = () => {
    if (formData.title.trim()) {
      // Process the form data before submitting
      const goalData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };
      
      onSubmit(goalData);
      setFormData({ 
        title: '', 
        description: '', 
        priority: 'medium',
        goalType: 'custom',
        dueDate: '',
        isRecurring: false,
        recurringType: 'weekly'
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-6 border-l-4 border-primary-400">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center">
        ✨ Add New Goal
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎯 Goal Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full p-4 border border-pink-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
            placeholder="What do you want to achieve?"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📝 Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-4 border border-pink-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
            rows="3"
            placeholder="Tell us more about your goal..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🔥 Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full p-4 border border-pink-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⏰ Goal Type & Timeline
          </label>
          <select
            value={formData.goalType}
            onChange={(e) => handleInputChange('goalType', e.target.value)}
            className="w-full p-4 border border-pink-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
          >
            <option value="custom">📅 Custom Goal</option>
            <option value="daily">☀️ Daily Goal</option>
            <option value="weekly">📊 Weekly Goal</option>
            <option value="monthly">🗓️ Monthly Goal</option>
          </select>
        </div>

        {/* Due Date - show for custom goals or when user wants to set a specific date */}
        {(formData.goalType === 'custom' || formData.goalType === 'weekly' || formData.goalType === 'monthly') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Due Date {formData.goalType !== 'custom' && '(Optional)'}
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              className="w-full p-4 border border-pink-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
            />
          </div>
        )}

        {/* Recurring Options */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isRecurring}
              onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-400"
            />
            <span className="text-sm font-medium text-gray-700">
              🔄 Make this a recurring goal
            </span>
          </label>
          
          {formData.isRecurring && (
            <div className="mt-3">
              <select
                value={formData.recurringType}
                onChange={(e) => handleInputChange('recurringType', e.target.value)}
                className="w-full p-3 border border-pink-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
              >
                <option value="daily">Every Day</option>
                <option value="weekly">Every Week</option>
                <option value="monthly">Every Month</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!formData.title.trim()}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl border-2 border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✨ Add Goal
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg border-2 border-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalForm;