// src/components/GoalCard.js - Individual goal display component with pink theme
import { Check, X } from 'lucide-react';
import React from 'react';
import { formatDate, getPriorityColor } from '../utils/helpers';

const GoalCard = ({ goal, onToggle, onDelete }) => {
  return (
    <div
      className={`card transition-all duration-300 ${
        goal.completed ? 'border-l-emerald-400 bg-emerald-50/30' : 'border-l-primary-400'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => onToggle(goal.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                goal.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg'
                  : 'border-gray-300 hover:border-primary-400 hover:shadow-md'
              }`}
            >
              {goal.completed && <Check className="w-4 h-4" />}
            </button>
            <h3 className={`text-lg font-semibold transition-all duration-200 ${
              goal.completed ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}>
              {goal.title}
            </h3>
            <span className={`priority-badge ${getPriorityColor(goal.priority)}`}>
              {goal.priority}
            </span>
          </div>
          {goal.description && (
            <p className={`text-gray-600 mb-2 transition-all duration-200 ${goal.completed ? 'line-through opacity-75' : ''}`}>
              {goal.description}
            </p>
          )}
          <p className="text-sm text-gray-400">
            Created: {formatDate(goal.createdAt)}
          </p>
        </div>
        <button
          onClick={() => onDelete(goal.id)}
          className="text-rose-400 hover:text-rose-600 p-2 transition-colors rounded-lg hover:bg-rose-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GoalCard;