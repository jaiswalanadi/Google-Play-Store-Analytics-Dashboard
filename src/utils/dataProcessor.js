import _ from 'lodash';
import { INSTALL_RANGES } from './constants';

/**
 * Converts size string to bytes
 * @param {string} sizeString - Size string like "19M", "8.7M", "14k"
 * @returns {number} Size in bytes
 */
export const convertSizeToBytes = (sizeString) => {
  if (!sizeString || sizeString === 'Varies with device') {
    return null;
  }
  
  const sizeStr = String(sizeString).toLowerCase();
  const numericValue = parseFloat(sizeStr);
  
  if (sizeStr.includes('k')) {
    return numericValue * 1024;
  } else if (sizeStr.includes('m')) {
    return numericValue * 1024 * 1024;
  } else if (sizeStr.includes('g')) {
    return numericValue * 1024 * 1024 * 1024;
  }
  
  return numericValue;
};

/**
 * Converts install string to numeric value
 * @param {string} installString - Install string like "10,000+", "1,000,000+"
 * @returns {number} Numeric install count
 */
export const convertInstallsToNumber = (installString) => {
  if (!installString) return 0;
  
  const installStr = String(installString)
    .replace(/[,+]/g, '')
    .trim();
  
  return parseInt(installStr) || 0;
};

/**
 * Converts price string to numeric value
 * @param {string} priceString - Price string like "$4.99", "Free"
 * @returns {number} Numeric price
 */
export const convertPriceToNumber = (priceString) => {
  if (!priceString || priceString === 'Free' || priceString === '0') {
    return 0;
  }
  
  const priceStr = String(priceString).replace(', '');
  return parseFloat(priceStr) || 0;
};

/**
 * Categorizes install count into ranges
 * @param {number} installs - Number of installs
 * @returns {string} Install range label
 */
export const categorizeInstalls = (installs) => {
  const range = INSTALL_RANGES.find(range => 
    installs >= range.min && installs < range.max
  );
  return range ? range.label : 'Unknown';
};

/**
 * Cleans and processes raw app data
 * @param {Array} rawData - Raw app data from CSV
 * @returns {Array} Processed app data
 */
export const processAppsData = (rawData) => {
  if (!Array.isArray(rawData)) {
    throw new Error('Invalid data format: expected array');
  }

  return rawData
    .filter(app => app.App && app.Category) // Remove rows with missing critical data
    .map(app => ({
      app: app.App?.trim(),
      category: app.Category?.trim(),
      rating: parseFloat(app.Rating) || null,
      reviews: parseInt(app.Reviews) || 0,
      size: app.Size?.trim(),
      sizeBytes: convertSizeToBytes(app.Size),
      installs: app.Installs?.trim(),
      installsNumber: convertInstallsToNumber(app.Installs),
      installsCategory: categorizeInstalls(convertInstallsToNumber(app.Installs)),
      type: app.Type?.trim(),
      price: app.Price,
      priceNumber: convertPriceToNumber(app.Price),
      contentRating: app['Content Rating']?.trim(),
      genres: app.Genres?.trim(),
      lastUpdated: app['Last Updated']?.trim(),
      currentVersion: app['Current Ver']?.trim(),
      androidVersion: app['Android Ver']?.trim(),
      // Derived fields
      isPaid: convertPriceToNumber(app.Price) > 0,
      hasRating: parseFloat(app.Rating) && parseFloat(app.Rating) > 0,
      isPopular: convertInstallsToNumber(app.Installs) >= 1000000
    }))
    .filter(app => app.app && app.category); // Final filter for clean data
};

/**
 * Processes review data and calculates sentiment metrics
 * @param {Array} rawReviews - Raw reviews data from CSV
 * @returns {Array} Processed reviews data
 */
export const processReviewsData = (rawReviews) => {
  if (!Array.isArray(rawReviews)) {
    throw new Error('Invalid data format: expected array');
  }

  return rawReviews
    .filter(review => 
      review.App && 
      review.Sentiment && 
      review.Sentiment !== 'nan'
    )
    .map(review => ({
      app: review.App?.trim(),
      translatedReview: review.Translated_Review?.trim(),
      sentiment: review.Sentiment?.trim(),
      sentimentPolarity: parseFloat(review.Sentiment_Polarity) || 0,
      sentimentSubjectivity: parseFloat(review.Sentiment_Subjectivity) || 0,
      // Derived fields
      isPositive: review.Sentiment?.toLowerCase() === 'positive',
      isNegative: review.Sentiment?.toLowerCase() === 'negative',
      isNeutral: review.Sentiment?.toLowerCase() === 'neutral'
    }));
};

/**
 * Removes duplicate apps based on app name, keeping the one with most reviews
 * @param {Array} apps - Array of app objects
 * @returns {Array} Deduplicated apps
 */
export const removeDuplicateApps = (apps) => {
  const groupedApps = _.groupBy(apps, 'app');
  
  return Object.values(groupedApps).map(appGroup => {
    if (appGroup.length === 1) {
      return appGroup[0];
    }
    
    // Keep the app with most reviews
    return _.maxBy(appGroup, 'reviews');
  });
};

/**
 * Filters apps by various criteria
 * @param {Array} apps - Array of app objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered apps
 */
export const filterApps = (apps, filters = {}) => {
  let filteredApps = [...apps];
  
  if (filters.category) {
    filteredApps = filteredApps.filter(app => 
      app.category === filters.category
    );
  }
  
  if (filters.minRating) {
    filteredApps = filteredApps.filter(app => 
      app.rating >= filters.minRating
    );
  }
  
  if (filters.type) {
    filteredApps = filteredApps.filter(app => 
      app.type === filters.type
    );
  }
  
  if (filters.contentRating) {
    filteredApps = filteredApps.filter(app => 
      app.contentRating === filters.contentRating
    );
  }
  
  if (filters.isPaid !== undefined) {
    filteredApps = filteredApps.filter(app => 
      app.isPaid === filters.isPaid
    );
  }
  
  return filteredApps;
};

/**
 * Merges apps data with aggregated review sentiment data
 * @param {Array} apps - Processed apps data
 * @param {Array} reviews - Processed reviews data
 * @returns {Array} Apps data enriched with sentiment metrics
 */
export const mergeAppsWithSentiment = (apps, reviews) => {
  // Group reviews by app name and calculate sentiment metrics
  const reviewStats = _.chain(reviews)
    .groupBy('app')
    .mapValues(appReviews => {
      const total = appReviews.length;
      const positive = appReviews.filter(r => r.isPositive).length;
      const negative = appReviews.filter(r => r.isNegative).length;
      const neutral = appReviews.filter(r => r.isNeutral).length;
      
      const avgPolarity = _.meanBy(appReviews, 'sentimentPolarity') || 0;
      const avgSubjectivity = _.meanBy(appReviews, 'sentimentSubjectivity') || 0;
      
      return {
        totalReviews: total,
        positiveCount: positive,
        negativeCount: negative,
        neutralCount: neutral,
        positivePercentage: (positive / total) * 100,
        negativePercentage: (negative / total) * 100,
        neutralPercentage: (neutral / total) * 100,
        avgSentimentPolarity: avgPolarity,
        avgSentimentSubjectivity: avgSubjectivity,
        sentimentScore: avgPolarity // Simplified sentiment score
      };
    })
    .value();
  
  // Merge sentiment stats with apps data
  return apps.map(app => ({
    ...app,
    sentimentData: reviewStats[app.app] || {
      totalReviews: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      positivePercentage: 0,
      negativePercentage: 0,
      neutralPercentage: 0,
      avgSentimentPolarity: 0,
      avgSentimentSubjectivity: 0,
      sentimentScore: 0
    }
  }));
};
