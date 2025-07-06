import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Account } from '@/types/finance';
import { colors } from '@/constants/colors';
import { CreditCard, Wallet, Landmark, TrendingUp } from 'lucide-react-native';

interface AccountCardProps {
  account: Account;
  onPress?: () => void;
  selected?: boolean;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onPress,
  selected = false
}) => {
  const getAccountIcon = () => {
    switch (account.type) {
      case 'checking':
        return <Wallet size={24} color={colors.primary} />;
      case 'savings':
        return <Landmark size={24} color={colors.primary} />;
      case 'investment':
        return <TrendingUp size={24} color={colors.primary} />;
      case 'credit':
        return <CreditCard size={24} color={colors.primary} />;
      default:
        return <Wallet size={24} color={colors.primary} />;
    }
  };

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('en-US', {
      style: 'currency',
      currency: account.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card 
        style={[
          styles.card,
          selected && styles.selectedCard
        ]}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {getAccountIcon()}
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountType}>
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
              {account.lastFour && ` •••• ${account.lastFour}`}
            </Text>
          </View>
        </View>
        
        <View style={styles.balanceContainer}>
          <Text 
            style={[
              styles.balanceAmount,
              account.type === 'credit' && account.balance < 0 && styles.negativeBalance
            ]}
          >
            {formatBalance(Math.abs(account.balance))}
          </Text>
          {account.type === 'credit' && account.balance < 0 && (
            <Text style={styles.balanceLabel}>Owed</Text>
          )}
        </View>
        
        {account.institution && (
          <Text style={styles.institution}>{account.institution}</Text>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 4,
    width: 200,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  accountInfo: {
    flex: 1,
  },
  accountName: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  accountType: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  balanceContainer: {
    marginBottom: 8,
  },
  balanceAmount: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  negativeBalance: {
    color: colors.accent,
  },
  balanceLabel: {
    color: colors.accent,
    fontSize: 12,
    marginTop: 2,
  },
  institution: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
});