import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Budget } from '@/types/finance';
import { colors } from '@/constants/colors';

interface BudgetCardProps {
  budget: Budget;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
  const progress = (budget.spent / budget.allocated) * 100;
  const remaining = budget.allocated - budget.spent;
  
  const getStatusColor = () => {
    if (progress >= 100) return colors.accent;
    if (progress >= 80) return '#FF9F1C'; // Warning color
    return budget.color || colors.primary;
  };
  
  return (
    <GlassCard 
      style={styles.card}
      variant={progress >= 100 ? 'colored' : 'default'}
      color={getStatusColor()}
    >
      <View style={styles.header}>
        <Text style={styles.category}>{budget.category}</Text>
        <View style={styles.periodContainer}>
          <Text style={styles.period}>
            {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <ProgressRing
          progress={progress}
          size={80}
          strokeWidth={8}
          color={getStatusColor()}
          backgroundColor={`${getStatusColor()}30`}
          showPercentage={true}
          percentageStyle={{
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.dark.text
          }}
        />
        
        <View style={styles.details}>
          <View style={styles.amountRow}>
            <Text style={styles.label}>Spent</Text>
            <Text style={styles.spent}>
              ${budget.spent.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.amountRow}>
            <Text style={styles.label}>Allocated</Text>
            <Text style={styles.allocated}>
              ${budget.allocated.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.amountRow}>
            <Text style={styles.label}>Remaining</Text>
            <Text 
              style={[
                styles.remaining,
                remaining < 0 && styles.overBudget
              ]}
            >
              ${Math.abs(remaining).toFixed(2)}
              {remaining < 0 ? ' over' : ''}
            </Text>
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  category: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  periodContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  period: {
    color: colors.dark.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  spent: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  allocated: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
  },
  remaining: {
    color: colors.positive,
    fontSize: 14,
    fontWeight: '600',
  },
  overBudget: {
    color: colors.accent,
  },
});