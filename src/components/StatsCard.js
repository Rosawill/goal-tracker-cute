// src/components/StatsCard.js - Statistics display component with pink theme
import { Calendar, Check, Flag } from 'lucide-react';
import React from 'react';

const StatsCard = ({ stats }) => {
  const statItems = [
    {
      icon: Flag,
      value: stats.total,
      label: 'Total Goals',
      color: 'text-primary-500',
      bgColor: 'bg-gradient-to-br from-primary-50 to-primary-100',
      borderColor: 'border-primary-200'
    },
    {
      icon: Check,
      value: stats.completed,
      label: 'Completed',
      color: 'text-emerald-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: 'border-emerald-200'
    },
    {
      icon: Calendar,
      value: stats.inProgress,
      label: 'In Progress',
      color: 'text-amber-500',
      bgColor: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-amber-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {statItems.map(({ icon: Icon, value, label, color, bgColor, borderColor }, index) => (
        <div key={index} className={`${bgColor} rounded-xl shadow-lg p-6 border ${borderColor} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-105`}>
          <div className="flex items-center">
            <Icon className={`w-8 h-8 ${color} mr-3 drop-shadow-sm`} />
            <div>
              <p className="text-2xl font-bold text-gray-800 drop-shadow-sm">{value}</p>
              <p className="text-gray-600 font-medium">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;