import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { AddTransactionModal } from './AddTransactionModal';

interface AddTransactionButtonProps {
  label?: string;
  style?: any;
  iconSize?: number;
  fullWidth?: boolean;
}

export const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({
  label = 'Add Transaction',
  style,
  iconSize = 20,
  fullWidth = false
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  return (
    <>
      <TouchableOpacity 
        style={[
          styles.button,
          fullWidth && styles.fullWidthButton,
          style
        ]}
        onPress={() => setIsModalVisible(true)}
      >
        <Plus size={iconSize} color={colors.dark.buttonText} />
        {label && <Text style={styles.label}>{label}</Text>}
      </TouchableOpacity>
      
      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fullWidthButton: {
    width: '100%',
  },
  label: {
    color: colors.dark.buttonText,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  }
});
