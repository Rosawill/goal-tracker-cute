// src/components/FilterBar.js - Filter buttons component
import React from 'react';

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentFilter === key
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;