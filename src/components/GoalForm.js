// src/components/GoalForm.js - Goal creation form component with pink theme
import React, { useState } from 'react';

const GoalForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const handleSubmit = () => {
    if (formData.title.trim()) {
      onSubmit(formData);
      setFormData({ title: '', description: '', priority: 'medium' });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card mb-6 border-l-4 border-primary-400">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        ✨ Add New Goal
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎯 Goal Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="input-field"
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
            className="input-field"
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
            className="input-field"
          >
            <option value="low">🟢 Low Priority</option>
            <option value="medium">🟡 Medium Priority</option>
            <option value="high">🔴 High Priority</option>
          </select>
        </div>
        
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!formData.title.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            ✨ Add Goal
          </button>
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalForm;