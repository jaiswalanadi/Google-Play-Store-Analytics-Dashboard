import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartSkeleton } from '../UI/LoadingSpinner';
import { ErrorDisplay } from '../UI/ErrorBoundary';
import { CHART_COLORS } from '../../utils/constants';

/**
 * Reusable Scatter Plot component
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data with x, y coordinates
 * @param {string} props.xKey - Key for x-axis values
 * @param {string} props.yKey - Key for y-axis values
 * @param {string} props.sizeKey - Key for bubble size (optional)
 * @param {string} props.categoryKey - Key for categorization/coloring
 * @param {string} props.title - Chart title
 * @param {string} props.xLabel - X-axis label
 * @param {string} props.yLabel - Y-axis label
 * @param {Array} props.colors - Color palette
 * @param {number} props.height - Chart height
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {Function} props.formatTooltip - Custom tooltip formatter
 * @param {boolean} props.showTrendLine - Whether to show trend line
 * @param {Object} props.margin - Chart margins
 */
const ScatterPlot = ({
  data = [],
  xKey = 'x',
  yKey = 'y',
  sizeKey,
  categoryKey,
  title,
  xLabel,
  yLabel,
  colors = CHART_COLORS,
  height = 400,
  isLoading = false,
  error = null,
  formatTooltip,
  showTrendLine = false,
  margin = { top: 20, right: 30, left: 20, bottom: 20 }
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

  // Process data for scatter plot
  const processedData = data.map((item, index) => {
    const point = {
      ...item,
      x: item[xKey],
      y: item[yKey],
      originalIndex: index
    };

    // Add size if sizeKey is provided
    if (sizeKey && item[sizeKey]) {
      point.size = item[sizeKey];
    }

    // Add category color if categoryKey is provided
    if (categoryKey && item[categoryKey]) {
      const categoryIndex = [...new Set(data.map(d => d[categoryKey]))].indexOf(item[categoryKey]);
      point.fill = colors[categoryIndex % colors.length];
    } else {
      point.fill = colors[0];
    }

    return point;
  });

  // Group data by category if categoryKey is provided
  const groupedData = categoryKey 
    ? [...new Set(data.map(d => d[categoryKey]))].map(category => ({
        category,
        data: processedData.filter(d => d[categoryKey] === category),
        fill: colors[[...new Set(data.map(d => d[categoryKey]))].indexOf(category) % colors.length]
      }))
    : [{ category: 'Data', data: processedData, fill: colors[0] }];

  // Custom tooltip
  const customTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    
    if (formatTooltip) {
      return formatTooltip(data);
    }

    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">
            {categoryKey && data[categoryKey] && (
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: data.fill }}
                />
                <span>{data[categoryKey]}</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{xLabel || xKey}:</span> {data.x?.toLocaleString?.() || data.x}
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{yLabel || yKey}:</span> {data.y?.toLocaleString?.() || data.y}
          </div>
          {sizeKey && data[sizeKey] && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{sizeKey}:</span> {data[sizeKey]?.toLocaleString?.() || data[sizeKey]}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Format axis labels
  const formatNumber = (value) => {
    if (typeof value !== 'number') return value;
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  // Calculate correlation coefficient for trend line
  const calculateTrendLine = () => {
    if (!showTrendLine || processedData.length < 2) return null;

    const validPoints = processedData.filter(d => 
      typeof d.x === 'number' && typeof d.y === 'number' && 
      !isNaN(d.x) && !isNaN(d.y)
    );

    if (validPoints.length < 2) return null;

    const n = validPoints.length;
    const sumX = validPoints.reduce((sum, d) => sum + d.x, 0);
    const sumY = validPoints.reduce((sum, d) => sum + d.y, 0);
    const sumXY = validPoints.reduce((sum, d) => sum + (d.x * d.y), 0);
    const sumXX = validPoints.reduce((sum, d) => sum + (d.x * d.x), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const minX = Math.min(...validPoints.map(d => d.x));
    const maxX = Math.max(...validPoints.map(d => d.x));

    return [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];
  };

  const trendLineData = calculateTrendLine();

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            
            <XAxis 
              type="number"
              dataKey="x"
              name={xLabel || xKey}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatNumber}
              label={{ value: xLabel || xKey, position: 'insideBottom', offset: -10 }}
            />
            
            <YAxis 
              type="number"
              dataKey="y"
              name={yLabel || yKey}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatNumber}
              label={{ value: yLabel || yKey, angle: -90, position: 'insideLeft' }}
            />
            
            <Tooltip content={customTooltip} />
            
            {categoryKey && <Legend />}
            
            {groupedData.map((group, index) => (
              <Scatter
                key={group.category}
                name={group.category}
                data={group.data}
                fill={group.fill}
              />
            ))}
            
            {/* Trend line */}
            {trendLineData && (
              <Scatter
                data={trendLineData}
                line={{ stroke: '#ef4444', strokeWidth: 2 }}
                shape={() => null}
                legendType="none"
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>

        {/* Chart Statistics */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-gray-200 pt-4">
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {processedData.length}
            </div>
            <div className="text-sm text-gray-500">Data Points</div>
          </div>
          {categoryKey && (
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {groupedData.length}
              </div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
          )}
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(Math.max(...processedData.map(d => d.x)))}
            </div>
            <div className="text-sm text-gray-500">Max {xLabel || xKey}</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {formatNumber(Math.max(...processedData.map(d => d.y)))}
            </div>
            <div className="text-sm text-gray-500">Max {yLabel || yKey}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Bubble Chart variant with size dimension
 */
export const BubbleChart = (props) => {
  return (
    <ScatterPlot
      {...props}
      sizeKey={props.sizeKey || 'size'}
    />
  );
};

/**
 * Simple correlation plot
 */
export const CorrelationPlot = ({
  data = [],
  xKey = 'x',
  yKey = 'y',
  title,
  height = 300
}) => {
  return (
    <ScatterPlot
      data={data}
      xKey={xKey}
      yKey={yKey}
      title={title}
      height={height}
      showTrendLine={true}
      colors={['#3b82f6']}
    />
  );
};

export default ScatterPlot;
