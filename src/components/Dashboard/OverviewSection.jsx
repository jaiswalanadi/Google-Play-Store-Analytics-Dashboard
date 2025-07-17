import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Download, 
  PieChart, 
  BarChart3,
  MessageSquare,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import PieChartComponent from '../Charts/PieChart';
import BarChartComponent from '../Charts/BarChart';
import LineChart from '../Charts/LineChart';
import { useChartData } from '../../hooks/useChartData';
import { DASHBOARD_SECTIONS } from '../../utils/constants';

/**
 * Overview Section - Dashboard homepage with key metrics and insights
 * @param {Object} props - Component props
 * @param {Object} props.analytics - Analytics data
 * @param {Array} props.apps - Apps data
 * @param {Array} props.reviews - Reviews data
 * @param {Function} props.onSectionChange - Section change callback
 */
const OverviewSection = ({ 
  analytics, 
  apps, 
  reviews, 
  onSectionChange 
}) => {
  const chartData = useChartData(analytics, analytics?.chartData);

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Overview</h3>
          <p className="text-gray-500">Analytics data is being processed...</p>
        </div>
      </div>
    );
  }

  const { overview, categories, ratings, sentiment, insights } = analytics;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Key insights and metrics from Google Play Store data analysis
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card interactive-card" onClick={() => onSectionChange(DASHBOARD_SECTIONS.CATEGORIES)}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PieChart className="w-8 h-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Apps</p>
              <p className="text-2xl font-semibold text-gray-900">
                {overview.totalApps?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {categories?.totalCategories} categories
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-primary-600">
              <span>View categories</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        <div className="metric-card interactive-card" onClick={() => onSectionChange(DASHBOARD_SECTIONS.RATINGS)}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="w-8 h-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">
                {overview.avgRating?.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {ratings?.highRatedPercentage?.toFixed(1)}% highly rated
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-warning-600">
              <span>View ratings</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>

        <div className="metric-card interactive-card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Download className="w-8 h-8 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Installs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(overview.totalInstalls / 1000000000).toFixed(1)}B
              </p>
              <p className="text-sm text-gray-500">
                {overview.popularAppsPercentage?.toFixed(1)}% popular apps
              </p>
            </div>
          </div>
        </div>

        <div className="metric-card interactive-card" onClick={() => onSectionChange(DASHBOARD_SECTIONS.SENTIMENT)}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reviews</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(overview.totalReviews / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-gray-500">
                {sentiment?.sentimentPercentages?.positive?.toFixed(1)}% positive
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-purple-600">
              <span>View sentiment</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      {insights?.insights && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.insights.slice(0, 4).map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">{insight.title}</h4>
                  <p className="text-sm text-blue-700">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <PieChartComponent
          data={chartData.categoryPie?.slice(0, 8)}
          title="App Distribution by Category"
          height={350}
          showLegend={true}
        />

        {/* Rating Distribution */}
        <BarChartComponent
          data={chartData.ratingHistogram}
          dataKey="count"
          xAxisKey="range"
          title="Rating Distribution"
          color="#f59e0b"
          height={350}
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Categories */}
        <div className="lg:col-span-2">
          <BarChartComponent
            data={chartData.categoryPerformance?.slice(0, 10)}
            dataKey="avgRating"
            xAxisKey="category"
            title="Category Performance (Average Rating)"
            color="#10b981"
            height={300}
            horizontal={true}
          />
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Market Leaders</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Most Apps</p>
                <p className="font-medium text-gray-900">
                  {categories?.categoryPerformance?.[0]?.category?.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-600">
                  {categories?.categoryPerformance?.[0]?.appCount} apps
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Highest Rated</p>
                <p className="font-medium text-gray-900">
                  {categories?.categoryPerformance
                    ?.sort((a, b) => b.avgRating - a.avgRating)?.[0]
                    ?.category?.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-600">
                  {categories?.categoryPerformance
                    ?.sort((a, b) => b.avgRating - a.avgRating)?.[0]
                    ?.avgRating?.toFixed(2)} stars
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Most Installs</p>
                <p className="font-medium text-gray-900">
                  {categories?.categoryPerformance
                    ?.sort((a, b) => b.totalInstalls - a.totalInstalls)?.[0]
                    ?.category?.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-600">
                  {((categories?.categoryPerformance
                    ?.sort((a, b) => b.totalInstalls - a.totalInstalls)?.[0]
                    ?.totalInstalls || 0) / 1000000000).toFixed(1)}B installs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {insights?.recommendations && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.recommendations.slice(0, 4).map((rec, index) => (
              <div key={index} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900">{rec.title}</h4>
                    <p className="text-sm text-orange-800 mt-1">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Explore More</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onSectionChange(DASHBOARD_SECTIONS.CATEGORIES)}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <PieChart className="w-6 h-6 text-primary-600" />
              <span className="font-medium text-gray-900">Category Analysis</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => onSectionChange(DASHBOARD_SECTIONS.RATINGS)}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-warning-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6 text-warning-600" />
              <span className="font-medium text-gray-900">Rating Analysis</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => onSectionChange(DASHBOARD_SECTIONS.SENTIMENT)}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-gray-900">Sentiment Analysis</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;
