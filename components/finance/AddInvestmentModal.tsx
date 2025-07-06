import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Investment } from '@/types/finance';
import { useFinanceStore } from '@/store/finance-store';
import { Plus, X, TrendingUp, TrendingDown, DollarSign, Percent, Calendar, AlertCircle } from 'lucide-react-native';

type InvestmentType = 'stock' | 'etf' | 'crypto' | 'roundups' | 'mutualfunds' | 'ipos';

interface AddInvestmentModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (investment: Omit<Investment, 'id' | 'lastUpdated'>) => void;
}

export const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({
  visible,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [initialValue, setInitialValue] = useState('');
  const [type, setType] = useState<InvestmentType>('stock');
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setValue('');
    setInitialValue('');
    setType('stock');
    setError('');
  };

  const handleAdd = () => {
    // Validate inputs
    if (!name.trim()) {
      setError('Please enter an investment name');
      return;
    }
    
    const valueNum = parseFloat(value);
    const initialValueNum = parseFloat(initialValue);
    
    if (isNaN(valueNum) || valueNum <= 0) {
      setError('Please enter a valid current value');
      return;
    }
    
    if (isNaN(initialValueNum) || initialValueNum <= 0) {
      setError('Please enter a valid initial value');
      return;
    }
    
    const growth = ((valueNum - initialValueNum) / initialValueNum) * 100;
    
    // Create the new investment
    const newInvestment = {
      name: name.trim(),
      value: valueNum,
      initialValue: initialValueNum,
      growth,
      type,
    };
    
    // Add the investment
    onAdd(newInvestment);
    
    // Show success feedback
    alert(`${name.trim()} added to your investments!`);
    
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Card style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Investment</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.form}>
            {error ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={20} color={colors.accent} style={{marginRight: 8}} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Investment Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Apple Inc."
                  placeholderTextColor={colors.dark.textSecondary}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Investment Type</Text>
              <View style={styles.typeButtonsContainer}>
                {(['stock', 'etf', 'crypto', 'mutualfunds', 'ipos'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeButton,
                      type === t && styles.typeButtonActive,
                    ]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[
                      styles.typeButtonText,
                      type === t && styles.typeButtonTextActive,
                    ]}>
                      {t === 'mutualfunds' ? 'Mutual Funds' : 
                       t === 'ipos' ? 'IPOs' : 
                       t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Value</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.dark.textSecondary}
                  keyboardType="numeric"
                  value={value}
                  onChangeText={setValue}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Initial Investment</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.dark.textSecondary}
                  keyboardType="numeric"
                  value={initialValue}
                  onChangeText={setInitialValue}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAdd}
            >
              <Plus size={20} color={colors.dark.text} style={styles.addButtonIcon} />
              <Text style={styles.addButtonText}>Add Investment</Text>
            </TouchableOpacity>
          </ScrollView>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: colors.accent,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    color: colors.dark.text,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.dark.text,
    fontSize: 16,
    height: '100%',
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  typeButtonText: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  addButtonIcon: {
    marginRight: 10,
  },
  addButtonText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
