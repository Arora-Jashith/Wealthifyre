import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';

interface ContactCardProps {
  name: string;
  avatar: string | null;
  onPress: () => void;
  style?: any;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  name,
  avatar,
  onPress,
  style
}) => {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.placeholderText}>{name.charAt(0)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 60,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.dark.cardHighlight,
    overflow: 'hidden',
    marginBottom: 6,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark.cardHighlight,
  },
  placeholderText: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  name: {
    color: colors.dark.text,
    fontSize: 12,
    textAlign: 'center',
    width: '100%',
  }
});
