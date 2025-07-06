import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

type Option = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
  activeColor?: string;
  textStyle?: TextStyle;
  variant?: 'default' | 'pill' | 'underline' | 'block';
  size?: 'small' | 'medium' | 'large';
};

export function SegmentedControl({
  options,
  value,
  onChange,
  style,
  activeColor = colors.primary,
  textStyle,
  variant = 'default',
  size = 'medium',
}: SegmentedControlProps) {
  const activeIndex = options.findIndex(option => option.value === value);
  const [segmentWidths, setSegmentWidths] = useState<number[]>([]);
  const [segmentPositions, setSegmentPositions] = useState<number[]>([]);
  const animatedValue = useSharedValue(activeIndex);
  
  React.useEffect(() => {
    animatedValue.value = activeIndex;
  }, [activeIndex]);

  const handleLayout = (index: number, event: any) => {
    const { width, x } = event.nativeEvent.layout;
    
    setSegmentWidths(prev => {
      const newWidths = [...prev];
      newWidths[index] = width;
      return newWidths;
    });
    
    setSegmentPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = x;
      return newPositions;
    });
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    if (!segmentWidths[activeIndex]) {
      return { opacity: 0 };
    }
    
    return {
      width: withTiming(segmentWidths[activeIndex], { duration: 200 }),
      transform: [
        { translateX: withTiming(segmentPositions[activeIndex], { duration: 200 }) },
      ],
      opacity: 1,
    };
  });

  const handlePress = (index: number, optionValue: string) => {
    if (index !== activeIndex) {
      animatedValue.value = index;
      onChange(optionValue);
    }
  };

  return (
    <View 
      style={[
        styles.container, 
        style
      ]}
    >
      {/* Animated selection indicator */}
      <Animated.View 
        style={[
          styles.selectionIndicator, 
          animatedIndicatorStyle
        ]} 
      />
      
      {/* Option buttons */}
      {options.map((option, index) => {
        const isActive = index === activeIndex;
        
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.optionButton, { zIndex: 1 }]}
            onPress={() => handlePress(index, option.value)}
            onLayout={(event) => handleLayout(index, event)}
          >
            <Text 
              style={[
                styles.optionText,
                isActive ? 
                  { color: '#FFFFFF', fontWeight: '600' } : 
                  { color: '#FFFFFF', fontWeight: '400' },
                textStyle
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 4,
    overflow: 'hidden',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    height: 'auto',
    backgroundColor: colors.dark.card,
    borderRadius: 6,
    zIndex: 0,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 1,
  },
  optionText: {
    textAlign: 'center',
    color: colors.dark.textSecondary,
    fontWeight: '500',
  },
});
