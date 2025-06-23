// src/components/StatsCard.js - Statistics display component
import { Calendar, Check, Flag } from 'lucide-react';
import React from 'react';

const StatsCard = ({ stats }) => {
  const statItems = [
    {
      icon: Flag,
      value: stats.total,
      label: 'Total Goals',
      color: 'text-blue-500'
    },
    {
      icon: Check,
      value: stats.completed,
      label: 'Completed',
      color: 'text-green-500'
    },
    {
      icon: Calendar,
      value: stats.inProgress,
      label: 'In Progress',
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {statItems.map(({ icon: Icon, value, label, color }, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Icon className={`w-8 h-8 ${color} mr-3`} />
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-gray-600">{label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;