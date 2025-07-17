import React, { useState } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartSkeleton } from '../UI/LoadingSpinner';
import { ErrorDisplay } from '../UI/ErrorBoundary';
import { CHART_COLORS } from '../../utils/constants';

/**
 * Reusable Pie Chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data with 'name' and 'value' properties
 * @param {string} props.title - Chart title
 * @param {Array} props.colors - Custom color palette
 * @param {number} props.height - Chart height
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.showLabels - Whether to show labels on slices
 * @param {boolean} props.showLegend - Whether to show legend
 * @param {Function} props.formatTooltip - Custom tooltip formatter
 * @param {string} props.valueKey - Key for values (default: 'value')
 * @param {string} props.nameKey - Key for names (default: 'name')
 */
const PieChart = ({
  data = [],
  title,
  colors = CHART_COLORS,
  height = 400,
  isLoading = false,
  error = null,
  showLabels = false,
  showLegend = true,
  formatTooltip,
  valueKey = 'value',
  nameKey = 'name'
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <ChartSkeleton height={`h-[${height}px]`} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <ErrorDisplay error={error} title="Chart Error" />
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <div className={`h-[${height}px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300`}>
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  // Calculate total for percentage calculation
  const total = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);

  // Enhanced data with percentages and colors
  const enhancedData = data.map((item, index) => ({
    ...item,
    percentage: total > 0 ? ((item[valueKey] / total) * 100).toFixed(1) : 0,
    fill: item.fill || colors[index % colors.length]
  }));

  // Custom label formatter
  const renderLabel = (entry) => {
    if (!showLabels) return null;
    return `${entry[nameKey]}: ${entry.percentage}%`;
  };

  // Custom tooltip
  const customTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    
    if (formatTooltip) {
      return formatTooltip(data);
    }

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2 mb-1">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.fill }}
          />
          <span className="font-medium text-gray-900">{data[nameKey]}</span>
        </div>
        <p className="text-sm text-gray-600">
          Value: {data[valueKey].toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          Percentage: {data.percentage}%
        </p>
      </div>
    );
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Handle mouse events for interactivity
  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={enhancedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={showLabels ? renderLabel : false}
              outerRadius={Math.min(height * 0.35, 120)}
              fill="#8884d8"
              dataKey={valueKey}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {enhancedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill}
                  stroke={activeIndex === index ? '#374151' : 'none'}
                  strokeWidth={activeIndex === index ? 2 : 0}
                  style={{
                    filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            {showLegend && <Legend content={renderLegend} />}
          </RechartsPieChart>
        </ResponsiveContainer>

        {/* Data Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-gray-200 pt-4">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {enhancedData.length}
            </div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {total.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {enhancedData[0]?.[nameKey] || 'N/A'}
            </div>
            <div className="text-sm text-gray-500">Largest</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {enhancedData[0]?.percentage || 0}%
            </div>
            <div className="text-sm text-gray-500">Share</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Donut Chart variant
 */
export const DonutChart = (props) => {
  return (
    <PieChart 
      {...props} 
      innerRadius={60}
      outerRadius={100}
    />
  );
};

/**
 * Simple Pie Chart for small spaces
 */
export const SimplePieChart = ({
  data = [],
  colors = CHART_COLORS,
  size = 150,
  showTooltip = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`w-[${size}px] h-[${size}px] flex items-center justify-center bg-gray-100 rounded-full`}>
        <span className="text-gray-500 text-sm">No data</span>
      </div>
    );
  }

  const enhancedData = data.map((item, index) => ({
    ...item,
    fill: item.fill || colors[index % colors.length]
  }));

  return (
    <ResponsiveContainer width={size} height={size}>
      <RechartsPieChart>
        <Pie
          data={enhancedData}
          cx="50%"
          cy="50%"
          outerRadius={size * 0.4}
          fill="#8884d8"
          dataKey="value"
        >
          {enhancedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        {showTooltip && (
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
        )}
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
