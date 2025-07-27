// src/components/NavigationTabs.js - Navigation tabs for different goal views
import React from 'react';

const NavigationTabs = ({ currentView, onViewChange, weeklyStats }) => {
  const tabs = [
    { 
      key: 'all', 
      label: 'All Goals', 
      icon: '📋',
      description: 'View all your goals'
    },
    { 
      key: 'week', 
      label: 'This Week', 
      icon: '📅',
      description: 'Focus on weekly goals',
      badge: weeklyStats ? `${weeklyStats.completed}/${weeklyStats.total}` : null
    },
    { 
      key: 'calendar', 
      label: 'Calendar', 
      icon: '🗓️',
      description: 'Timeline view'
    },
    { 
      key: 'progress', 
      label: 'Progress', 
      icon: '📊',
      description: 'Track your achievements'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, label, icon, description, badge }) => (
          <button
            key={key}
            onClick={() => onViewChange(key)}
            className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              currentView === key
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                : 'bg-white/80 text-gray-700 hover:bg-white/90 shadow-md hover:shadow-lg border border-pink-100 backdrop-blur-sm hover:scale-105'
            }`}
            title={description}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
            {badge && (
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                currentView === key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-primary-100 text-primary-700'
              }`}>
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;