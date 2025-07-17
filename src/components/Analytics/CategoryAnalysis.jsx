import React, { useState } from 'react';
import { PieChart, BarChart, TrendingUp, Users, Star, Download } from 'lucide-react';
import PieChartComponent from '../Charts/PieChart';
import BarChartComponent, { StackedBarChart } from '../Charts/BarChart';
import { useChartData } from '../../hooks/useChartData';
import { LoadingOverlay } from '../UI/LoadingSpinner';
import { ErrorDisplay } from '../UI/ErrorBoundary';

/**
 * Category Analysis Dashboard Component
 * @param {Object} props - Component props
 * @param {Object} props.analytics - Analytics data
 * @param {Array} props.apps - Apps data
 * @param {Function} props.onCategorySelect - Category selection callback
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 */
const CategoryAnalysis = ({ 
  analytics, 
  apps = [], 
  onCategorySelect,
  isLoading = false,
  error = null 
}) => {
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const chartData = useChartData(analytics, analytics?.chartData);

  if (error) {
    return <ErrorDisplay error={error} title="Category Analysis Error" />;
  }

  if (!analytics?.categories) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <PieChart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Category Data</h3>
          <p className="text-gray-500">Category analysis will appear here once data is loaded.</p>
        </div>
      </div>
    );
  }

  const { categories } = analytics;
  const { categoryPie, categoryPerformance } = chartData;

  // Prepare market share data
  const marketShareData = categories.marketShare?.categoryBreakdown
    ?.slice(0, 10)
    ?.map(cat => ({
      category: cat.category.replace(/_/g, ' '),
      appShare: Number(cat.appMarketShare.toFixed(1)),
      installShare: Number(cat.installMarketShare.toFixed(1)),
      appCount: cat.appCount
    })) || [];

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect?.(category);
  };

  // View options
  const viewOptions = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'performance', label: 'Performance', icon: BarChart },
    { id: 'market-share', label: 'Market Share', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6 relative">
      <LoadingOverlay isVisible={isLoading} message="Analyzing categories..." />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Analysis</h2>
          <p className="mt-1 text-gray-600">
            Explore app distribution and performance across different categories
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
                      ? 'bg-white text-primary-600 shadow-sm' 
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
              <PieChart className="w-8 h-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Categories</p>
              <p className="text-2xl font-semibold text-gray-900">
                {categories.totalCategories}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-accent-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Largest Category</p>
              <p className="text-2xl font-semibold text-gray-900">
                {categories.categoryPerformance?.[0]?.category.replace(/_/g, ' ') || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {categories.categoryPerformance?.[0]?.appCount} apps
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="w-8 h-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Highest Rated</p>
              <p className="text-2xl font-semibold text-gray-900">
                {categories.categoryPerformance
                  ?.sort((a, b) => b.avgRating - a.avgRating)?.[0]
                  ?.category.replace(/_/g, ' ') || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {categories.categoryPerformance
                  ?.sort((a, b) => b.avgRating - a.avgRating)?.[0]
                  ?.avgRating?.toFixed(1)} stars
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Download className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Most Installs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {categories.categoryPerformance
                  ?.sort((a, b) => b.totalInstalls - a.totalInstalls)?.[0]
                  ?.category.replace(/_/g, ' ') || 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                {((categories.categoryPerformance
                  ?.sort((a, b) => b.totalInstalls - a.totalInstalls)?.[0]
                  ?.totalInstalls || 0) / 1000000000).toFixed(1)}B installs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Based on Selected View */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution Pie Chart */}
          <PieChartComponent
            data={categoryPie}
            title="App Distribution by Category"
            height={400}
            showLegend={true}
          />

          {/* Top Categories Bar Chart */}
          <BarChartComponent
            data={categories.topCategories?.slice(0, 10)}
            dataKey="count"
            xAxisKey="value"
            title="Top 10 Categories by App Count"
            color="#3b82f6"
            height={400}
            formatTooltip={({ value, label }) => (
              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900">{label.replace(/_/g, ' ')}</p>
                <p className="text-sm text-gray-600">Apps: {value.toLocaleString()}</p>
                <p className="text-sm text-gray-600">
                  Share: {((value / categories.marketShare?.totalApps || 1) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          />
        </div>
      )}

      {selectedView === 'performance' && (
        <div className="space-y-6">
          {/* Category Performance Comparison */}
          <BarChartComponent
            data={categoryPerformance?.slice(0, 15)}
            dataKey="avgRating"
            xAxisKey="category"
            title="Average Rating by Category"
            color="#10b981"
            height={400}
            formatTooltip={({ value, label, payload }) => (
              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-600">Avg Rating: {value?.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Apps: {payload?.appCount}</p>
                <p className="text-sm text-gray-600">
                  Total Installs: {((payload?.totalInstalls || 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            )}
          />

          {/* Performance Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Category Performance Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Apps
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Installs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Reviews
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Popular Apps
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.categoryPerformance?.slice(0, 20).map((category, index) => (
                    <tr 
                      key={category.category}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCategoryClick(category.category)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {category.category.replace(/_/g, ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.appCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          {category.avgRating.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(category.totalInstalls / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(category.avgReviews || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.popularAppsCount || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'market-share' && (
        <div className="space-y-6">
          {/* Market Share Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StackedBarChart
              data={marketShareData?.slice(0, 10)}
              dataKeys={['appShare', 'installShare']}
              colors={['#3b82f6', '#10b981']}
              xAxisKey="category"
              title="Market Share: Apps vs Installs"
              height={400}
            />

            <BarChartComponent
              data={marketShareData?.slice(0, 10)}
              dataKey="appShare"
              xAxisKey="category"
              title="App Market Share by Category"
              color="#f59e0b"
              height={400}
              horizontal={true}
            />
          </div>

          {/* Market Share Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-blue-900 mb-2">Market Leader</h4>
              <p className="text-3xl font-bold text-blue-600">
                {marketShareData[0]?.category || 'N/A'}
              </p>
              <p className="text-blue-700 mt-1">
                {marketShareData[0]?.appShare || 0}% of all apps
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-green-900 mb-2">Install Leader</h4>
              <p className="text-3xl font-bold text-green-600">
                {marketShareData
                  ?.sort((a, b) => b.installShare - a.installShare)[0]
                  ?.category || 'N/A'}
              </p>
              <p className="text-green-700 mt-1">
                {marketShareData
                  ?.sort((a, b) => b.installShare - a.installShare)[0]
                  ?.installShare || 0}% of all installs
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
              <h4 className="text-lg font-medium text-purple-900 mb-2">Market Concentration</h4>
              <p className="text-3xl font-bold text-purple-600">
                {(marketShareData?.slice(0, 5)?.reduce((sum, cat) => sum + cat.appShare, 0) || 0).toFixed(1)}%
              </p>
              <p className="text-purple-700 mt-1">
                Top 5 categories share
              </p>
            </div>
          </div>

          {/* Market Share Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detailed Market Share Analysis</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      App Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      App Share
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Install Share
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efficiency
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {marketShareData?.map((category, index) => {
                    const efficiency = category.appShare > 0 ? (category.installShare / category.appShare).toFixed(2) : 0;
                    return (
                      <tr key={category.category} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {category.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.appCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(category.appShare * 2, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{category.appShare}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(category.installShare * 2, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500">{category.installShare}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`
                            px-2 py-1 text-xs rounded-full font-medium
                            ${efficiency > 1.5 ? 'bg-green-100 text-green-800' : 
                              efficiency > 1 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}
                          `}>
                            {efficiency}x
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-blue-900">
              Selected Category: {selectedCategory.replace(/_/g, ' ')}
            </h3>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.categoryPerformance
              ?.filter(cat => cat.category === selectedCategory)
              ?.map(cat => (
                <React.Fragment key={cat.category}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{cat.appCount}</div>
                    <div className="text-sm text-blue-700">Total Apps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{cat.avgRating.toFixed(2)}</div>
                    <div className="text-sm text-blue-700">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {(cat.totalInstalls / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-blue-700">Total Installs</div>
                  </div>
                </React.Fragment>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAnalysis;
