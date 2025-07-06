import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transaction } from '@/types/finance';
import { colors } from '@/constants/colors';
import { 
  ShoppingBag, 
  Coffee, 
  Utensils, 
  Home, 
  Car, 
  Tv, 
  Zap, 
  DollarSign, 
  ArrowRightLeft, 
  TrendingUp,
  Briefcase,
  BookOpen
} from 'lucide-react-native';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItemNew: React.FC<TransactionItemProps> = ({
  transaction,
  onPress
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    const prefix = amount >= 0 ? '+' : '';
    return `${prefix}${amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getCategoryIcon = () => {
    const size = 20;
    const color = getCategoryColor();
    
    switch (transaction.category.toLowerCase()) {
      case 'food':
        return <Utensils size={size} color={color} />;
      case 'dining':
        return <Coffee size={size} color={color} />;
      case 'entertainment':
        return <Tv size={size} color={color} />;
      case 'utilities':
        return <Zap size={size} color={color} />;
      case 'transportation':
        return <Car size={size} color={color} />;
      case 'housing':
      case 'home':
        return <Home size={size} color={color} />;
      case 'income':
      case 'salary':
        return <Briefcase size={size} color={color} />;
      case 'transfer':
        return <ArrowRightLeft size={size} color={color} />;
      case 'investment':
        return <TrendingUp size={size} color={color} />;
      case 'education':
        return <BookOpen size={size} color={color} />;
      default:
        return <ShoppingBag size={size} color={color} />;
    }
  };

  const getCategoryColor = () => {
    const category = transaction.category.toLowerCase();
    
    if (category in colors.categories) {
      return colors.categories[category as keyof typeof colors.categories];
    }
    
    if (transaction.type === 'income') {
      return colors.positive;
    } else if (transaction.type === 'expense') {
      return colors.accent;
    }
    
    return colors.primary;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${getCategoryColor()}20` }]}>
        {getCategoryIcon()}
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.mainDetails}>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text 
            style={[
              styles.amount,
              transaction.amount < 0 ? styles.expense : styles.income
            ]}
          >
            {formatAmount(transaction.amount)}
          </Text>
        </View>
        
        <View style={styles.subDetails}>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.date}>{formatDate(transaction.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  mainDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  description: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  expense: {
    color: colors.accent,
  },
  income: {
    color: colors.positive,
  },
  subDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  date: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
});
