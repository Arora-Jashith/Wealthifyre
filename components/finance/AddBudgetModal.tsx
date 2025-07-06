import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Budget } from '@/types/finance';
import { useFinanceStore } from '@/store/finance-store';
import { DollarSign, X, PieChart, Info } from 'lucide-react-native';

interface AddBudgetModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({
  visible,
  onClose,
}) => {
  const { addBudget } = useFinanceStore();
  const [category, setCategory] = useState('');
  const [allocated, setAllocated] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [error, setError] = useState('');

  const resetForm = () => {
    setCategory('');
    setAllocated('');
    setPeriod('monthly');
    setError('');
  };

  const handleAdd = () => {
    // Validate inputs
    if (!category.trim()) {
      setError('Please enter a budget category');
      return;
    }
    
    const allocatedNum = parseFloat(allocated);
    
    if (isNaN(allocatedNum) || allocatedNum <= 0) {
      setError('Please enter a valid budget amount');
      return;
    }
    
    // Create new budget with more details
    const newBudget: Omit<Budget, 'id'> = {
      category: category.trim(),
      allocated: allocatedNum,
      spent: 0, // New budget starts with 0 spent
      period,
      color: getRandomColor(),
      createdAt: new Date().toISOString(),
      transactions: [], // Initialize with empty transactions array
    };
    
    // Add budget to store
    addBudget(newBudget);
    
    // Add a notification to show real-time feedback
    const notification = {
      id: Date.now().toString(),
      title: 'Budget Created',
      message: `Your ${formatCurrency(allocatedNum)} ${period} ${category} budget has been created.`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    // Show success message
    Alert.alert(
      "Budget Added",
      `Successfully added ${category} budget for ${formatCurrency(allocatedNum)}`,
      [{ text: "OK", onPress: () => {
        resetForm();
        onClose();
      }}]
    );
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  const getRandomColor = () => {
    const colors = [
      '#4A6FFF', // Blue
      '#FF9F1C', // Orange
      '#8A4FFF', // Purple
      '#FF4F8A', // Pink
      '#4FFF8A', // Green
      '#FFD700', // Gold
      '#FF6347', // Tomato
      '#40E0D0', // Turquoise
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
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
            <Text style={styles.modalTitle}>Add New Budget</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.dark.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.form}>
            {error ? (
              <View style={styles.errorContainer}>
                <Info size={20} color={colors.accent} style={{marginRight: 8}} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Budget Category</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Groceries, Entertainment, etc."
                  placeholderTextColor={colors.dark.textSecondary}
                  value={category}
                  onChangeText={setCategory}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Budget Period</Text>
              <View style={styles.periodButtonsContainer}>
                {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.periodButton,
                      period === p && styles.periodButtonActive,
                    ]}
                    onPress={() => setPeriod(p)}
                  >
                    <Text style={[
                      styles.periodButtonText,
                      period === p && styles.periodButtonTextActive,
                    ]}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Budget Amount</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.dark.textSecondary}
                  keyboardType="numeric"
                  value={allocated}
                  onChangeText={setAllocated}
                />
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAdd}
            >
              <PieChart size={20} color={colors.dark.text} style={styles.addButtonIcon} />
              <Text style={styles.addButtonText}>Add Budget</Text>
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
    marginBottom: 16,
  },
  errorText: {
    color: colors.accent,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: colors.dark.text,
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: colors.dark.text,
    fontSize: 16,
    paddingVertical: 10,
  },
  periodButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  periodButtonActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  periodButtonText: {
    color: colors.dark.text,
    fontSize: 14,
  },
  periodButtonTextActive: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
  addButtonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
