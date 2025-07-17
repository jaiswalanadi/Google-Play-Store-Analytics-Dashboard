import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartSkeleton } from '../UI/LoadingSpinner';
import { ErrorDisplay } from '../UI/ErrorBoundary';

/**
 * Reusable Bar Chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data
 * @param {string} props.dataKey - Key for bar values
 * @param {string} props.xAxisKey - Key for x-axis labels
 * @param {string} props.title - Chart title
 * @param {string} props.color - Bar color
 * @param {number} props.height - Chart height
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.formatTooltip - Custom tooltip formatter
 * @param {boolean} props.showLegend - Whether to show legend
 * @param {Object} props.margin - Chart margins
 * @param {boolean} props.horizontal - Whether to display horizontally
 */
const BarChart = ({
  data = [],
  dataKey = 'value',
  xAxisKey = 'name',
  title,
  color = '#3b82f6',
  height = 300,
  isLoading = false,
  error = null,
  formatTooltip,
  showLegend = false,
  margin = { top: 20, right: 30, left: 20, bottom: 5 },
  horizontal = false
}) => {
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

  // Custom tooltip formatter
  const customTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const value = payload[0].value;
    
    if (formatTooltip) {
      return formatTooltip({ value, label, payload: payload[0] });
    }

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{dataKey}:</span> {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
    );
  };

  // Format axis labels for better readability
  const formatAxisLabel = (value) => {
    if (typeof value === 'string' && value.length > 15) {
      return value.substring(0, 15) + '...';
    }
    return value;
  };

  // Format numbers for display
  const formatNumber = (value) => {
    if (typeof value !== 'number') return value;
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={data}
            margin={margin}
            layout={horizontal ? 'horizontal' : 'vertical'}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            
            {horizontal ? (
              <>
                <XAxis 
                  type="number" 
                  tickFormatter={formatNumber}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  type="category" 
                  dataKey={xAxisKey}
                  tickFormatter={formatAxisLabel}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  width={100}
                />
              </>
            ) : (
              <>
                <XAxis 
                  dataKey={xAxisKey}
                  tickFormatter={formatAxisLabel}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  angle={data.length > 5 ? -45 : 0}
                  textAnchor={data.length > 5 ? 'end' : 'middle'}
                  height={data.length > 5 ? 60 : 30}
                />
                <YAxis 
                  tickFormatter={formatNumber}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
              </>
            )}
            
            <Tooltip content={customTooltip} />
            
            {showLegend && <Legend />}
            
            <Bar 
              dataKey={dataKey} 
              fill={color}
              radius={[2, 2, 0, 0]}
              onMouseEnter={(data, index) => {
                // Add hover effects if needed
              }}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * Stacked Bar Chart variant
 */
export const StackedBarChart = ({
  data = [],
  dataKeys = [],
  colors = ['#3b82f6', '#10b981', '#f59e0b'],
  xAxisKey = 'name',
  title,
  height = 300,
  isLoading = false,
  error = null
}) => {
  if (isLoading) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        <ChartSkeleton height={`h-[${height}px]`} />
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
        {error ? (
          <ErrorDisplay error={error} title="Chart Error" />
        ) : (
          <div className={`h-[${height}px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300`}>
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis 
              dataKey={xAxisKey}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            
            {dataKeys.map((key, index) => (
              <Bar 
                key={key}
                dataKey={key} 
                stackId="stack"
                fill={colors[index % colors.length]}
                radius={index === dataKeys.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChart;
