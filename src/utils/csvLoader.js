import Papa from 'papaparse';
import { DATA_FILES, ERROR_MESSAGES } from './constants';

/**
 * Loads and parses CSV data with robust error handling
 * @param {string} filepath - Path to the CSV file
 * @param {Object} options - Papa Parse options
 * @returns {Promise<Object>} Parsed data object with data and metadata
 */
export const loadCSV = async (filepath, options = {}) => {
  try {
    const response = await fetch(filepath);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    
    const defaultOptions = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      delimitersToGuess: [',', '\t', '|', ';'],
      ...options
    };
    
    const result = Papa.parse(csvText, defaultOptions);
    
    if (result.errors.length > 0) {
      console.warn('CSV parsing warnings:', result.errors);
    }
    
    // Clean headers by trimming whitespace
    const cleanedData = result.data.map(row => {
      const cleanedRow = {};
      Object.keys(row).forEach(key => {
        const cleanKey = key.trim();
        cleanedRow[cleanKey] = row[key];
      });
      return cleanedRow;
    });
    
    return {
      data: cleanedData,
      meta: result.meta,
      errors: result.errors
    };
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw new Error(`${ERROR_MESSAGES.DATA_LOAD_FAILED}: ${error.message}`);
  }
};

/**
 * Loads Google Play Store apps data
 * @returns {Promise<Array>} Array of app objects
 */
export const loadAppsData = async () => {
  try {
    const result = await loadCSV(DATA_FILES.APPS);
    
    // Validate required columns
    const requiredColumns = ['App', 'Category', 'Rating', 'Reviews', 'Installs'];
    const missingColumns = requiredColumns.filter(col => 
      !result.meta.fields.includes(col)
    );
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }
    
    return result.data;
  } catch (error) {
    console.error('Error loading apps data:', error);
    throw error;
  }
};

/**
 * Loads Google Play Store reviews data
 * @returns {Promise<Array>} Array of review objects
 */
export const loadReviewsData = async () => {
  try {
    const result = await loadCSV(DATA_FILES.REVIEWS);
    
    // Validate required columns
    const requiredColumns = ['App', 'Sentiment', 'Sentiment_Polarity'];
    const missingColumns = requiredColumns.filter(col => 
      !result.meta.fields.includes(col)
    );
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }
    
    return result.data;
  } catch (error) {
    console.error('Error loading reviews data:', error);
    throw error;
  }
};

/**
 * Loads both datasets concurrently
 * @returns {Promise<Object>} Object containing both apps and reviews data
 */
export const loadAllData = async () => {
  try {
    const [appsData, reviewsData] = await Promise.all([
      loadAppsData(),
      loadReviewsData()
    ]);
    
    return {
      apps: appsData,
      reviews: reviewsData,
      loadedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error loading all data:', error);
    throw error;
  }
};

/**
 * Validates data integrity and returns quality report
 * @param {Array} data - Data array to validate
 * @returns {Object} Data quality report
 */
export const validateDataQuality = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      isValid: false,
      totalRows: 0,
      issues: ['Data is empty or not an array']
    };
  }
  
  const issues = [];
  const totalRows = data.length;
  
  // Check for missing values in critical fields
  const criticalFields = ['App', 'Category'];
  criticalFields.forEach(field => {
    const missingCount = data.filter(row => 
      !row[field] || row[field] === '' || row[field] === 'nan'
    ).length;
    
    if (missingCount > 0) {
      issues.push(`${field}: ${missingCount} missing values (${((missingCount/totalRows)*100).toFixed(1)}%)`);
    }
  });
  
  // Check for duplicates based on App name
  const appNames = data.map(row => row.App).filter(Boolean);
  const uniqueApps = new Set(appNames);
  const duplicateCount = appNames.length - uniqueApps.size;
  
  if (duplicateCount > 0) {
    issues.push(`Found ${duplicateCount} duplicate app entries`);
  }
  
  return {
    isValid: issues.length === 0,
    totalRows,
    uniqueApps: uniqueApps.size,
    duplicates: duplicateCount,
    issues
  };
};
