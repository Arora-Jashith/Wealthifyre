import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'highlight' | 'dark' | 'colored';
  color?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  color
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'highlight':
        return colors.dark.cardHighlight;
      case 'dark':
        return colors.dark.card;
      case 'colored':
        return color ? `${color}20` : `${colors.primary}20`; // 20% opacity
      default:
        return colors.dark.cardAlt;
    }
  };

  const getBorderColor = () => {
    if (variant === 'colored' && color) {
      return `${color}40`; // 40% opacity
    }
    return colors.dark.border;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
});
