import _ from 'lodash';
import * as math from 'mathjs';

/**
 * Calculates basic statistical measures for a numeric array
 * @param {Array} values - Array of numeric values
 * @returns {Object} Statistical measures
 */
export const calculateBasicStats = (values) => {
  const cleanValues = values.filter(v => v !== null && v !== undefined && !isNaN(v));
  
  if (cleanValues.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      mode: null,
      min: 0,
      max: 0,
      std: 0,
      variance: 0,
      q1: 0,
      q3: 0,
      iqr: 0
    };
  }
  
  const sorted = [...cleanValues].sort((a, b) => a - b);
  const n = cleanValues.length;
  
  return {
    count: n,
    mean: _.mean(cleanValues),
    median: math.median(cleanValues),
    mode: math.mode(cleanValues),
    min: Math.min(...cleanValues),
    max: Math.max(...cleanValues),
    std: math.std(cleanValues),
    variance: math.var(cleanValues),
    q1: math.quantileSeq(sorted, 0.25),
    q3: math.quantileSeq(sorted, 0.75),
    iqr: math.quantileSeq(sorted, 0.75) - math.quantileSeq(sorted, 0.25)
  };
};

/**
 * Calculates correlation coefficient between two arrays
 * @param {Array} x - First array of values
 * @param {Array} y - Second array of values
 * @returns {number} Pearson correlation coefficient
 */
export const calculateCorrelation = (x, y) => {
  if (x.length !== y.length || x.length === 0) {
    return 0;
  }
  
  // Filter out null/undefined pairs
  const pairs = x.map((xi, i) => [xi, y[i]])
    .filter(([xi, yi]) => 
      xi !== null && xi !== undefined && !isNaN(xi) &&
      yi !== null && yi !== undefined && !isNaN(yi)
    );
  
  if (pairs.length < 2) {
    return 0;
  }
  
  const xClean = pairs.map(p => p[0]);
  const yClean = pairs.map(p => p[1]);
  
  try {
    const correlation = math.corr(xClean, yClean);
    return isNaN(correlation) ? 0 : correlation;
  } catch (error) {
    console.warn('Correlation calculation failed:', error);
    return 0;
  }
};

/**
 * Performs frequency analysis on categorical data
 * @param {Array} values - Array of categorical values
 * @param {number} topN - Number of top categories to return
 * @returns {Array} Array of {value, count, percentage} objects
 */
export const calculateFrequencyAnalysis = (values, topN = 10) => {
  const cleanValues = values.filter(v => v !== null && v !== undefined && v !== '');
  const total = cleanValues.length;
  
  if (total === 0) {
    return [];
  }
  
  const frequencies = _.countBy(cleanValues);
  
  return Object.entries(frequencies)
    .map(([value, count]) => ({
      value,
      count,
      percentage: (count / total) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
};

/**
 * Calculates distribution of ratings
 * @param {Array} ratings - Array of rating values
 * @returns {Object} Rating distribution analysis
 */
export const analyzeRatingDistribution = (ratings) => {
  const cleanRatings = ratings.filter(r => r !== null && !isNaN(r) && r > 0);
  
  if (cleanRatings.length === 0) {
    return {
      total: 0,
      distribution: {},
      stats: calculateBasicStats([])
    };
  }
  
  const distribution = {
    '1.0-1.9': cleanRatings.filter(r => r >= 1.0 && r < 2.0).length,
    '2.0-2.9': cleanRatings.filter(r => r >= 2.0 && r < 3.0).length,
    '3.0-3.9': cleanRatings.filter(r => r >= 3.0 && r < 4.0).length,
    '4.0-4.4': cleanRatings.filter(r => r >= 4.0 && r < 4.5).length,
    '4.5-5.0': cleanRatings.filter(r => r >= 4.5 && r <= 5.0).length
  };
  
  return {
    total: cleanRatings.length,
    distribution,
    stats: calculateBasicStats(cleanRatings)
  };
};

/**
 * Analyzes category performance metrics
 * @param {Array} apps - Array of app objects
 * @returns {Array} Category analysis results
 */
export const analyzeCategoryPerformance = (apps) => {
  const categoryGroups = _.groupBy(apps, 'category');
  
  return Object.entries(categoryGroups).map(([category, categoryApps]) => {
    const ratings = categoryApps.map(app => app.rating).filter(r => r && !isNaN(r));
    const installs = categoryApps.map(app => app.installsNumber);
    const reviews = categoryApps.map(app => app.reviews);
    
    return {
      category,
      appCount: categoryApps.length,
      avgRating: _.mean(ratings) || 0,
      medianRating: math.median(ratings) || 0,
      totalInstalls: _.sum(installs),
      avgInstalls: _.mean(installs) || 0,
      totalReviews: _.sum(reviews),
      avgReviews: _.mean(reviews) || 0,
      paidAppsCount: categoryApps.filter(app => app.isPaid).length,
      popularAppsCount: categoryApps.filter(app => app.isPopular).length,
      ratingStats: calculateBasicStats(ratings)
    };
  }).sort((a, b) => b.appCount - a.appCount);
};

/**
 * Calculates market share analysis
 * @param {Array} apps - Array of app objects
 * @returns {Object} Market share analysis
 */
export const calculateMarketShare = (apps) => {
  const totalApps = apps.length;
  const totalInstalls = _.sum(apps.map(app => app.installsNumber));
  
  const categoryStats = analyzeCategoryPerformance(apps);
  
  const marketShare = categoryStats.map(cat => ({
    ...cat,
    appMarketShare: (cat.appCount / totalApps) * 100,
    installMarketShare: (cat.totalInstalls / totalInstalls) * 100
  }));
  
  return {
    totalApps,
    totalInstalls,
    categoryBreakdown: marketShare
  };
};

/**
 * Identifies outliers using IQR method
 * @param {Array} values - Array of numeric values
 * @returns {Object} Outlier analysis
 */
export const identifyOutliers = (values) => {
  const cleanValues = values.filter(v => v !== null && !isNaN(v));
  
  if (cleanValues.length < 4) {
    return {
      outliers: [],
      lowerBound: 0,
      upperBound: 0,
      outlierCount: 0
    };
  }
  
  const stats = calculateBasicStats(cleanValues);
  const lowerBound = stats.q1 - (1.5 * stats.iqr);
  const upperBound = stats.q3 + (1.5 * stats.iqr);
  
  const outliers = cleanValues.filter(v => v < lowerBound || v > upperBound);
  
  return {
    outliers,
    lowerBound,
    upperBound,
    outlierCount: outliers.length,
    outlierPercentage: (outliers.length / cleanValues.length) * 100
  };
};

/**
 * Calculates trend analysis for time-based data
 * @param {Array} data - Array of {date, value} objects
 * @returns {Object} Trend analysis
 */
export const calculateTrendAnalysis = (data) => {
  if (!Array.isArray(data) || data.length < 2) {
    return {
      trend: 'insufficient_data',
      slope: 0,
      correlation: 0
    };
  }
  
  const sortedData = data
    .filter(d => d.date && d.value !== null && !isNaN(d.value))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  if (sortedData.length < 2) {
    return {
      trend: 'insufficient_data',
      slope: 0,
      correlation: 0
    };
  }
  
  const x = sortedData.map((_, i) => i); // Time indices
  const y = sortedData.map(d => d.value);
  
  const correlation = calculateCorrelation(x, y);
  
  // Simple linear regression to calculate slope
  const n = x.length;
  const sumX = _.sum(x);
  const sumY = _.sum(y);
  const sumXY = _.sum(x.map((xi, i) => xi * y[i]));
  const sumXX = _.sum(x.map(xi => xi * xi));
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  let trend = 'stable';
  if (slope > 0.1) trend = 'increasing';
  else if (slope < -0.1) trend = 'decreasing';
  
  return {
    trend,
    slope,
    correlation,
    dataPoints: sortedData.length
  };
};
