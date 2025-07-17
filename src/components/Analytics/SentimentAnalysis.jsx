import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Meh, TrendingUp } from 'lucide-react';
import PieChartComponent from '../Charts/PieChart';
import BarChartComponent from '../Charts/BarChart';
import { useChartData } from '../../hooks/useChartData';
import { LoadingOverlay } from '../UI/LoadingSpinner';
import { ErrorDisplay } from '../UI/ErrorBoundary';

/**
 * Sentiment Analysis Component
 * @param {Object} props - Component props
 * @param {Object} props.analytics - Analytics data
 * @param {Array} props.reviews - Reviews data
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 */
const SentimentAnalysis = ({ 
  analytics, 
  reviews = [], 
  isLoading = false,
  error = null 
}) => {
  const [selectedView, setSelectedView] = useState('overview');
  
  const chartData = useChartData(analytics, analytics?.chartData);

  if (error) {
    return <ErrorDisplay error={error} title="Sentiment Analysis Error" />;
  }

  if (!analytics?.sentiment) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sentiment Data</h3>
          <p className="text-gray-500">Sentiment analysis will appear here once review data is loaded.</p>
        </div>
      </div>
    );
  }

  const { sentiment } = analytics;

  // Prepare sentiment trend data (simulated)
  const sentimentTrendData = Array.from({ length: 12 }, (_, index) => ({
    month: `Month ${index + 1}`,
    positive: sentiment.sentimentPercentages.positive + (Math.random() - 0.5) * 10,
    negative: sentiment.sentimentPercentages.negative + (Math.random() - 0.5) * 5,
    neutral: sentiment.sentimentPercentages.neutral + (Math.random() - 0.5) * 5
  }));

  // View options
  const viewOptions = [
    { id: 'overview', label: 'Overview', icon: MessageSquare },
    { id: 'distribution', label: 'Distribution', icon: TrendingUp },
    { id: 'insights', label: 'Insights', icon: ThumbsUp }
  ];

  return (
    <div className="space-y-6 relative">
      <LoadingOverlay isVisible={isLoading} message="Analyzing sentiment..." />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sentiment Analysis</h2>
          <p className="mt-1 text-gray-600">
            Analyze user sentiment and feedback patterns from app reviews
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
                      ? 'bg-white text-purple-600 shadow-sm' 
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
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">
                {sentiment.totalReviews?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Analyzed reviews
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ThumbsUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Positive Sentiment</p>
              <p className="text-2xl font-semibold text-gray-900">
                {sentiment.sentimentPercentages?.positive?.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">
                {sentiment.sentimentCounts?.positive?.toLocaleString()} reviews
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ThumbsDown className="w-8 h-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Negative Sentiment</p>
              <p className="text-2xl font-semibold text-gray-900">
                {sentiment.sentimentPercentages?.negative?.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">
                {sentiment.sentimentCounts?.negative?.toLocaleString()} reviews
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Meh className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Neutral Sentiment</p>
              <p className="text-2xl font-semibold text-gray-900">
                {sentiment.sentimentPercentages?.neutral?.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500">
                {sentiment.sentimentCounts?.neutral?.toLocaleString()} reviews
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Based on Selected View */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sentiment Distribution Pie Chart */}
          <PieChartComponent
            data={chartData.sentiment}
            title="Sentiment Distribution"
            height={400}
            showLegend={true}
            nameKey="name"
            valueKey="value"
          />

          {/* Sentiment Metrics */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Sentiment Metrics</h3>
            
            <div className="space-y-6">
              {/* Positive Sentiment */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Positive</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {sentiment.sentimentPercentages?.positive?.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-green-500" 
                    style={{ width: `${sentiment.sentimentPercentages?.positive || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Neutral Sentiment */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Meh className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Neutral</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {sentiment.sentimentPercentages?.neutral?.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-yellow-500" 
                    style={{ width: `${sentiment.sentimentPercentages?.neutral || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Negative Sentiment */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">Negative</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {sentiment.sentimentPercentages?.negative?.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-red-500" 
                    style={{ width: `${sentiment.sentimentPercentages?.negative || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Sentiment Score */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Overall Sentiment Score</p>
                <p className="text-3xl font-bold text-primary-600">
                  {sentiment.polarityStats?.mean?.toFixed(2) || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">
                  Range: -1.0 (negative) to +1.0 (positive)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'distribution' && (
        <div className="space-y-6">
          {/* Sentiment by Polarity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Polarity Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mean Subjectivity</span>
                    <span className="font-medium">{sentiment.subjectivityStats?.mean?.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Median Subjectivity</span>
                    <span className="font-medium">{sentiment.subjectivityStats?.median?.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Standard Deviation</span>
                    <span className="font-medium">{sentiment.subjectivityStats?.std?.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Comparison Chart */}
          <BarChartComponent
            data={[
              { sentiment: 'Positive', count: sentiment.sentimentCounts?.positive || 0, fill: '#10b981' },
              { sentiment: 'Neutral', count: sentiment.sentimentCounts?.neutral || 0, fill: '#f59e0b' },
              { sentiment: 'Negative', count: sentiment.sentimentCounts?.negative || 0, fill: '#ef4444' }
            ]}
            dataKey="count"
            xAxisKey="sentiment"
            title="Sentiment Distribution by Count"
            height={400}
          />

          {/* Detailed Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detailed Sentiment Statistics</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sentiment Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ThumbsUp className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Positive</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sentiment.sentimentCounts?.positive?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sentiment.sentimentPercentages?.positive?.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-success">Excellent</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Meh className="w-5 h-5 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Neutral</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sentiment.sentimentCounts?.neutral?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sentiment.sentimentPercentages?.neutral?.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-warning">Moderate</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ThumbsDown className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Negative</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sentiment.sentimentCounts?.negative?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sentiment.sentimentPercentages?.negative?.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-danger">Needs Attention</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'insights' && (
        <div className="space-y-6">
          {/* Sentiment Health Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-green-900 mb-2">Sentiment Health</h4>
              <p className="text-3xl font-bold text-green-600">
                {sentiment.sentimentPercentages?.positive > 60 ? 'Excellent' :
                 sentiment.sentimentPercentages?.positive > 40 ? 'Good' :
                 sentiment.sentimentPercentages?.positive > 25 ? 'Fair' : 'Poor'}
              </p>
              <p className="text-green-700 mt-1">
                {sentiment.sentimentPercentages?.positive?.toFixed(1)}% positive sentiment
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-blue-900 mb-2">Polarity Score</h4>
              <p className="text-3xl font-bold text-blue-600">
                {sentiment.polarityStats?.mean > 0.3 ? 'Very Positive' :
                 sentiment.polarityStats?.mean > 0.1 ? 'Positive' :
                 sentiment.polarityStats?.mean > -0.1 ? 'Neutral' :
                 sentiment.polarityStats?.mean > -0.3 ? 'Negative' : 'Very Negative'}
              </p>
              <p className="text-blue-700 mt-1">
                Score: {sentiment.polarityStats?.mean?.toFixed(3)}
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-purple-900 mb-2">Review Quality</h4>
              <p className="text-3xl font-bold text-purple-600">
                {sentiment.subjectivityStats?.mean > 0.6 ? 'Highly Subjective' :
                 sentiment.subjectivityStats?.mean > 0.4 ? 'Subjective' :
                 sentiment.subjectivityStats?.mean > 0.2 ? 'Balanced' : 'Objective'}
              </p>
              <p className="text-purple-700 mt-1">
                Subjectivity: {sentiment.subjectivityStats?.mean?.toFixed(3)}
              </p>
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Key Findings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Positive Indicators</h4>
                <div className="space-y-2">
                  {sentiment.sentimentPercentages?.positive > 50 && (
                    <div className="flex items-center space-x-2 text-green-700">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Majority of reviews are positive</span>
                    </div>
                  )}
                  {sentiment.polarityStats?.mean > 0.2 && (
                    <div className="flex items-center space-x-2 text-green-700">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Strong positive sentiment polarity</span>
                    </div>
                  )}
                  {sentiment.sentimentPercentages?.negative < 20 && (
                    <div className="flex items-center space-x-2 text-green-700">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Low negative sentiment rate</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Areas for Improvement</h4>
                <div className="space-y-2">
                  {sentiment.sentimentPercentages?.negative > 30 && (
                    <div className="flex items-center space-x-2 text-red-700">
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">High negative sentiment rate</span>
                    </div>
                  )}
                  {sentiment.polarityStats?.mean < 0 && (
                    <div className="flex items-center space-x-2 text-red-700">
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">Overall negative sentiment polarity</span>
                    </div>
                  )}
                  {sentiment.sentimentPercentages?.neutral > 40 && (
                    <div className="flex items-center space-x-2 text-yellow-700">
                      <Meh className="w-4 h-4" />
                      <span className="text-sm">High neutral sentiment suggests mixed opinions</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Enhance Positive Experience</h4>
                <p className="text-sm text-blue-700">
                  Focus on features and aspects that generate positive reviews to maintain high user satisfaction.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Address Negative Feedback</h4>
                <p className="text-sm text-blue-700">
                  Analyze negative reviews to identify common issues and prioritize fixes for problematic areas.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Engage Neutral Users</h4>
                <p className="text-sm text-blue-700">
                  Convert neutral sentiment to positive by improving user engagement and addressing ambivalent feedback.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Monitor Trends</h4>
                <p className="text-sm text-blue-700">
                  Regularly track sentiment changes to quickly respond to emerging issues or capitalize on positive trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
                    <span>Mean Polarity</span>
                    <span className="font-medium">{sentiment.polarityStats?.mean?.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Median Polarity</span>
                    <span className="font-medium">{sentiment.polarityStats?.median?.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Standard Deviation</span>
                    <span className="font-medium">{sentiment.polarityStats?.std?.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Subjectivity Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
