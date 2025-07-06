import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { Investment } from '@/types/finance';
import { colors } from '@/constants/colors';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface InvestmentCardProps {
  investment: Investment;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const formatGrowth = (growth: number) => {
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(2)}%`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCardColor = () => {
    switch(investment.type) {
      case 'stock': return colors.primary;
      case 'etf': return '#4A6FFF';
      case 'crypto': return '#FF9F1C';
      case 'mutualfunds': return '#8A4FFF';
      case 'ipos': return '#FF4F8A';
      case 'roundups': return colors.secondary;
      default: return colors.primary;
    }
  };
  
  const getTypeLabel = () => {
    switch(investment.type) {
      case 'stock': return 'STOCK';
      case 'etf': return 'ETF';
      case 'crypto': return 'CRYPTO';
      case 'mutualfunds': return 'MUTUAL FUND';
      case 'ipos': return 'IPO';
      case 'roundups': return 'ROUND-UPS';
      default: return String(investment.type).toUpperCase();
    }
  };

  return (
    <GlassCard 
      style={styles.card}
      variant="default"
      color={getCardColor()}
    >
      <View style={styles.header}>
        <Text style={styles.name}>{investment.name}</Text>
        <View style={[
          styles.typeTag,
          { backgroundColor: `${getCardColor()}30` }
        ]}>
          <Text style={styles.typeText}>
            {getTypeLabel()}
          </Text>
        </View>
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{formatCurrency(investment.value)}</Text>
        <View style={styles.growthContainer}>
          {investment.growth >= 0 ? (
            <TrendingUp size={16} color={colors.positive} />
          ) : (
            <TrendingDown size={16} color={colors.accent} />
          )}
          <Text style={[
            styles.growth,
            investment.growth >= 0 ? styles.positiveGrowth : styles.negativeGrowth
          ]}>
            {formatGrowth(investment.growth)}
          </Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Initial</Text>
          <Text style={styles.footerValue}>
            {formatCurrency(investment.initialValue)}
          </Text>
        </View>
        
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Updated</Text>
          <Text style={styles.footerValue}>
            {formatDate(investment.lastUpdated)}
          </Text>
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
  name: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: colors.dark.text,
    fontSize: 10,
    fontWeight: '600',
  },
  valueContainer: {
    marginBottom: 16,
  },
  value: {
    color: colors.dark.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  growth: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  positiveGrowth: {
    color: colors.positive,
  },
  negativeGrowth: {
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  footerValue: {
    color: colors.dark.text,
    fontSize: 13,
    fontWeight: '500',
  },
});