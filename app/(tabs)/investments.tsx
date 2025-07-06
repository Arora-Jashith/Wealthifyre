import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { InvestmentCard } from '@/components/finance/InvestmentCard';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { getTotalRoundUps } from '@/mocks/transactions';
import { Plus, TrendingUp, Coins, ArrowUpRight, ChevronRight, Search } from 'lucide-react-native';
import { Link, router, useFocusEffect } from 'expo-router';

export default function InvestmentsScreen() {
  const { 
    investments, 
    selectedYear, 
    addInvestment, 
    setSelectedYear 
  } = useFinanceStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'stocks' | 'etfs' | 'crypto' | 'mutualfunds' | 'ipos' | 'roundups'>('all');
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key to force re-render when investments change
  // No longer using modal for adding investments
  
  // Use useFocusEffect to refresh the screen when it comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Force a refresh when the screen comes into focus
      setRefreshKey(prev => prev + 1);
      
      // No cleanup needed for useFocusEffect
      return () => {};
    }, [])
  );
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 2, currentYear - 1, currentYear];
  
  // Force re-render when refreshKey changes
  React.useEffect(() => {
    // This effect will run whenever refreshKey changes
    console.log('Refreshing investments view, key:', refreshKey);
  }, [refreshKey]);

  // Filter investments based on active filter and selected year
  const filteredInvestments = investments.filter(investment => {
    // Filter by type
    if (activeFilter === 'stocks' && investment.type !== 'stock') return false;
    if (activeFilter === 'etfs' && investment.type !== 'etf') return false;
    if (activeFilter === 'crypto' && investment.type !== 'crypto') return false;
    if (activeFilter === 'mutualfunds' && investment.type !== 'mutualfunds') return false;
    if (activeFilter === 'ipos' && investment.type !== 'ipos') return false;
    if (activeFilter === 'roundups' && investment.type !== 'roundups') return false;
    
    // Filter by year
    if (investment.lastUpdated) {
      const investmentYear = new Date(investment.lastUpdated).getFullYear();
      if (selectedYear && investmentYear !== selectedYear) return false;
    }
    
    return true;
  });
  
  // Calculate totals
  const totalValue = investments.reduce((sum, investment) => sum + investment.value, 0);
  const totalInitial = investments.reduce((sum, investment) => sum + investment.initialValue, 0);
  const totalGrowth = ((totalValue - totalInitial) / totalInitial) * 100;
  
  // Get round-up data
  const roundUpInvestment = investments.find(inv => inv.type === 'roundups');
  const totalRoundUps = getTotalRoundUps();
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Investments</Text>
        
        <TouchableOpacity 
          style={[styles.iconButton, styles.addButton]}
          onPress={() => router.push('/add-investment')}
        >
          <Plus size={10} color={colors.background} />
        </TouchableOpacity>
      </View>
      
      <Card style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <Text style={styles.overviewTitle}>Portfolio Overview</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>Details</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.overviewContent}>
          <View style={styles.valueContainer}>
            <Text style={styles.valueLabel}>Total Value</Text>
            <Text style={styles.valueAmount}>{formatCurrency(totalValue)}</Text>
            
            <View style={styles.growthContainer}>
              <ArrowUpRight size={18} color={totalGrowth >= 0 ? colors.positive : colors.accent} />
              <Text style={[
                styles.growthText,
                totalGrowth >= 0 ? styles.positiveGrowth : styles.negativeGrowth
              ]}>
                {totalGrowth >= 0 ? '+' : ''}{totalGrowth.toFixed(2)}%
              </Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={Math.min(totalGrowth, 100)}
              size={90}
              strokeWidth={10}
              color={totalGrowth >= 0 ? colors.positive : colors.accent}
              backgroundColor={`${totalGrowth >= 0 ? colors.positive : colors.accent}20`}
              showPercentage={true}
              percentageStyle={{
                fontSize: 28,
                fontWeight: 'bold',
                color: colors.dark.text
              }}
            />
          </View>
        </View>
      </Card>
      
      <Card style={{ marginBottom: 24, padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: `${colors.primary}20`, justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
            <Coins size={28} color={colors.primary} />
          </View>
          <View>
            <Text style={{ color: colors.dark.text, fontSize: 18, fontWeight: '600', marginBottom: 2 }}>Round-Up Investments</Text>
            <Text style={{ color: colors.dark.textSecondary, fontSize: 14 }}>Invest your spare change automatically</Text>
          </View>
        </View>
        
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.dark.textSecondary, fontSize: 14, marginBottom: 4 }}>Total Value</Text>
              <Text style={{ color: colors.dark.text, fontSize: 20, fontWeight: 'bold' }}>
                {formatCurrency(roundUpInvestment?.value || 0)}
              </Text>
            </View>
            
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.dark.textSecondary, fontSize: 14, marginBottom: 4 }}>This Month</Text>
              <Text style={{ color: colors.dark.text, fontSize: 20, fontWeight: 'bold' }}>
                {formatCurrency(totalRoundUps)}
              </Text>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginRight: 8 }}>
              <Text style={{ color: '#000', fontSize: 14, fontWeight: '600' }}>View Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginLeft: 8 }}>
              <Text style={{ color: colors.dark.text, fontSize: 14, fontWeight: '600' }}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
      
      <TouchableOpacity 
        style={[styles.exploreOptionsButton, { marginBottom: 20 }]}
        onPress={() => {
          router.push('/features/investment-options');
        }}
      >
        <Search size={20} color={colors.dark.text} />
        <Text style={styles.exploreOptionsText}>Explore Investment Options</Text>
      </TouchableOpacity>
      
      <View style={styles.filtersSection}>
        <View style={styles.filtersSectionHeader}>
          <Text style={styles.filtersSectionTitle}>Your Investments</Text>
        </View>
        
        <View style={styles.filterContainer}>
          <View style={styles.segmentContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScrollContent}>
              {[
                { label: 'All', value: 'all' },
                { label: 'Stocks', value: 'stocks' },
                { label: 'ETFs', value: 'etfs' },
                { label: 'Crypto', value: 'crypto' },
                { label: 'Mutual Funds', value: 'mutualfunds' },
                { label: 'IPOs', value: 'ipos' },
                { label: 'Round-Ups', value: 'roundups' }
              ].map((filter) => (
                <TouchableOpacity
                  key={filter.value}
                  style={[
                    styles.filterButton,
                    activeFilter === filter.value && styles.activeFilter
                  ]}
                  onPress={() => setActiveFilter(filter.value as any)}
                >
                  <Text style={[
                    styles.filterText,
                    activeFilter === filter.value && styles.activeFilterText
                  ]}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
      
      <View style={styles.investmentsContainer}>
        {filteredInvestments.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No investments found in this category</Text>
          </View>
        ) : (
          <View style={styles.investmentCardsGrid}>
            {filteredInvestments.map((item) => (
              <View key={item.id} style={styles.investmentCardWrapper}>
                <InvestmentCard investment={item} />
              </View>
            ))}
          </View>
        )}
      </View>
      
      <View style={[styles.buttonContainer, { marginBottom: 20 }]}>
        <TouchableOpacity 
          style={styles.addInvestmentButton}
          onPress={() => router.push('/add-investment')}
        >
          <TrendingUp size={20} color={colors.primary} />
          <Text style={styles.addInvestmentText}>Add New Investment</Text>
        </TouchableOpacity>
      </View>
      
      {/* Removed AddInvestmentModal - now using dedicated screen */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  iconButtonText: {
    color: colors.background,
  },
  overviewCard: {
    marginBottom: 24,
    padding: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  overviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabel: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    marginTop: 5,
  },
  valueContainer: {
    flex: 1,
  },
  valueLabel: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  valueAmount: {
    color: colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  positiveGrowth: {
    color: colors.positive,
  },
  negativeGrowth: {
    color: colors.accent,
  },
  roundUpsCard: {
    marginBottom: 24,
    padding: 16,
  },
  roundUpsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  roundUpsIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  roundUpsTitleContainer: {
    flex: 1,
  },
  roundUpsTitle: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  roundUpsSubtitle: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  roundUpsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  roundUpsStats: {
    flex: 1,
    marginRight: 16,
    marginBottom: 16,
  },
  roundUpsStat: {
    marginBottom: 16,
  },
  roundUpsStatLabel: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  roundUpsStatValue: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
  },
  roundUpsButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
  },
  roundUpsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  roundUpsButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  roundUpsSecondaryButton: {
    backgroundColor: colors.border,
  },
  roundUpsSecondaryButtonText: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  filtersSection: {
    marginBottom: 20,
  },
  filtersSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersSectionTitle: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: '600',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filtersScrollContent: {
    paddingRight: 16,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: colors.background,
    fontWeight: '600',
  },
  investmentsContainer: {
    marginBottom: 16,
  },
  emptyStateContainer: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  emptyStateText: {
    color: colors.dark.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  investmentsList: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  investmentCardsGrid: {
    flexDirection: 'column',
    paddingHorizontal: 4,
  },
  investmentCardWrapper: {
    width: '100%',
    marginBottom: 16,
    height: 180,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 12,
  },
  addInvestmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
  },
  addInvestmentText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  exploreOptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.card,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  exploreOptionsText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  segmentContainer: {
    // Adjusted styling for better integration with the header
    // Removed background, padding, border radius, and bottom margin
    marginLeft: 'auto', // Push to the right
    color: colors.dark.text, // Try setting a default text color
  },
  scrollViewContentContainer: {
    paddingBottom: 100,
  },
});