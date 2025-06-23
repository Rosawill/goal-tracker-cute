// src/components/GoalCard.js - Individual goal display component
import { Check, X } from 'lucide-react';
import React from 'react';
import { formatDate, getPriorityColor } from '../utils/helpers';

const GoalCard = ({ goal, onToggle, onDelete }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 transition-all hover:shadow-lg ${
        goal.completed ? 'border-green-500 bg-green-50' : 'border-indigo-500'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onToggle(goal.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                goal.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-indigo-500'
              }`}
            >
              {goal.completed && <Check className="w-4 h-4" />}
            </button>
            <h3 className={`text-lg font-semibold ${
              goal.completed ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}>
              {goal.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
              {goal.priority}
            </span>
          </div>
          {goal.description && (
            <p className={`text-gray-600 mb-2 ${goal.completed ? 'line-through' : ''}`}>
              {goal.description}
            </p>
          )}
          <p className="text-sm text-gray-400">
            Created: {formatDate(goal.createdAt)}
          </p>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-red-500 hover:text-red-700 p-2 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GoalCard;