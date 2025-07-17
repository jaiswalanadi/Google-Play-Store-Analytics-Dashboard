import { useState, useEffect, useCallback } from 'react';
import { loadAllData, validateDataQuality } from '../utils/csvLoader';
import { processAppsData, processReviewsData, removeDuplicateApps, mergeAppsWithSentiment } from '../utils/dataProcessor';
import { LOADING_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

/**
 * Custom hook for loading and processing Google Play Store data
 * @returns {Object} Data loading state and methods
 */
export const useDataLoader = () => {
  const [state, setState] = useState({
    rawData: null,
    processedData: null,
    isLoading: false,
    error: null,
    loadingMessage: '',
    dataQuality: null
  });

  /**
   * Updates loading state with message
   * @param {boolean} isLoading - Loading status
   * @param {string} message - Loading message
   */
  const setLoadingState = useCallback((isLoading, message = '') => {
    setState(prev => ({
      ...prev,
      isLoading,
      loadingMessage: message,
      error: isLoading ? null : prev.error
    }));
  }, []);

  /**
   * Sets error state
   * @param {string} error - Error message
   */
  const setError = useCallback((error) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error,
      loadingMessage: ''
    }));
  }, []);

  /**
   * Loads raw data from CSV files
   */
  const loadRawData = useCallback(async () => {
    try {
      setLoadingState(true, LOADING_MESSAGES.LOADING_DATA);
      
      const data = await loadAllData();
      
      setState(prev => ({
        ...prev,
        rawData: data,
        error: null
      }));
      
      return data;
    } catch (error) {
      console.error('Failed to load raw data:', error);
      setError(error.message || ERROR_MESSAGES.DATA_LOAD_FAILED);
      throw error;
    }
  }, [setLoadingState, setError]);

  /**
   * Processes raw data into clean, usable format
   * @param {Object} rawData - Raw data from CSV files
   */
  const processData = useCallback(async (rawData) => {
    try {
      setLoadingState(true, LOADING_MESSAGES.PROCESSING_DATA);
      
      // Process apps data
      const processedApps = processAppsData(rawData.apps);
      const cleanApps = removeDuplicateApps(processedApps);
      
      // Process reviews data
      const processedReviews = processReviewsData(rawData.reviews);
      
      // Merge apps with sentiment data
      const enrichedApps = mergeAppsWithSentiment(cleanApps, processedReviews);
      
      // Validate data quality
      const appsQuality = validateDataQuality(enrichedApps);
      const reviewsQuality = validateDataQuality(processedReviews);
      
      const processedData = {
        apps: enrichedApps,
        reviews: processedReviews,
        processedAt: new Date().toISOString(),
        stats: {
          totalApps: enrichedApps.length,
          totalReviews: processedReviews.length,
          duplicatesRemoved: processedApps.length - cleanApps.length
        }
      };
      
      setState(prev => ({
        ...prev,
        processedData,
        dataQuality: {
          apps: appsQuality,
          reviews: reviewsQuality
        },
        isLoading: false,
        loadingMessage: ''
      }));
      
      return processedData;
    } catch (error) {
      console.error('Failed to process data:', error);
      setError(error.message || ERROR_MESSAGES.PROCESSING_ERROR);
      throw error;
    }
  }, [setLoadingState, setError]);

  /**
   * Loads and processes all data
   */
  const loadData = useCallback(async () => {
    try {
      const rawData = await loadRawData();
      const processedData = await processData(rawData);
      return processedData;
    } catch (error) {
      console.error('Data loading failed:', error);
      throw error;
    }
  }, [loadRawData, processData]);

  /**
   * Reloads data from scratch
   */
  const reloadData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      rawData: null,
      processedData: null,
      error: null,
      dataQuality: null
    }));
    
    return await loadData();
  }, [loadData]);

  /**
   * Auto-load data on mount
   */
  useEffect(() => {
    loadData().catch(error => {
      console.error('Auto-load failed:', error);
    });
  }, [loadData]);

  return {
    // Data
    rawData: state.rawData,
    processedData: state.processedData,
    apps: state.processedData?.apps || [],
    reviews: state.processedData?.reviews || [],
    
    // State
    isLoading: state.isLoading,
    error: state.error,
    loadingMessage: state.loadingMessage,
    dataQuality: state.dataQuality,
    
    // Computed properties
    hasData: !!state.processedData,
    isReady: !!state.processedData && !state.isLoading && !state.error,
    
    // Methods
    loadData,
    reloadData,
    processData
  };
};
