// src/components/FilterBar.js - Filter buttons component with pink theme
import React from 'react';

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All', emoji: '📋' },
    { key: 'active', label: 'Active', emoji: '🎯' },
    { key: 'completed', label: 'Completed', emoji: '✅' }
  ];

  return (
    <div className="flex gap-3 mb-6">
      {filters.map(({ key, label, emoji }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
            currentFilter === key
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-pink-glow transform scale-105'
              : 'bg-white/80 text-gray-700 hover:bg-white/90 shadow-md hover:shadow-lg border border-pink-100 backdrop-blur-sm hover:scale-105'
          }`}
        >
          <span>{emoji}</span>
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;