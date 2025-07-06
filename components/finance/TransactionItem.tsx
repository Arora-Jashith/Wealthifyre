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
  TrendingUp 
} from 'lucide-react-native';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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
    switch (transaction.category.toLowerCase()) {
      case 'food':
        return <ShoppingBag size={20} color={colors.primary} />;
      case 'dining':
        return <Utensils size={20} color={colors.primary} />;
      case 'entertainment':
        return <Tv size={20} color={colors.primary} />;
      case 'utilities':
        return <Zap size={20} color={colors.primary} />;
      case 'transportation':
        return <Car size={20} color={colors.primary} />;
      case 'housing':
      case 'home':
        return <Home size={20} color={colors.primary} />;
      case 'income':
        return <DollarSign size={20} color={colors.positive} />;
      case 'transfer':
        return <ArrowRightLeft size={20} color={colors.secondary} />;
      case 'investment':
        return <TrendingUp size={20} color={colors.secondary} />;
      default:
        return <Coffee size={20} color={colors.primary} />;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {getCategoryIcon()}
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.description}>{transaction.description}</Text>
        
        <View style={styles.subDetails}>
          <Text style={styles.category}>{transaction.category}</Text>
          <Text style={styles.dateTime}>
            {formatDate(transaction.date)} • {formatTime(transaction.date)}
          </Text>
        </View>
        
        {transaction.merchant && (
          <Text style={styles.merchant}>{transaction.merchant}</Text>
        )}
      </View>
      
      <View style={styles.amountContainer}>
        <Text 
          style={[
            styles.amount,
            transaction.amount < 0 ? styles.expense : styles.income
          ]}
        >
          {formatAmount(transaction.amount)}
        </Text>
        
        {transaction.roundUp !== undefined && transaction.roundUp > 0 && (
          <Text style={styles.roundUp}>
            +{transaction.roundUp.toFixed(2)} invested
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  description: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  subDetails: {
    flexDirection: 'row',
    marginTop: 2,
  },
  category: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginRight: 8,
  },
  dateTime: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  merchant: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
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
  roundUp: {
    color: colors.secondary,
    fontSize: 12,
    marginTop: 2,
  },
});