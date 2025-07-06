import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { LineChart } from '@/components/finance/LineChart';
import { colors } from '@/constants/colors';
import { BarChart2, TrendingUp, DollarSign, CreditCard, PieChart } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const [chartType, setChartType] = useState<'income' | 'expenses'>('income');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [highlightedPoint, setHighlightedPoint] = useState<number>(2);

  // Mock data for the chart
  const getChartData = () => {
    if (chartType === 'income') {
      if (timeRange === 'month') {
        return [
          { value: 5000, label: 'Apr' },
          { value: 8000, label: 'May' },
          { value: 20000, label: 'Jun' },
          { value: 25000, label: 'Jul' },
        ];
      } else if (timeRange === 'week') {
        return [
          { value: 3000, label: 'Mon' },
          { value: 5000, label: 'Tue' },
          { value: 4500, label: 'Wed' },
          { value: 6000, label: 'Thu' },
          { value: 7500, label: 'Fri' },
          { value: 2000, label: 'Sat' },
          { value: 1000, label: 'Sun' },
        ];
      } else {
        return [
          { value: 12000, label: 'Jan' },
          { value: 15000, label: 'Feb' },
          { value: 18000, label: 'Mar' },
          { value: 16000, label: 'Apr' },
          { value: 21000, label: 'May' },
          { value: 20000, label: 'Jun' },
          { value: 25000, label: 'Jul' },
          { value: 22000, label: 'Aug' },
          { value: 24000, label: 'Sep' },
          { value: 28000, label: 'Oct' },
          { value: 26000, label: 'Nov' },
          { value: 30000, label: 'Dec' },
        ];
      }
    } else {
      if (timeRange === 'month') {
        return [
          { value: 3000, label: 'Apr' },
          { value: 4500, label: 'May' },
          { value: 6000, label: 'Jun' },
          { value: 5500, label: 'Jul' },
        ];
      } else if (timeRange === 'week') {
        return [
          { value: 800, label: 'Mon' },
          { value: 1200, label: 'Tue' },
          { value: 900, label: 'Wed' },
          { value: 1500, label: 'Thu' },
          { value: 2000, label: 'Fri' },
          { value: 2500, label: 'Sat' },
          { value: 1000, label: 'Sun' },
        ];
      } else {
        return [
          { value: 8000, label: 'Jan' },
          { value: 9500, label: 'Feb' },
          { value: 7800, label: 'Mar' },
          { value: 10200, label: 'Apr' },
          { value: 9800, label: 'May' },
          { value: 11000, label: 'Jun' },
          { value: 12500, label: 'Jul' },
          { value: 11800, label: 'Aug' },
          { value: 13000, label: 'Sep' },
          { value: 14500, label: 'Oct' },
          { value: 13800, label: 'Nov' },
          { value: 15000, label: 'Dec' },
        ];
      }
    }
  };

  // Get chart color based on type
  const getChartColor = () => {
    switch (chartType) {
      case 'income':
        return colors.primary;
      case 'expenses':
        return colors.accent;
      default:
        return colors.primary;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
  };

  // Get random color for portfolio icons
  const getRandomColor = () => {
    const colors = [
      '#4A6FFF', // Blue
      '#FF9F1C', // Orange
      '#8A4FFF', // Purple
      '#FF4F8A', // Pink
      '#4FFF8A', // Green
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Calculate total
  const calculateTotal = () => {
    const data = getChartData();
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  // Calculate average
  const calculateAverage = () => {
    const data = getChartData();
    return data.length > 0 ? calculateTotal() / data.length : 0;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.duration(300)}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(300)}>
        <GlassCard style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>{chartType === 'income' ? 'Income' : 'Expenses'} History</Text>
          </View>
          
          {/* Improved toggle for Income/Expenses */}
          <View style={styles.toggleContainerImproved}>
            <SegmentedControl
              options={[
                { label: 'Income', value: 'income' },
                { label: 'Expenses', value: 'expenses' },
              ]}
              value={chartType}
              onChange={(value) => setChartType(value as 'income' | 'expenses')}
              style={{ width: screenWidth - 96, backgroundColor: colors.dark.card, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}
              variant="pill"
              size="small"
              activeColor={getChartColor()}
              textStyle={{ color: colors.dark.text, fontWeight: '600' }}
            />
          </View>

          <View style={styles.chartSubheader}>
            <Text style={styles.chartAmount}>{formatCurrency(calculateTotal())} USD</Text>
            <Text style={styles.chartSubtitle}>
              {chartType === 'income' ? 'Increase' : 'Decrease'} of <Text style={{ color: chartType === 'income' ? colors.positive : colors.negative }}>{chartType === 'income' ? '15%' : '8%'}</Text> from last month
            </Text>
          </View>

          <View style={styles.yAxisLabels}>
            <Text style={styles.yAxisLabel}>50k</Text>
            <Text style={styles.yAxisLabel}>20k</Text>
            <Text style={styles.yAxisLabel}>10k</Text>
            <Text style={styles.yAxisLabel}>0</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={[styles.statValue, { color: getChartColor() }]}>
                {formatCurrency(calculateTotal())}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Average</Text>
              <Text style={[styles.statValue, { color: getChartColor() }]}>
                {formatCurrency(calculateAverage())}
              </Text>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            <LineChart 
              data={getChartData()} 
              height={220}
              width={screenWidth - 72}
              showGrid={true}
              showGradient={true}
              color={getChartColor()}
              backgroundColor="transparent"
              highlightIndex={highlightedPoint}
              highlightValue={formatCurrency(getChartData()[highlightedPoint].value)}
              onPointPress={setHighlightedPoint}
              yAxisLabels={['0', '10k', '20k', '50k']}
            />
          </View>
          
          <Text style={styles.sectionTitle}>Payments History</Text>
        </GlassCard>
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(200).duration(300)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <GlassCard style={styles.portfolioCard}>
            <Text style={styles.cardTitle}>Portfolio Overview</Text>
            
            <View style={styles.portfolioList}>
              {[
                { name: 'City Bank', value: 10250.75, type: 'Checking' },
                { name: 'Etsy', value: 8750.25, type: 'Stocks' },
                { name: 'Master Card', value: 6750.50, type: 'Credit' }
              ].map((item, index) => (
                <View key={index} style={styles.portfolioItem}>
                  <View style={styles.portfolioItemLeft}>
                    <View style={[styles.portfolioIcon, { backgroundColor: getRandomColor() }]}>
                      <Text style={styles.portfolioIconText}>{item.name.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={styles.portfolioName}>{item.name}</Text>
                      <Text style={styles.portfolioType}>{item.type}</Text>
                    </View>
                  </View>
                  <Text style={styles.portfolioValue}>${item.value.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>
      </Animated.View>
      
      <Animated.View entering={FadeInDown.delay(300).duration(300)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spending Categories</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <GlassCard style={styles.categoriesCard}>
          <View style={styles.categoriesHeader}>
            <View style={styles.categoryIconContainer}>
              <PieChart size={24} color={colors.primary} />
            </View>
            <Text style={styles.categoriesTitle}>September 2025</Text>
          </View>
          
          <View style={styles.categoriesList}>
            <View style={styles.categoryItem}>
              <View style={styles.categoryNameContainer}>
                <View style={[styles.categoryDot, { backgroundColor: colors.primary }]} />
                <Text style={styles.categoryName}>Housing</Text>
              </View>
              <Text style={styles.categoryValue}>$1,200.00</Text>
              <Text style={styles.categoryPercentage}>35%</Text>
            </View>
            
            <View style={styles.categoryItem}>
              <View style={styles.categoryNameContainer}>
                <View style={[styles.categoryDot, { backgroundColor: '#4A6FFF' }]} />
                <Text style={styles.categoryName}>Food</Text>
              </View>
              <Text style={styles.categoryValue}>$650.00</Text>
              <Text style={styles.categoryPercentage}>18%</Text>
            </View>
            
            <View style={styles.categoryItem}>
              <View style={styles.categoryNameContainer}>
                <View style={[styles.categoryDot, { backgroundColor: '#FF9F1C' }]} />
                <Text style={styles.categoryName}>Transportation</Text>
              </View>
              <Text style={styles.categoryValue}>$450.00</Text>
              <Text style={styles.categoryPercentage}>12%</Text>
            </View>
            
            <View style={styles.categoryItem}>
              <View style={styles.categoryNameContainer}>
                <View style={[styles.categoryDot, { backgroundColor: '#8A4FFF' }]} />
                <Text style={styles.categoryName}>Entertainment</Text>
              </View>
              <Text style={styles.categoryValue}>$350.00</Text>
              <Text style={styles.categoryPercentage}>10%</Text>
            </View>
            
            <View style={styles.categoryItem}>
              <View style={styles.categoryNameContainer}>
                <View style={[styles.categoryDot, { backgroundColor: '#FF4F8A' }]} />
                <Text style={styles.categoryName}>Other</Text>
              </View>
              <Text style={styles.categoryValue}>$900.00</Text>
              <Text style={styles.categoryPercentage}>25%</Text>
            </View>
          </View>
        </GlassCard>
      </Animated.View>
      
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  chartCard: {
    marginBottom: 24,
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
  },
  chartSubheader: {
    marginBottom: 20,
  },
  chartAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  segmentContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 4,
    borderRadius: 20,
  },
  toggleContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  toggleContainerImproved: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  yAxisLabels: {
    display: 'none',
    position: 'absolute',
    left: 10,
    top: 160,
    bottom: 0,
    justifyContent: 'space-between',
    height: 220,
  },
  yAxisLabel: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.dark.text,
    marginTop: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
  },
  portfolioList: {
    gap: 12,
  },
  portfolioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  portfolioItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  portfolioIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingLeft: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleAlt: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: '600',
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  portfolioContainer: {
    marginBottom: 24,
  },
  portfolioCard: {
    marginBottom: 12,
    padding: 16,
  },
  portfolioCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  portfolioDetails: {
    flex: 1,
  },
  portfolioName: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  portfolioType: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  portfolioValue: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoriesCard: {
    marginBottom: 24,
    padding: 16,
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoriesTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryValue: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
    marginRight: 16,
    flex: 1,
    textAlign: 'right',
  },
  categoryPercentage: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  bottomPadding: {
    height: 40,
  },
});
