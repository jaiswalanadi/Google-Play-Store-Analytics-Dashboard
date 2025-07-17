import { useState, useEffect, useMemo } from 'react';
import { generateAnalytics, generateChartData } from '../utils/analytics';
import { filterApps } from '../utils/dataProcessor';
import { LOADING_MESSAGES } from '../utils/constants';

/**
 * Custom hook for analytics generation and management
 * @param {Array} apps - Apps data
 * @param {Array} reviews - Reviews data
 * @returns {Object} Analytics state and methods
 */
export const useAnalytics = (apps = [], reviews = []) => {
  const [state, setState] = useState({
    analytics: null,
    chartData: null,
    isGenerating: false,
    error: null,
    filters: {},
    filteredApps: []
  });

  /**
   * Applies filters to apps data
   */
  const filteredApps = useMemo(() => {
    if (!apps.length) return [];
    
    try {
      return filterApps(apps, state.filters);
    } catch (error) {
      console.error('Error filtering apps:', error);
      return apps;
    }
  }, [apps, state.filters]);

  /**
   * Generates analytics for current data
   */
  const generateCurrentAnalytics = useMemo(() => {
    if (!filteredApps.length) return null;
    
    try {
      setState(prev => ({ ...prev, isGenerating: true, error: null }));
      
      const analytics = generateAnalytics(filteredApps, reviews);
      const chartData = generateChartData(filteredApps);
      
      return { analytics, chartData };
    } catch (error) {
      console.error('Error generating analytics:', error);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: error.message 
      }));
      return null;
    }
  }, [filteredApps, reviews]);

  /**
   * Updates analytics when data changes
   */
  useEffect(() => {
    if (generateCurrentAnalytics) {
      setState(prev => ({
        ...prev,
        analytics: generateCurrentAnalytics.analytics,
        chartData: generateCurrentAnalytics.chartData,
        filteredApps,
        isGenerating: false,
        error: null
      }));
    }
  }, [generateCurrentAnalytics, filteredApps]);

  /**
   * Updates filters
   * @param {Object} newFilters - New filter criteria
   */
  const updateFilters = (newFilters) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  };

  /**
   * Resets filters
   */
  const resetFilters = () => {
    setState(prev => ({
      ...prev,
      filters: {}
    }));
  };

  /**
   * Gets analytics for specific category
   * @param {string} category - Category name
   * @returns {Object} Category-specific analytics
   */
  const getCategoryAnalytics = (category) => {
    if (!state.analytics) return null;
    
    const categoryData = state.analytics.categories.categoryPerformance.find(
      cat => cat.category === category
    );
    
    if (!categoryData) return null;
    
    const categoryApps = filteredApps.filter(app => app.category === category);
    const categoryReviews = reviews.filter(review => 
      categoryApps.some(app => app.app === review.app)
    );
    
    return {
      ...categoryData,
      apps: categoryApps,
      reviews: categoryReviews,
      chartData: generateChartData(categoryApps)
    };
  };

  /**
   * Gets top performing apps by metric
   * @param {string} metric - Metric to sort by ('rating', 'installs', 'reviews')
   * @param {number} limit - Number of apps to return
   * @returns {Array} Top performing apps
   */
  const getTopApps = (metric = 'rating', limit = 10) => {
    if (!filteredApps.length) return [];
    
    const sortedApps = [...filteredApps].sort((a, b) => {
      switch (metric) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'installs':
          return b.installsNumber - a.installsNumber;
        case 'reviews':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });
    
    return sortedApps.slice(0, limit);
  };

  /**
   * Gets apps with poor performance
   * @param {number} limit - Number of apps to return
   * @returns {Array} Poorly performing apps
   */
  const getPoorPerformingApps = (limit = 10) => {
    if (!filteredApps.length) return [];
    
    return filteredApps
      .filter(app => app.rating && app.rating < 3.0)
      .sort((a, b) => a.rating - b.rating)
      .slice(0, limit);
  };

  /**
   * Searches apps by name or category
   * @param {string} query - Search query
   * @returns {Array} Matching apps
   */
  const searchApps = (query) => {
    if (!query || !filteredApps.length) return [];
    
    const lowerQuery = query.toLowerCase();
    
    return filteredApps.filter(app => 
      app.app.toLowerCase().includes(lowerQuery) ||
      app.category.toLowerCase().includes(lowerQuery) ||
      (app.genres && app.genres.toLowerCase().includes(lowerQuery))
    );
  };

  /**
   * Gets comparison data between categories
   * @param {Array} categories - Categories to compare
   * @returns {Object} Comparison data
   */
  const getCategoryComparison = (categories) => {
    if (!state.analytics || !categories.length) return null;
    
    const comparison = categories.map(category => {
      const categoryData = state.analytics.categories.categoryPerformance.find(
        cat => cat.category === category
      );
      
      return categoryData || {
        category,
        appCount: 0,
        avgRating: 0,
        totalInstalls: 0,
        avgInstalls: 0
      };
    });
    
    return {
      categories: comparison,
      metrics: {
        avgRating: comparison.map(cat => ({ category: cat.category, value: cat.avgRating })),
        appCount: comparison.map(cat => ({ category: cat.category, value: cat.appCount })),
        totalInstalls: comparison.map(cat => ({ category: cat.category, value: cat.totalInstalls }))
      }
    };
  };

  return {
    // Core analytics data
    analytics: state.analytics,
    chartData: state.chartData,
    filteredApps: state.filteredApps,
    
    // State
    isGenerating: state.isGenerating,
    error: state.error,
    filters: state.filters,
    
    // Computed properties
    hasAnalytics: !!state.analytics,
    isReady: !!state.analytics && !state.isGenerating,
    totalApps: filteredApps.length,
    totalCategories: state.analytics?.categories?.totalCategories || 0,
    
    // Filter methods
    updateFilters,
    resetFilters,
    
    // Data retrieval methods
    getCategoryAnalytics,
    getTopApps,
    getPoorPerformingApps,
    searchApps,
    getCategoryComparison
  };
};
