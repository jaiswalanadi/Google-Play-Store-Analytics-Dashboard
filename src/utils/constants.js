// Application constants and configuration

export const APP_CONFIG = {
  name: 'Google Play Store Analytics',
  version: '1.0.0',
  description: 'Comprehensive analytics dashboard for Google Play Store apps',
};

export const DATA_FILES = {
  APPS: '/data/googleplaystore.csv',
  REVIEWS: '/data/googleplaystore_user_reviews.csv',
};

export const CHART_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export const CATEGORY_COLORS = {
  'ART_AND_DESIGN': '#3b82f6',
  'GAME': '#10b981',
  'TOOLS': '#f59e0b',
  'BUSINESS': '#ef4444',
  'FAMILY': '#8b5cf6',
  'PRODUCTIVITY': '#06b6d4',
  'EDUCATION': '#84cc16',
  'LIFESTYLE': '#f97316',
  'ENTERTAINMENT': '#ec4899',
  'COMMUNICATION': '#6366f1'
};

export const RATING_RANGES = {
  EXCELLENT: { min: 4.5, max: 5.0, color: '#10b981', label: 'Excellent (4.5-5.0)' },
  GOOD: { min: 4.0, max: 4.5, color: '#84cc16', label: 'Good (4.0-4.5)' },
  AVERAGE: { min: 3.0, max: 4.0, color: '#f59e0b', label: 'Average (3.0-4.0)' },
  BELOW_AVERAGE: { min: 2.0, max: 3.0, color: '#f97316', label: 'Below Average (2.0-3.0)' },
  POOR: { min: 1.0, max: 2.0, color: '#ef4444', label: 'Poor (1.0-2.0)' }
};

export const INSTALL_RANGES = [
  { label: '0-1K', min: 0, max: 1000 },
  { label: '1K-10K', min: 1000, max: 10000 },
  { label: '10K-100K', min: 10000, max: 100000 },
  { label: '100K-1M', min: 100000, max: 1000000 },
  { label: '1M-10M', min: 1000000, max: 10000000 },
  { label: '10M-100M', min: 10000000, max: 100000000 },
  { label: '100M+', min: 100000000, max: Infinity }
];

export const SENTIMENT_TYPES = {
  POSITIVE: { label: 'Positive', color: '#10b981' },
  NEUTRAL: { label: 'Neutral', color: '#f59e0b' },
  NEGATIVE: { label: 'Negative', color: '#ef4444' }
};

export const CHART_DIMENSIONS = {
  SMALL: { width: 300, height: 200 },
  MEDIUM: { width: 500, height: 300 },
  LARGE: { width: 800, height: 400 },
  FULL: { width: '100%', height: 500 }
};

export const API_ENDPOINTS = {
  // Future API endpoints if needed
  APPS: '/api/apps',
  REVIEWS: '/api/reviews',
  ANALYTICS: '/api/analytics'
};

export const ERROR_MESSAGES = {
  DATA_LOAD_FAILED: 'Failed to load data. Please check your internet connection.',
  INVALID_DATA_FORMAT: 'Invalid data format detected.',
  PROCESSING_ERROR: 'Error occurred while processing data.',
  CHART_RENDER_ERROR: 'Failed to render chart.',
  GENERIC_ERROR: 'An unexpected error occurred.'
};

export const LOADING_MESSAGES = {
  LOADING_DATA: 'Loading app data...',
  PROCESSING_DATA: 'Processing analytics...',
  GENERATING_CHARTS: 'Generating visualizations...',
  CALCULATING_INSIGHTS: 'Calculating insights...'
};

export const DASHBOARD_SECTIONS = {
  OVERVIEW: 'overview',
  CATEGORIES: 'categories',
  RATINGS: 'ratings', 
  SENTIMENT: 'sentiment',
  TRENDS: 'trends',
  REPORTS: 'reports'
};
