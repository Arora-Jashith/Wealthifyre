import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Stack, router, useFocusEffect } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { useFinanceStore } from '@/store/finance-store';
import { Budget } from '@/types/finance';
import { PieChart, Plus, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BudgetsScreen() {
  const { budgets } = useFinanceStore();
  const [activePeriod, setActivePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key to force re-render when budgets change
  
  // Use useFocusEffect to refresh the screen when it comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Force a refresh when the screen comes into focus
      setRefreshKey(prev => prev + 1);
      
      // No cleanup needed for useFocusEffect
      return () => {};
    }, [])
  );

  // Filter budgets by period
  const filteredBudgets = budgets.filter(budget => budget.period === activePeriod);

  // Calculate total allocated and spent
  const totalAllocated = filteredBudgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = filteredBudgets.reduce((sum, budget) => sum + budget.spent, 0);
  
  // Calculate percentage spent
  const percentageSpent = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Budgets',
          headerStyle: {
            backgroundColor: colors.dark.background,
          },
          headerTintColor: colors.dark.text,
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        {/* Budget Summary Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Budget Summary</Text>
              <View style={styles.periodSelector}>
                {(['daily', 'weekly', 'monthly'] as const).map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.periodButton,
                      activePeriod === period && styles.activePeriodButton,
                    ]}
                    onPress={() => setActivePeriod(period)}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        activePeriod === period && styles.activePeriodButtonText,
                      ]}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.summaryContent}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Allocated</Text>
                <Text style={styles.summaryValue}>{formatCurrency(totalAllocated)}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Spent</Text>
                <Text style={styles.summaryValue}>{formatCurrency(totalSpent)}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Remaining</Text>
                <Text style={[
                  styles.summaryValue,
                  { color: totalAllocated - totalSpent >= 0 ? colors.positive : colors.negative }
                ]}>
                  {formatCurrency(totalAllocated - totalSpent)}
                </Text>
              </View>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(percentageSpent, 100)}%`,
                      backgroundColor: percentageSpent > 100 ? colors.negative : colors.primary,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {percentageSpent.toFixed(0)}% spent
              </Text>
            </View>
          </Card>
        </Animated.View>
        
        {/* Budget List */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <View style={styles.budgetListHeader}>
            <Text style={styles.budgetListTitle}>Your Budgets</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-budget')}
            >
              <Plus size={20} color={colors.dark.text} />
              <Text style={styles.addButtonText}>Add Budget</Text>
            </TouchableOpacity>
          </View>
          
          {filteredBudgets.length === 0 ? (
            <Card style={styles.emptyCard}>
              <PieChart size={48} color={colors.dark.textSecondary} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No Budgets Yet</Text>
              <Text style={styles.emptyText}>
                Create your first {activePeriod} budget to start tracking your spending
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/add-budget')}
              >
                <Text style={styles.emptyButtonText}>Create Budget</Text>
              </TouchableOpacity>
            </Card>
          ) : (
            <FlatList
              data={filteredBudgets}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => <BudgetCard budget={item} />}
              contentContainerStyle={styles.budgetList}
            />
          )}
        </Animated.View>
      </ScrollView>
      
      {/* We've replaced the modal with a dedicated page */}
    </View>
  );
}

interface BudgetCardProps {
  budget: Budget;
}

function BudgetCard({ budget }: BudgetCardProps) {
  const { deleteBudget } = useFinanceStore();
  
  // Calculate percentage spent
  const percentageSpent = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  return (
    <Card style={styles.budgetCard}>
      <View style={styles.budgetCardHeader}>
        <View style={[styles.categoryIndicator, { backgroundColor: budget.color || colors.primary }]} />
        <Text style={styles.budgetCardTitle}>{budget.category}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteBudget(budget.id)}
        >
          <Trash2 size={18} color={colors.dark.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.budgetCardContent}>
        <View style={styles.budgetCardItem}>
          <Text style={styles.budgetCardLabel}>Allocated</Text>
          <Text style={styles.budgetCardValue}>{formatCurrency(budget.allocated)}</Text>
        </View>
        
        <View style={styles.budgetCardItem}>
          <Text style={styles.budgetCardLabel}>Spent</Text>
          <Text style={styles.budgetCardValue}>{formatCurrency(budget.spent)}</Text>
        </View>
        
        <View style={styles.budgetCardItem}>
          <Text style={styles.budgetCardLabel}>Remaining</Text>
          <Text style={[
            styles.budgetCardValue,
            { color: budget.allocated - budget.spent >= 0 ? colors.positive : colors.negative }
          ]}>
            {formatCurrency(budget.allocated - budget.spent)}
          </Text>
        </View>
      </View>
      
      <View style={styles.budgetProgressContainer}>
        <View style={styles.budgetProgressBar}>
          <View
            style={[
              styles.budgetProgressFill,
              {
                width: `${Math.min(percentageSpent, 100)}%`,
                backgroundColor: percentageSpent > 100 ? colors.negative : budget.color || colors.primary,
              },
            ]}
          />
        </View>
        <Text style={styles.budgetProgressText}>
          {percentageSpent.toFixed(0)}% spent
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  summaryCard: {
    marginBottom: 24,
    padding: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: colors.dark.background,
  },
  periodButtonText: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  activePeriodButtonText: {
    color: colors.dark.text,
    fontWeight: '500',
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.dark.card,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  budgetListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    color: colors.dark.text,
    marginLeft: 4,
  },
  budgetList: {
    gap: 12,
  },
  budgetCard: {
    padding: 16,
    marginBottom: 12,
  },
  budgetCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  budgetCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  budgetCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  budgetCardItem: {
    alignItems: 'center',
  },
  budgetCardLabel: {
    fontSize: 12,
    color: colors.dark.textSecondary,
    marginBottom: 2,
  },
  budgetCardValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
  },
  budgetProgressContainer: {
    alignItems: 'center',
  },
  budgetProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: colors.dark.card,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  budgetProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  budgetProgressText: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark.text,
  },
});
