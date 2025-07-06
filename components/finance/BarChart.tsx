import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/constants/colors';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';

type DataPoint = {
  value: number;
  label: string;
};

type BarChartProps = {
  data: DataPoint[];
  height: number;
  width?: number;
  showGrid?: boolean;
  barColor?: string;
  backgroundColor?: string;
  barWidth?: number;
  barSpacing?: number;
  yAxisLabels?: string[];
};

export function BarChart({
  data,
  height,
  width = Dimensions.get('window').width - 40,
  showGrid = true,
  barColor = colors.primary,
  backgroundColor = 'transparent',
  barWidth = 20,
  barSpacing = 10,
  yAxisLabels = ['0', '10k', '20k', '50k'],
}: BarChartProps) {
  if (!data || data.length === 0) {
    return <View style={[styles.container, { height, width }]} />;
  }

  // Find max value for scaling
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Calculate chart dimensions
  const chartHeight = height - 40; // Leave space for labels
  const chartWidth = width - 40; // Leave space for y-axis labels
  
  // Calculate bar positions
  const totalBarsWidth = (barWidth + barSpacing) * data.length - barSpacing;
  const startX = (chartWidth - totalBarsWidth) / 2 + 40; // Center bars and account for y-axis labels
  
  // Calculate grid lines
  const gridLines = showGrid ? Array.from({ length: 4 }, (_, i) => {
    const y = height - ((i + 1) * chartHeight / 5) - 20;
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
        {/* Grid lines */}
        {showGrid && gridLines.map((line, index) => (
          <Line 
            key={`grid-${index}`}
            x1="40"
            y1={line.y}
            x2={width}
            y2={line.y}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = startX + index * (barWidth + barSpacing);
          const y = height - barHeight - 20; // 20px padding bottom
          
          return (
            <React.Fragment key={`bar-${index}`}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                rx={4}
                ry={4}
              />
              
              {/* Bar value */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 8}
                fontSize="10"
                fill={colors.dark.textSecondary}
                textAnchor="middle"
              >
                {item.value >= 1000 ? `${Math.round(item.value / 1000)}k` : item.value}
              </SvgText>
              
              {/* X-axis label */}
              <SvgText
                x={x + barWidth / 2}
                y={height - 5}
                fontSize="10"
                fill={colors.dark.textSecondary}
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
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
});
