import _ from 'lodash';
import {
  calculateBasicStats,
  calculateCorrelation,
  calculateFrequencyAnalysis,
  analyzeRatingDistribution,
  analyzeCategoryPerformance,
  calculateMarketShare,
  identifyOutliers
} from './statisticalAnalysis';

/**
 * Generates comprehensive analytics for Google Play Store data
 * @param {Array} apps - Processed apps data
 * @param {Array} reviews - Processed reviews data
 * @returns {Object} Complete analytics object
 */
export const generateAnalytics = (apps, reviews) => {
  try {
    const analytics = {
      overview: generateOverviewAnalytics(apps),
      categories: generateCategoryAnalytics(apps),
      ratings: generateRatingAnalytics(apps),
      sentiment: generateSentimentAnalytics(reviews),
      correlations: generateCorrelationAnalytics(apps),
      insights: generateInsights(apps, reviews),
      generatedAt: new Date().toISOString()
    };
    
    return analytics;
  } catch (error) {
    console.error('Error generating analytics:', error);
    throw new Error(`Analytics generation failed: ${error.message}`);
  }
};

/**
 * Generates overview analytics
 * @param {Array} apps - Apps data
 * @returns {Object} Overview analytics
 */
export const generateOverviewAnalytics = (apps) => {
  const totalApps = apps.length;
  const appsWithRatings = apps.filter(app => app.hasRating);
  const paidApps = apps.filter(app => app.isPaid);
  const popularApps = apps.filter(app => app.isPopular);
  
  const totalInstalls = _.sum(apps.map(app => app.installsNumber));
  const totalReviews = _.sum(apps.map(app => app.reviews));
  const avgRating = _.mean(apps.filter(app => app.rating).map(app => app.rating));
  
  return {
    totalApps,
    appsWithRatings: appsWithRatings.length,
    paidApps: paidApps.length,
    freeApps: totalApps - paidApps.length,
    popularApps: popularApps.length,
    totalInstalls,
    totalReviews,
    avgRating: avgRating || 0,
    ratingsPercentage: (appsWithRatings.length / totalApps) * 100,
    paidAppsPercentage: (paidApps.length / totalApps) * 100,
    popularAppsPercentage: (popularApps.length / totalApps) * 100
  };
};

/**
 * Generates category-specific analytics
 * @param {Array} apps - Apps data
 * @returns {Object} Category analytics
 */
export const generateCategoryAnalytics = (apps) => {
  const categoryPerformance = analyzeCategoryPerformance(apps);
  const marketShare = calculateMarketShare(apps);
  const topCategories = calculateFrequencyAnalysis(apps.map(app => app.category), 10);
  
  return {
    categoryPerformance,
    marketShare,
    topCategories,
    totalCategories: new Set(apps.map(app => app.category)).size
  };
};

/**
 * Generates rating-specific analytics
 * @param {Array} apps - Apps data
 * @returns {Object} Rating analytics
 */
export const generateRatingAnalytics = (apps) => {
  const ratings = apps.filter(app => app.rating).map(app => app.rating);
  const ratingDistribution = analyzeRatingDistribution(ratings);
  const ratingStats = calculateBasicStats(ratings);
  const ratingOutliers = identifyOutliers(ratings);
  
  // Top rated apps
  const topRatedApps = apps
    .filter(app => app.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  
  // Poorly rated apps
  const poorlyRatedApps = apps
    .filter(app => app.rating < 3.0 && app.rating > 0)
    .sort((a, b) => a.rating - b.rating)
    .slice(0, 10);
  
  return {
    ratingDistribution,
    ratingStats,
    ratingOutliers,
    topRatedApps,
    poorlyRatedApps,
    highRatedPercentage: (apps.filter(app => app.rating >= 4.0).length / apps.filter(app => app.rating).length) * 100
  };
};

/**
 * Generates sentiment analytics from reviews
 * @param {Array} reviews - Reviews data
 * @returns {Object} Sentiment analytics
 */
export const generateSentimentAnalytics = (reviews) => {
  const sentimentCounts = {
    positive: reviews.filter(r => r.isPositive).length,
    negative: reviews.filter(r => r.isNegative).length,
    neutral: reviews.filter(r => r.isNeutral).length
  };
  
  const total = reviews.length;
  
  const sentimentPercentages = {
    positive: (sentimentCounts.positive / total) * 100,
    negative: (sentimentCounts.negative / total) * 100,
    neutral: (sentimentCounts.neutral / total) * 100
  };
  
  const polarityStats = calculateBasicStats(
    reviews.map(r => r.sentimentPolarity).filter(p => !isNaN(p))
  );
  
  const subjectivityStats = calculateBasicStats(
    reviews.map(r => r.sentimentSubjectivity).filter(s => !isNaN(s))
  );
  
  return {
    totalReviews: total,
    sentimentCounts,
    sentimentPercentages,
    polarityStats,
    subjectivityStats
  };
};

/**
 * Generates correlation analytics
 * @param {Array} apps - Apps data
 * @returns {Object} Correlation analytics
 */
export const generateCorrelationAnalytics = (apps) => {
  const appsWithAllData = apps.filter(app => 
    app.rating && app.reviews && app.installsNumber && !isNaN(app.priceNumber)
  );
  
  const ratings = appsWithAllData.map(app => app.rating);
  const reviews = appsWithAllData.map(app => app.reviews);
  const installs = appsWithAllData.map(app => app.installsNumber);
  const sizes = appsWithAllData.map(app => app.sizeBytes).filter(s => s !== null);
  const prices = appsWithAllData.map(app => app.priceNumber);
  
  return {
    ratingVsReviews: calculateCorrelation(ratings, reviews),
    ratingVsInstalls: calculateCorrelation(ratings, installs),
    reviewsVsInstalls: calculateCorrelation(reviews, installs),
    sizeVsInstalls: calculateCorrelation(
      appsWithAllData.filter(app => app.sizeBytes !== null).map(app => app.sizeBytes),
      appsWithAllData.filter(app => app.sizeBytes !== null).map(app => app.installsNumber)
    ),
    priceVsRating: calculateCorrelation(prices, ratings),
    priceVsInstalls: calculateCorrelation(prices, installs)
  };
};

/**
 * Generates key insights and recommendations
 * @param {Array} apps - Apps data
 * @param {Array} reviews - Reviews data
 * @returns {Object} Insights and recommendations
 */
export const generateInsights = (apps, reviews) => {
  const insights = [];
  const recommendations = [];
  
  // Category insights
  const categoryPerformance = analyzeCategoryPerformance(apps);
  const topCategory = categoryPerformance[0];
  
  insights.push({
    type: 'category',
    title: 'Dominant Category',
    description: `${topCategory.category} leads with ${topCategory.appCount} apps (${((topCategory.appCount / apps.length) * 100).toFixed(1)}% market share)`,
    metric: topCategory.appCount
  });
  
  // Rating insights
  const highRatedApps = apps.filter(app => app.rating >= 4.5).length;
  const ratingPercentage = (highRatedApps / apps.filter(app => app.rating).length) * 100;
  
  insights.push({
    type: 'rating',
    title: 'Quality Distribution',
    description: `${ratingPercentage.toFixed(1)}% of rated apps have excellent ratings (4.5+)`,
    metric: ratingPercentage
  });
  
  // Install insights
  const popularApps = apps.filter(app => app.isPopular).length;
  const popularityRate = (popularApps / apps.length) * 100;
  
  insights.push({
    type: 'installs',
    title: 'Popular Apps',
    description: `${popularityRate.toFixed(1)}% of apps have achieved 1M+ installs`,
    metric: popularityRate
  });
  
  // Sentiment insights
  if (reviews.length > 0) {
    const positiveReviews = reviews.filter(r => r.isPositive).length;
    const positivePercentage = (positiveReviews / reviews.length) * 100;
    
    insights.push({
      type: 'sentiment',
      title: 'User Sentiment',
      description: `${positivePercentage.toFixed(1)}% of reviews express positive sentiment`,
      metric: positivePercentage
    });
  }
  
  // Generate recommendations
  if (topCategory.avgRating < 4.0) {
    recommendations.push({
      category: topCategory.category,
      type: 'quality',
      title: 'Improve App Quality',
      description: `Focus on improving ${topCategory.category} apps quality (current avg: ${topCategory.avgRating.toFixed(2)})`
    });
  }
  
  const lowPerformingCategories = categoryPerformance
    .filter(cat => cat.avgRating < 3.5)
    .slice(0, 3);
  
  if (lowPerformingCategories.length > 0) {
    recommendations.push({
      type: 'opportunity',
      title: 'Market Opportunities',
      description: `Consider entering or improving apps in: ${lowPerformingCategories.map(cat => cat.category).join(', ')}`
    });
