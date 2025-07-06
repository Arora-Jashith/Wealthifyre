import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import Svg, { Path, Defs, LinearGradient, Stop, Line, Circle } from 'react-native-svg';

type DataPoint = {
  value: number;
  label: string;
};

type EnhancedChartProps = {
  data: DataPoint[];
  height: number;
  width?: number;
  showGrid?: boolean;
  showGradient?: boolean;
  highlightIndex?: number;
  highlightValue?: string;
  yAxisLabels?: string[];
  color?: string;
  backgroundColor?: string;
};

export function EnhancedChart({
  data,
  height,
  width = Dimensions.get('window').width - 40,
  showGrid = true,
  showGradient = true,
  highlightIndex,
  highlightValue,
  yAxisLabels = ['0', '10k', '20k', '50k'],
  color = colors.primary,
  backgroundColor = 'transparent'
}: EnhancedChartProps) {
  if (!data || data.length === 0) {
    return <View style={[styles.container, { height, width }]} />;
  }

  // Find min and max values
  const values = data.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  // Calculate points for the path
  const points = data.map((item, index) => {
    const x = (width / (data.length - 1)) * index;
    // Add a small padding at the top and bottom of the chart
    const normalizedValue = valueRange === 0 ? 0.5 : (item.value - minValue) / valueRange;
    const y = height - (normalizedValue * (height - 40)) - 20; // 20px padding top and bottom
    return { x, y };
  });

  // Create the path string
  let pathD = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    // Use bezier curves for smoother lines
    const prevPoint = points[i - 1];
    const currentPoint = points[i];
    
    // Control points for the bezier curve
    const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) / 3;
    const cp1y = prevPoint.y;
    const cp2x = prevPoint.x + 2 * (currentPoint.x - prevPoint.x) / 3;
    const cp2y = currentPoint.y;
    
    pathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${currentPoint.x},${currentPoint.y}`;
  }

  // Create the fill path (extends to the bottom of the chart)
  let fillPathD = `${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  // Calculate grid lines
  const gridLines = showGrid ? Array.from({ length: 4 }, (_, i) => {
    const y = height - ((i + 1) * (height - 40) / 5) - 20;
    return { y };
  }) : [];

  return (
    <View style={[styles.container, { height, width, backgroundColor }]}>
      {/* Y-axis labels */}
      {yAxisLabels && (
        <View style={styles.yAxisLabels}>
          {yAxisLabels.map((label, index) => (
            <Text key={index} style={styles.yAxisLabel}>
              {label}
            </Text>
          ))}
        </View>
      )}
      
      <Svg height={height} width={width}>
        <Defs>
          <LinearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.4" />
            <Stop offset="1" stopColor={color} stopOpacity="0.05" />
          </LinearGradient>
        </Defs>
        
        {/* Grid lines */}
        {showGrid && gridLines.map((line, index) => (
          <Line 
            key={`grid-${index}`}
            x1="0"
            y1={line.y}
            x2={width}
            y2={line.y}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Fill area under the line */}
        {showGradient && (
          <Path
            d={fillPathD}
            fill="url(#fillGradient)"
            strokeWidth="0"
          />
        )}
        
        {/* Line chart */}
        <Path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Highlight point */}
        {highlightIndex !== undefined && highlightIndex >= 0 && highlightIndex < points.length && (
          <Circle
            cx={points[highlightIndex].x}
            cy={points[highlightIndex].y}
            r="6"
            fill={color}
            stroke={colors.dark.background}
            strokeWidth="2"
          />
        )}
      </Svg>
      
      {/* X-axis labels rendered as React Native Text components */}
      <View style={styles.xAxisLabelsContainer}>
        {data.map((item, index) => {
          // Only show every other label if there are many data points
          if (data.length > 10 && index % 2 !== 0 && index !== data.length - 1) return null;
          
          const x = (width / (data.length - 1)) * index;
          return (
            <Text
              key={`label-${index}`}
              style={[
                styles.xAxisLabel,
                { position: 'absolute', left: x - 15, width: 30, textAlign: 'center' }
              ]}
            >
              {item.label}
            </Text>
          );
        })}
      </View>
      
      {/* Highlight value */}
      {highlightIndex !== undefined && highlightIndex >= 0 && highlightIndex < points.length && highlightValue && (
        <View 
          style={[
            styles.highlightContainer, 
            { 
              left: points[highlightIndex].x - 30,
              top: points[highlightIndex].y - 40
            }
          ]}
        >
          <View style={styles.highlightValueContainer}>
            <Text style={styles.highlightValue}>{highlightValue}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 16,
  },
  yAxisLabels: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    paddingVertical: 30,
    zIndex: 2,
  },
  yAxisLabel: {
    color: colors.dark.textSecondary,
    fontSize: 10,
  },
  xAxisLabelsContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    height: 20,
  },
  xAxisLabel: {
    color: colors.dark.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
  highlightContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 3,
  },
  highlightValueContainer: {
    backgroundColor: colors.dark.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  highlightValue: {
    color: colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
  },
});
