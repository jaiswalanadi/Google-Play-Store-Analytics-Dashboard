import React, { useState } from 'react';
import { Star, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import BarChartComponent from '../Charts/BarChart';
import ScatterPlot from '../Charts/ScatterPlot';
import { useChartData } from '../../hooks/useChartData';
import { LoadingOverlay } from '../UI/LoadingSpinner';
import { ErrorDisplay } from '../UI/ErrorBoundary';

/**
 * Rating Analysis Component
 * @param {Object} props - Component props
 * @param {Object} props.analytics - Analytics data
 * @param {Array} props.apps - Apps data
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 */
const RatingAnalysis = ({ 
  analytics, 
  apps = [], 
  isLoading = false,
  error = null 
}) => {
  const [selectedView, setSelectedView] = useState('distribution');
  
  const chartData = useChartData(analytics, analytics?.chartData);

  if (error) {
    return <ErrorDisplay error={error} title="Rating Analysis Error" />;
  }

  if (!analytics?.ratings) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Rating Data</h3>
          <p className="text-gray-500">Rating analysis will appear here once data is loaded.</p>
        </div>
      </div>
    );
  }

  const { ratings } = analytics;

  // Prepare correlation data for rating vs other metrics
  const ratingCorrelationData = apps
    .filter(app => app.rating && app.reviews && app.installsNumber)
    .map(app => ({
      rating: app.rating,
      reviews: app.reviews,
      installs: app.installsNumber / 1000000, // Convert to millions
      category: app.category,
      name: app.app
    }));

  // View options
  const viewOptions = [
    { id: 'distribution', label: 'Distribution', icon: Star },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'correlation', label: 'Correlations', icon: Award }
  ];

  return (
    <div className="space-y-6 relative">
      <LoadingOverlay isVisible={isLoading} message="Analyzing ratings..." />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rating Analysis</h2>
          <p className="mt-1 text-gray-600">
            Explore app rating patterns, distributions, and correlations
          </p>
        </div>
        
        {/* View Selector */}
        <div className="mt-4 lg:mt-0">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {viewOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedView(option.id)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${selectedView === option.id 
                      ? 'bg-white text-warning-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ratings.ratingStats?.mean?.toFixed(2) || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                Median: {ratings.ratingStats?.median?.toFixed(2) || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Highly Rated</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ratings.highRatedPercentage?.toFixed(1) || 0}%
              </p>
              <p className="text-sm text-gray-500">
                4.0+ stars ({ratings.topRatedApps?.length || 0} apps)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rating Range</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ratings.ratingStats?.min?.toFixed(1)} - {ratings.ratingStats?.max?.toFixed(1)}
              </p>
              <p className="text-sm text-gray-500">
                Std Dev: {ratings.ratingStats?.std?.toFixed(2) || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Poor Ratings</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ratings.poorlyRatedApps?.length || 0}
              </p>
              <p className="text-sm text-gray-500">
                Below 3.0 stars
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Based on Selected View */}
      {selectedView === 'distribution' && (
        <div className="space-y-6">
          {/* Rating Distribution Chart */}
          <BarChartComponent
            data={chartData.ratingHistogram}
            dataKey="count"
            xAxisKey="range"
            title="Rating Distribution"
            color="#f59e0b"
            height={400}
            formatTooltip={({ value, label }) => (
              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900">Rating Range: {label}</p>
                <p className="text-sm text-gray-600">Apps: {value.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Percentage: {((value / apps.length) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          />

          {/* Rating Statistics Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Rating Statistics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mean</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ratings.ratingStats?.mean?.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">Average rating across all apps</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Median</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ratings.ratingStats?.median?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">Middle value when ratings are sorted</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mode</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ratings.ratingStats?.mode || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">Most frequently occurring rating</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Standard Deviation</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ratings.ratingStats?.std?.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">Measure of rating variability</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Skewness</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ratings.ratingStats?.mean > ratings.ratingStats?.median ? 'Right-skewed' : 'Left-skewed'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">Distribution asymmetry</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'performance' && (
        <div className="space-y-6">
          {/* Top and Poor Performing Apps */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Rated Apps */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                <h3 className="text-lg font-medium text-green-900">Top Rated Apps</h3>
                <p className="text-sm text-green-700">Apps with excellent ratings (4.5+ stars)</p>
              </div>
              <div className="overflow-y-auto max-h-96">
                {ratings.topRatedApps?.slice(0, 10).map((app, index) => (
                  <div key={app.app} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {app.app}
                        </p>
                        <p className="text-sm text-gray-500">
                          {app.category?.replace(/_/g, ' ')} • {app.reviews?.toLocaleString()} reviews
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium text-gray-900">
                            {app.rating?.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Poorly Rated Apps */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
                <h3 className="text-lg font-medium text-red-900">Poorly Rated Apps</h3>
                <p className="text-sm text-red-700">Apps that need improvement (below 3.0 stars)</p>
              </div>
              <div className="overflow-y-auto max-h-96">
                {ratings.poorlyRatedApps?.slice(0, 10).map((app, index) => (
                  <div key={app.app} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {app.app}
                        </p>
                        <p className="text-sm text-gray-500">
                          {app.category?.replace(/_/g, ' ')} • {app.reviews?.toLocaleString()} reviews
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-red-400" />
                          <span className="ml-1 text-sm font-medium text-gray-900">
                            {app.rating?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rating by Category */}
          <BarChartComponent
            data={analytics?.categories?.categoryPerformance?.slice(0, 15)}
            dataKey="avgRating"
            xAxisKey="category"
            title="Average Rating by Category"
            color="#10b981"
            height={400}
            horizontal={true}
            formatTooltip={({ value, label, payload }) => (
              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900">{label.replace(/_/g, ' ')}</p>
                <p className="text-sm text-gray-600">Avg Rating: {value?.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Apps: {payload?.appCount}</p>
                <p className="text-sm text-gray-600">Total Reviews: {payload?.totalReviews?.toLocaleString()}</p>
              </div>
            )}
          />
        </div>
      )}

      {selectedView === 'correlation' && (
        <div className="space-y-6">
          {/* Rating vs Reviews Scatter Plot */}
          <ScatterPlot
            data={ratingCorrelationData}
            xKey="rating"
            yKey="reviews"
            categoryKey="category"
            title="Rating vs Reviews Correlation"
            xLabel="Rating"
            yLabel="Number of Reviews"
            height={400}
            showTrendLine={true}
          />

          {/* Rating vs Installs Scatter Plot */}
          <ScatterPlot
            data={ratingCorrelationData}
            xKey="rating"
            yKey="installs"
            categoryKey="category"
            title="Rating vs Installs Correlation"
            xLabel="Rating"
            yLabel="Installs (Millions)"
            height={400}
            showTrendLine={true}
          />

          {/* Correlation Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Correlation Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Rating vs Reviews</h4>
                <p className="text-sm text-blue-700">
                  Correlation: {analytics?.correlations?.ratingVsReviews?.toFixed(3) || 'N/A'}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {analytics?.correlations?.ratingVsReviews > 0.3 
                    ? 'Positive correlation - higher rated apps tend to have more reviews'
                    : analytics?.correlations?.ratingVsReviews < -0.3
                    ? 'Negative correlation - higher rated apps tend to have fewer reviews'
                    : 'Weak correlation between rating and number of reviews'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Rating vs Installs</h4>
                <p className="text-sm text-blue-700">
                  Correlation: {analytics?.correlations?.ratingVsInstalls?.toFixed(3) || 'N/A'}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {analytics?.correlations?.ratingVsInstalls > 0.3 
                    ? 'Positive correlation - higher rated apps tend to have more installs'
                    : analytics?.correlations?.ratingVsInstalls < -0.3
                    ? 'Negative correlation - higher rated apps tend to have fewer installs'
                    : 'Weak correlation between rating and number of installs'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingAnalysis;
