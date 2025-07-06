import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  color?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onPress,
  style,
  color = colors.primary
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        { backgroundColor: `${color}20` }, // 20% opacity
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TouchableOpacity 
        style={[styles.iconContainer, { backgroundColor: color }]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {icon}
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: 10,
    minWidth: 70,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  label: {
    color: colors.dark.text,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  }
});
