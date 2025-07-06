import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { Stack, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Budget } from '@/types/finance';
import { useFinanceStore } from '@/store/finance-store';
import { DollarSign, X, PieChart, ArrowLeft, Check } from 'lucide-react-native';

export default function AddBudgetScreen() {
  const { addBudget } = useFinanceStore();
  const [category, setCategory] = useState('');
  const [allocated, setAllocated] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    
    // Show success modal
    setShowSuccessModal(true);
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

  const handleBack = () => {
    router.back();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    resetForm();
    router.push('/(tabs)/budgets');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={colors.dark.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Budget</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Budget Details</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Groceries, Entertainment"
              placeholderTextColor={colors.dark.textSecondary}
              value={category}
              onChangeText={setCategory}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Budget Amount</Text>
            <View style={styles.amountInputContainer}>
              <DollarSign size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.dark.textSecondary}
                keyboardType="numeric"
                value={allocated}
                onChangeText={setAllocated}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Budget Period</Text>
            <View style={styles.periodSelector}>
              {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.periodButton,
                    period === p && styles.activePeriodButton,
                  ]}
                  onPress={() => setPeriod(p)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      period === p && styles.activePeriodButtonText,
                    ]}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add Budget</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIconContainer}>
              <Check size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.successTitle}>Budget Added</Text>
            <Text style={styles.successText}>
              {category} budget for {allocated ? formatCurrency(parseFloat(allocated)) : '$0.00'} has been added successfully.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.successButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.dark.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
  },
  errorText: {
    color: colors.negative,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.dark.cardAlt,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.dark.text,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.cardAlt,
    borderRadius: 8,
    padding: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: colors.dark.text,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.dark.cardAlt,
    borderRadius: 8,
    overflow: 'hidden',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activePeriodButton: {
    backgroundColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: colors.dark.text,
  },
  activePeriodButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.positive,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 8,
  },
  successText: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  successButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
