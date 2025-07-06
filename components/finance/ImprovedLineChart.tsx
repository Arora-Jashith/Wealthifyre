import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

type DataPoint = {
  value: number;
  label: string;
};

type ImprovedLineChartProps = {
  data: DataPoint[];
  height: number;
  width?: number;
  showGrid?: boolean;
  showGradient?: boolean;
  highlightIndex?: number;
  highlightValue?: string;
  yAxisLabels?: string[];
  color?: string;
};

export function ImprovedLineChart({
  data,
  height,
  width = Dimensions.get('window').width - 40,
  showGrid = true,
  showGradient = true,
  highlightIndex,
  highlightValue,
  yAxisLabels = ['0', '25', '50', '75', '100'],
  color = colors.primary,
}: ImprovedLineChartProps) {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        color: () => color,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: () => color,
    labelColor: () => colors.dark.textSecondary,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
      strokeWidth: '0',
    },
    propsForBackgroundLines: {
      stroke: showGrid ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
      strokeDasharray: '',
    },
    propsForLabels: {
      fontSize: '10',
    },
  };

  return (
    <View style={styles.container}>
      {showGradient && (
        <LinearGradient
          colors={[`${color}40`, `${color}10`, 'transparent']}
          style={[styles.gradient, { height }]}
          pointerEvents="none"
        />
      )}
      
      {yAxisLabels && (
        <View style={styles.yAxisLabels}>
          {yAxisLabels.map((label, index) => (
            <Text key={index} style={styles.yAxisLabel}>
              {label}
            </Text>
          ))}
        </View>
      )}
      
      <LineChart
        data={chartData}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier
        withHorizontalLines={showGrid}
        withVerticalLines={false}
        withDots={false}
        withShadow={false}
        withInnerLines={showGrid}
        withOuterLines={false}
        fromZero
        style={styles.chart}
      />
      
      {highlightIndex !== undefined && highlightValue && (
        <View 
          style={[
            styles.highlightContainer, 
            { 
              left: (width / (data.length - 1)) * highlightIndex - 30,
              top: 10
            }
          ]}
        >
          <View style={styles.highlightDot} />
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
  },
  chart: {
    borderRadius: 16,
    paddingRight: 0,
    paddingTop: 20,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    zIndex: 1,
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
  highlightContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 3,
  },
  highlightDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.dark.background,
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
