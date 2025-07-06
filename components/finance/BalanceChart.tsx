import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { BalanceForecast } from '@/types/finance';
import { colors } from '@/constants/colors';

interface BalanceChartProps {
  data: BalanceForecast[];
  height?: number;
  showLabels?: boolean;
}

export const BalanceChart: React.FC<BalanceChartProps> = ({
  data,
  height = 200,
  showLabels = true
}) => {
  const screenWidth = Dimensions.get('window').width - 32; // Padding
  
  // Find min and max values for scaling
  const balances = data.map(item => item.balance);
  const minBalance = Math.min(...balances);
  const maxBalance = Math.max(...balances);
  const range = maxBalance - minBalance;
  
  // Add padding to the min/max for better visualization
  const paddedMin = Math.max(0, minBalance - range * 0.1);
  const paddedMax = maxBalance + range * 0.1;
  
  // Calculate points for the path
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * screenWidth;
    const y = height - ((item.balance - paddedMin) / (paddedMax - paddedMin)) * height;
    return { x, y, ...item };
  });
  
  // Create the path string
  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x},${point.y}`;
    }
    return `${acc} L ${point.x},${point.y}`;
  }, '');
  
  // Format date for labels
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };
  
  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.yAxisLabels}>
          <Text style={styles.yAxisLabel}>{formatCurrency(paddedMax)}</Text>
          <Text style={styles.yAxisLabel}>{formatCurrency((paddedMax + paddedMin) / 2)}</Text>
          <Text style={styles.yAxisLabel}>{formatCurrency(paddedMin)}</Text>
        </View>
      )}
      
      <Svg width={screenWidth} height={height}>
        {/* Horizontal grid lines */}
        <Line
          x1="0"
          y1={height / 2}
          x2={screenWidth}
          y2={height / 2}
          stroke={colors.dark.border}
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        
        {/* Chart line */}
        <Path
          d={pathD}
          fill="none"
          stroke={colors.primary}
          strokeWidth="3"
        />
        
        {/* Gradient fill - simplified for this example */}
        <Path
          d={`${pathD} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`}
          fill={`${colors.primary}20`}
        />
        
        {/* Data points */}
        {points.filter((_, i) => i % 5 === 0 || i === points.length - 1).map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={colors.primary}
            stroke={colors.dark.background}
            strokeWidth={2}
          />
        ))}
        
        {/* X-axis labels */}
        {showLabels && points.filter((_, i) => i % 7 === 0 || i === points.length - 1).map((point, index) => (
          <SvgText
            key={index}
            x={point.x}
            y={height + 15}
            fontSize="10"
            fill={colors.dark.textSecondary}
            textAnchor="middle"
          >
            {formatDate(point.date)}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  yAxisLabels: {
    height: 200,
    justifyContent: 'space-between',
    marginRight: 8,
  },
  yAxisLabel: {
    color: colors.dark.textSecondary,
    fontSize: 10,
  },
});