// src/components/WeeklyView.js - Weekly goals view with daily breakdown
import { Check } from 'lucide-react';
import React from 'react';

const WeeklyView = ({ goals, onToggle, onDelete }) => {
  // Get current week dates
  const getCurrentWeek = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek;
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.setDate(diff + i));
      week.push(new Date(date));
    }
    return week;
  };

  const weekDates = getCurrentWeek();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Filter goals for this week
  const weeklyGoals = goals.filter(goal => {
    if (goal.goalType === 'weekly') return true;
    if (goal.goalType === 'daily') return true;
    
    // Check if custom goal is due this week
    if (goal.dueDate) {
      const dueDate = new Date(goal.dueDate);
      const weekStart = weekDates[0];
      const weekEnd = new Date(weekDates[6]);
      weekEnd.setHours(23, 59, 59, 999);
      
      return dueDate >= weekStart && dueDate <= weekEnd;
    }
    
    return false;
  });

  // Calculate weekly stats
  const weeklyStats = {
    total: weeklyGoals.length,
    completed: weeklyGoals.filter(goal => goal.completed).length
  };

  const completionPercentage = weeklyStats.total > 0 
    ? Math.round((weeklyStats.completed / weeklyStats.total) * 100) 
    : 0;

  // Group goals by day
  const getGoalsForDay = (date) => {
    return weeklyGoals.filter(goal => {
      if (goal.goalType === 'weekly') {
        // Weekly goals appear on every day
        return true;
      }
      if (goal.goalType === 'daily') {
        // Daily goals appear on every day
        return true;
      }
      if (goal.dueDate) {
        const dueDate = new Date(goal.dueDate);
        return dueDate.toDateString() === date.toDateString();
      }
      return false;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Weekly Progress Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-pink-100 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            📅 This Week's Goals
          </h2>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary-600">
              {weeklyStats.completed}/{weeklyStats.total}
            </div>
            <div className="text-sm text-gray-600">completed</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div 
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 text-center">
          {completionPercentage}% complete
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const dayGoals = getGoalsForDay(date);
          const dayCompleted = dayGoals.filter(goal => goal.completed).length;
          
          return (
            <div 
              key={index}
              className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 border transition-all duration-200 ${
                isToday(date) 
                  ? 'border-primary-400 shadow-lg ring-2 ring-primary-200' 
                  : 'border-pink-100 shadow-md hover:shadow-lg'
              }`}
            >
              {/* Day Header */}
              <div className="text-center mb-3">
                <div className={`text-sm font-medium ${
                  isToday(date) ? 'text-primary-600' : 'text-gray-600'
                }`}>
                  {dayNames[index]}
                </div>
                <div className={`text-xl font-bold ${
                  isToday(date) ? 'text-primary-700' : 'text-gray-800'
                }`}>
                  {date.getDate()}
                </div>
                {dayGoals.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {dayCompleted}/{dayGoals.length} done
                  </div>
                )}
              </div>

              {/* Goals for this day */}
              <div className="space-y-2">
                {dayGoals.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-4">
                    No goals
                  </div>
                ) : (
                  dayGoals.map((goal) => (
                    <div 
                      key={goal.id}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        goal.completed 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => onToggle(goal.id)}
                          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            goal.completed
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-primary-400'
                          }`}
                        >
                          {goal.completed && <Check className="w-3 h-3" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${
                            goal.completed ? 'line-through' : ''
                          }`}>
                            {goal.title}
                          </div>
                          {goal.goalType && (
                            <div className="text-xs text-gray-500 capitalize">
                              {goal.goalType}
                              {goal.isRecurring && ' • Recurring'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      {weeklyGoals.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-pink-100 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-2">Week Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {weeklyGoals.filter(g => g.goalType === 'daily').length}
              </div>
              <div className="text-xs text-gray-600">Daily Goals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {weeklyGoals.filter(g => g.goalType === 'weekly').length}
              </div>
              <div className="text-xs text-gray-600">Weekly Goals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {weeklyGoals.filter(g => g.goalType === 'custom' && g.dueDate).length}
              </div>
              <div className="text-xs text-gray-600">Custom Goals</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyView;