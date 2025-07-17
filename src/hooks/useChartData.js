import { useMemo } from 'react';
import { CHART_COLORS, CATEGORY_COLORS, SENTIMENT_TYPES } from '../utils/constants';

/**
 * Custom hook for preparing chart-ready data
 * @param {Object} analytics - Analytics data
 * @param {Object} chartData - Chart data
 * @returns {Object} Chart-ready data for various visualizations
 */
export const useChartData = (analytics, chartData) => {
  
  /**
   * Prepares data for category distribution pie chart
   */
  const categoryPieData = useMemo(() => {
    if (!chartData?.categoryDistribution) return [];
    
    return chartData.categoryDistribution.map((item, index) => ({
      name: item.name,
      value: item.value,
      percentage: item.percentage,
      fill: CATEGORY_COLORS[item.name] || CHART_COLORS[index % CHART_COLORS.length]
    }));
  }, [chartData]);

  /**
   * Prepares data for rating distribution histogram
   */
  const ratingHistogramData = useMemo(() => {
    if (!chartData?.ratingDistribution) return [];
    
    return chartData.ratingDistribution.map(item => ({
      range: item.range,
      count: item.count,
      fill: '#3b82f6'
    }));
  }, [chartData]);

  /**
   * Prepares data for install distribution bar chart
   */
  const installBarData = useMemo(() => {
    if (!chartData?.installDistribution) return [];
    
    return chartData.installDistribution
      .sort((a, b) => {
        // Custom sort for install ranges
        const order = ['0-1K', '1K-10K', '10K-100K', '100K-1M', '1M-10M', '10M-100M', '100M+'];
        return order.indexOf(a.category) - order.indexOf(b.category);
      })
      .map((item, index) => ({
        category: item.category,
        count: item.count,
        fill: CHART_COLORS[index % CHART_COLORS.length]
      }));
  }, [chartData]);

  /**
   * Prepares data for price vs rating scatter plot
   */
  const priceRatingScatterData = useMemo(() => {
    if (!chartData?.priceVsRating) return [];
    
    return chartData.priceVsRating
      .filter(item => item.price >= 0 && item.rating > 0)
      .map(item => ({
        x: item.price,
        y: item.rating,
        size: Math.log10(item.installs + 1) * 10, // Scale bubble size by installs
        category: item.category,
        fill: CATEGORY_COLORS[item.category] || '#3b82f6'
      }));
  }, [chartData]);

  /**
   * Prepares data for category performance comparison
   */
  const categoryPerformanceData = useMemo(() => {
    if (!chartData?.categoryPerformance) return [];
    
    return chartData.categoryPerformance.map(item => ({
      category: item.category.replace(/_/g, ' '),
      avgRating: Number(item.avgRating.toFixed(2)),
      appCount: item.appCount,
      totalInstalls: item.totalInstalls,
      installs: item.totalInstalls / 1000000, // Convert to millions for readability
      fill: CATEGORY_COLORS[item.category] || '#3b82f6'
    }));
  }, [chartData]);

  /**
   * Prepares sentiment analysis data
   */
  const sentimentData = useMemo(() => {
    if (!analytics?.sentiment) return [];
    
    const { sentimentPercentages } = analytics.sentiment;
    
    return [
      {
        name: 'Positive',
        value: sentimentPercentages.positive,
        count: analytics.sentiment.sentimentCounts.positive,
        fill: SENTIMENT_TYPES.POSITIVE.color
      },
      {
        name: 'Neutral',
        value: sentimentPercentages.neutral,
        count: analytics.sentiment.sentimentCounts.neutral,
        fill: SENTIMENT_TYPES.NEUTRAL.color
      },
      {
        name: 'Negative',
        value: sentimentPercentages.negative,
        count: analytics.sentiment.sentimentCounts.negative,
        fill: SENTIMENT_TYPES.NEGATIVE.color
      }
    ].filter(item => item.value > 0);
  }, [analytics]);

  /**
   * Prepares data for rating vs installs correlation
   */
  const ratingInstallsData = useMemo(() => {
    if (!analytics?.ratings?.topRatedApps || !chartData?.priceVsRating) return [];
    
    // Use top apps data for rating vs installs visualization
    return analytics.ratings.topRatedApps
      .slice(0, 20)
      .map(app => ({
        name: app.app,
        rating: app.rating,
        installs: app.installsNumber / 1000000, // Convert to millions
        reviews: app.reviews,
        category: app.category
      }));
  }, [analytics, chartData]);

  /**
   * Prepares data for market share analysis
   */
  const marketShareData = useMemo(() => {
    if (!analytics?.categories?.marketShare) return [];
    
    return analytics.categories.marketShare.categoryBreakdown
      .slice(0, 10)
      .map(item => ({
        category: item.category.replace(/_/g, ' '),
        appShare: Number(item.appMarketShare.toFixed(1)),
        installShare: Number(item.installMarketShare.toFixed(1)),
        appCount: item.appCount,
        totalInstalls: item.totalInstalls
      }));
  }, [analytics]);

  /**
   * Prepares data for correlation heatmap
   */
  const correlationData = useMemo(() => {
    if (!analytics?.correlations) return [];
    
    const correlations = analytics.correlations;
    
    return [
      { x: 'Rating', y: 'Reviews', value: correlations.ratingVsReviews },
      { x: 'Rating', y: 'Installs', value: correlations.ratingVsInstalls },
      { x: 'Reviews', y: 'Installs', value: correlations.reviewsVsInstalls },
      { x: 'Size', y: 'Installs', value: correlations.sizeVsInstalls },
      { x: 'Price', y: 'Rating', value: correlations.priceVsRating },
      { x: 'Price', y: 'Installs', value: correlations.priceVsInstalls }
    ].map(item => ({
      ...item,
      value: Number(item.value.toFixed(3)),
      color: item.value > 0.5 ? '#10b981' : item.value < -0.5 ? '#ef4444' : '#f59e0b'
    }));
  }, [analytics]);

  /**
   * Prepares trend data for time series analysis
   */
  const trendData = useMemo(() => {
    if (!analytics?.categories?.categoryPerformance) return [];
    
    // Simulate trend data based on category performance
    return analytics.categories.categoryPerformance
      .slice(0, 5)
      .map((cat, index) => ({
        category: cat.category.replace(/_/g, ' '),
        data: Array.from({ length: 12 }, (_, month) => ({
          month: month + 1,
          value: cat.avgRating + (Math.random() - 0.5) * 0.5, // Simulate variation
          installs: cat.totalInstalls * (1 + (Math.random() - 0.5) * 0.2)
        })),
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));
  }, [analytics]);

  return {
    // Chart data for different visualization types
    categoryPie: categoryPieData,
    ratingHistogram: ratingHistogramData,
    installBar: installBarData,
    priceRatingScatter: priceRatingScatterData,
    categoryPerformance: categoryPerformanceData,
    sentiment: sentimentData,
    ratingInstalls: ratingInstallsData,
    marketShare: marketShareData,
    correlations: correlationData,
    trends: trendData,
    
    // Helper methods
    getChartColors: (count) => CHART_COLORS.slice(0, count),
    getCategoryColor: (category) => CATEGORY_COLORS[category] || '#3b82f6',
    
    // Data availability flags
    hasData: !!(analytics && chartData),
    hasCategoryData: !!categoryPieData.length,
    hasRatingData: !!ratingHistogramData.length,
    hasSentimentData: !!sentimentData.length,
    hasCorrelationData: !!correlationData.length
  };
};
