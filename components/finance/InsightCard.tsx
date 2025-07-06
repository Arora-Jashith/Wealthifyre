import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/Card';
import { FinancialInsight } from '@/types/finance';
import { colors } from '@/constants/colors';
import { AlertTriangle, Lightbulb, Award, Check } from 'lucide-react-native';

interface InsightCardProps {
  insight: FinancialInsight;
  onPress?: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onPress
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getInsightIcon = () => {
    switch (insight.type) {
      case 'alert':
        return <AlertTriangle size={20} color={colors.accent} />;
      case 'tip':
        return <Lightbulb size={20} color={colors.primary} />;
      case 'achievement':
        return <Award size={20} color={colors.secondary} />;
      default:
        return <Lightbulb size={20} color={colors.primary} />;
    }
  };

  const getPriorityColor = () => {
    switch (insight.priority) {
      case 'high':
        return colors.accent;
      case 'medium':
        return colors.secondary;
      case 'low':
        return colors.primary;
      default:
        return colors.primary;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, insight.read && styles.readCard]}>
        <View style={styles.header}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: `${getPriorityColor()}20` }
          ]}>
            {getInsightIcon()}
          </View>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{insight.title}</Text>
            <Text style={styles.date}>{formatDate(insight.date)}</Text>
          </View>
          
          {insight.read && (
            <View style={styles.readIndicator}>
              <Check size={16} color={colors.dark.textSecondary} />
            </View>
          )}
        </View>
        
        <Text style={styles.description}>{insight.description}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 4,
    width: 280,
  },
  readCard: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  description: {
    color: colors.dark.text,
    fontSize: 14,
    lineHeight: 20,
  },
  readIndicator: {
    marginLeft: 8,
  },
});