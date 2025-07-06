import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path, Line, Circle, Defs, LinearGradient, Stop, Rect, Text as SvgText } from 'react-native-svg';
import { colors } from '@/constants/colors';

interface DataPoint {
  value: number;
  label: string;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  width?: number;
  showDots?: boolean;
  showGradient?: boolean;
  showGrid?: boolean;
  highlightIndex?: number;
  highlightValue?: string;
  yAxisLabels?: string[];
  color?: string;
  backgroundColor?: string;
  onPointPress?: (index: number) => void;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  width = Dimensions.get('window').width - 48,
  showDots = true,
  showGradient = true,
  showGrid = true,
  highlightIndex,
  highlightValue,
  yAxisLabels = ['0', '10k', '20k', '50k'],
  color = colors.primary,
  backgroundColor = 'transparent',
  onPointPress
}) => {
  if (!data || data.length === 0) return null;

  // Find min and max values
  const values = data.map(point => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Padding for the chart
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 30;
  const paddingRight = 10;
  
  // Chart dimensions
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = width - paddingLeft - paddingRight;
  
  // Calculate point positions
  const points = data.map((point, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((point.value - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, value: point.value, label: point.label };
  });
  
  // Create path for the line
  let pathD = '';
  points.forEach((point, index) => {
    if (index === 0) {
      pathD += `M ${point.x} ${point.y}`;
    } else {
      // Create a smooth curve
      const prevPoint = points[index - 1];
      const controlPointX1 = prevPoint.x + (point.x - prevPoint.x) / 2;
      const controlPointX2 = prevPoint.x + (point.x - prevPoint.x) / 2;
      
      pathD += ` C ${controlPointX1} ${prevPoint.y}, ${controlPointX2} ${point.y}, ${point.x} ${point.y}`;
    }
  });
  
  // Create path for the gradient area
  let areaPathD = pathD;
  areaPathD += ` L ${points[points.length - 1].x} ${paddingTop + chartHeight}`;
  areaPathD += ` L ${points[0].x} ${paddingTop + chartHeight}`;
  areaPathD += ' Z';
  
  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <Stop offset="100%" stopColor={color} stopOpacity={0.1} />
          </LinearGradient>
        </Defs>
        
        {/* Background grid */}
        {showGrid && (
          <>
            {yAxisLabels.map((label, index) => {
              const y = paddingTop + (chartHeight / (yAxisLabels.length - 1)) * (yAxisLabels.length - 1 - index);
              return (
                <React.Fragment key={`grid-${index}`}>
                  <Line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke={colors.graph.grid}
                    strokeWidth={1}
                    strokeDasharray="5,5"
                  />
                  <Text
                    style={[
                      styles.yAxisLabel,
                      { top: y - 10, left: 5 }
                    ]}
                  >
                    {label}
                  </Text>
                </React.Fragment>
              );
            })}
          </>
        )}
        
        {/* Highlight area if specified */}
        {highlightIndex !== undefined && highlightIndex >= 0 && highlightIndex < points.length && (
          <React.Fragment>
            <Rect
              x={points[highlightIndex].x - 40}
              y={paddingTop}
              width={80}
              height={chartHeight}
              fill={colors.graph.highlight}
              opacity={0.15}
              rx={10}
              ry={10}
            />
            <Circle
              cx={points[highlightIndex].x}
              cy={points[highlightIndex].y}
              r={10}
              fill={color}
              opacity={0.3}
            />
            <Circle
              cx={points[highlightIndex].x}
              cy={points[highlightIndex].y}
              r={6}
              fill={color}
              stroke="#000"
              strokeWidth={1}
            />
            {highlightValue && (
              <View style={[
                styles.highlightValue,
                {
                  top: points[highlightIndex].y - 40,
                  left: points[highlightIndex].x - 40
                }
              ]}>
                <Text style={[styles.highlightValueText, { color: '#fff' }]}>{highlightValue}</Text>
              </View>
            )}
          </React.Fragment>
        )}
        
        {/* Area under the line */}
        {showGradient && (
          <Path
            d={areaPathD}
            fill="url(#gradient)"
          />
        )}
        
        {/* Line */}
        <Path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
        />
        
        {/* Dots on data points */}
        {showDots && points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
            stroke="#000"
            strokeWidth={1}
          />
        ))}
      </Svg>
      
      {/* X-axis labels */}
      <View style={styles.xAxisLabelsContainer}>
        {data.map((point, index) => (
          <Text
            key={index}
            style={[
              styles.xAxisLabel,
              {
                left: points[index].x - 15,
                color: highlightIndex === index ? colors.graph.highlight : colors.graph.text
              }
            ]}
          >
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  xAxisLabelsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  xAxisLabel: {
    position: 'absolute',
    fontSize: 12,
    color: colors.graph.text,
    width: 30,
    textAlign: 'center',
  },
  yAxisLabel: {
    position: 'absolute',
    fontSize: 12,
    color: colors.graph.text,
  },
  highlightValue: {
    position: 'absolute',
    backgroundColor: colors.graph.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    width: 80,
    alignItems: 'center',
  },
  highlightValueText: {
    color: colors.dark.background,
    fontSize: 12,
    fontWeight: '600',
  }
});
