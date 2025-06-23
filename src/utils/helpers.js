// src/utils/helpers.js - Utility functions for the application
export const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  
  export const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  export const formatDateTime = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  export const sortGoalsByPriority = (goals) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    
    return [...goals].sort((a, b) => {
      // First sort by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then sort by priority
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      
      // Finally sort by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };
  
  export const filterGoals = (goals, filter) => {
    switch (filter) {
      case 'completed':
        return goals.filter(goal => goal.completed);
      case 'active':
        return goals.filter(goal => !goal.completed);
      case 'high-priority':
        return goals.filter(goal => goal.priority === 'high' && !goal.completed);
      default:
        return goals;
    }
  };
  
  export const getGoalStats = (goals) => {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const inProgress = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const priorityStats = goals.reduce((acc, goal) => {
      acc[goal.priority] = (acc[goal.priority] || 0) + 1;
      return acc;
    }, {});
  
    return {
      total,
      completed,
      inProgress,
      completionRate,
      highPriority: priorityStats.high || 0,
      mediumPriority: priorityStats.medium || 0,
      lowPriority: priorityStats.low || 0
    };
  };
  
  export const validateGoalData = (goalData) => {
    const errors = {};
    
    if (!goalData.title || goalData.title.trim().length === 0) {
      errors.title = 'Goal title is required';
    }
    
    if (goalData.title && goalData.title.length > 100) {
      errors.title = 'Goal title must be less than 100 characters';
    }
    
    if (goalData.description && goalData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
    
    if (!['high', 'medium', 'low'].includes(goalData.priority)) {
      errors.priority = 'Priority must be high, medium, or low';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };