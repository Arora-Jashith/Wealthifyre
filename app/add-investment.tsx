import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { TrendingUp, ArrowLeft } from 'lucide-react-native';
import { Investment } from '@/types/finance';

export default function AddInvestmentScreen() {
  const router = useRouter();
  const { addInvestment } = useFinanceStore();
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<Investment['type']>('stock');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const handleAddInvestment = () => {
    if (!name || !amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    // Create investment object with required fields
    const parsedAmount = parseFloat(amount);
    const newInvestment: any = {
      name: name,
      value: parsedAmount,
      initialValue: parsedAmount,
      growth: 0,
      type: type,
    };
    
    // Add ticker if it's a stock
    if (type === 'stock') {
      // Extract ticker from name if possible
      const tickerMatch = name.match(/\(([A-Z]+)\)/);
      if (tickerMatch && tickerMatch[1]) {
        newInvestment.ticker = tickerMatch[1];
      }
    }
    
    // Add the investment
    addInvestment(newInvestment);
    
    // Show success modal
    setShowSuccessModal(true);
    
    // After 1.5 seconds, close modal and return to investments screen
    setTimeout(() => {
      setShowSuccessModal(false);
      router.back();
    }, 1500);
  };
  
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{
          title: 'Add Investment',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.dark.background,
          },
          headerTintColor: colors.dark.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
              <ArrowLeft size={24} color={colors.dark.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TrendingUp size={32} color={colors.primary} />
          <Text style={styles.title}>Add Investment</Text>
          <Text style={styles.subtitle}>Add a new investment to track in your portfolio</Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Investment Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Apple Stock, Bitcoin"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Investment Type</Text>
            <View style={styles.typeContainer}>
              {[
                { label: 'Stock', value: 'stock' },
                { label: 'ETF', value: 'etf' },
                { label: 'Crypto', value: 'crypto' },
                { label: 'Mutual Funds', value: 'mutualfunds' },
                { label: 'IPOs', value: 'ipos' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.typeButton,
                    type === item.value && styles.activeTypeButton
                  ]}
                  onPress={() => setType(item.value as Investment['type'])}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === item.value && styles.activeTypeButtonText
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expected Annual Return (%)</Text>
            <View style={styles.expectedReturnContainer}>
              <TrendingUp size={20} color="#666" style={styles.expectedReturnIcon} />
              <TextInput
                style={styles.expectedReturnInput}
                placeholder="0.0"
                placeholderTextColor="#666"
                keyboardType="decimal-pad"
                value={expectedReturn}
                onChangeText={setExpectedReturn}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Risk Level</Text>
            <View style={styles.riskLevelContainer}>
              {['Low', 'Medium', 'High'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.riskLevelButton,
                    riskLevel === level && styles.activeRiskLevelButton,
                    level === 'Low' && styles.lowRiskButton,
                    level === 'Medium' && styles.mediumRiskButton,
                    level === 'High' && styles.highRiskButton,
                  ]}
                  onPress={() => setRiskLevel(level as 'Low' | 'Medium' | 'High')}
                >
                  <Text
                    style={[
                      styles.riskLevelButtonText,
                      riskLevel === level && styles.activeRiskLevelButtonText
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              This information will be used to track your investment performance and provide insights.
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.addButton,
            (!name || !amount) && styles.disabledButton
          ]}
          onPress={handleAddInvestment}
          disabled={!name || !amount}
        >
          <Text style={styles.addButtonText}>Add Investment</Text>
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
            <Text style={styles.successTitle}>Investment Added</Text>
            <Text style={styles.successMessage}>Successfully added {name} to your portfolio</Text>
            <TouchableOpacity 
              style={styles.okButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.back();
              }}
            >
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colors.dark.text,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 16,
  },
  currencySymbol: {
    fontSize: 18,
    color: colors.dark.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    color: colors.dark.text,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  typeButton: {
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 4,
  },
  activeTypeButton: {
    backgroundColor: colors.primary,
  },
  typeButtonText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  expectedReturnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    padding: 16,
  },
  expectedReturnIcon: {
    marginRight: 8,
  },
  expectedReturnInput: {
    flex: 1,
    fontSize: 16,
    color: colors.dark.text,
  },
  riskLevelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  riskLevelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  lowRiskButton: {
    backgroundColor: colors.dark.card,
  },
  mediumRiskButton: {
    backgroundColor: colors.dark.card,
  },
  highRiskButton: {
    backgroundColor: colors.dark.card,
  },
  activeRiskLevelButton: {
    borderWidth: 2,
  },
  activeRiskLevelButtonText: {
    fontWeight: '600',
  },
  riskLevelButtonText: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  disabledButton: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModal: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  successTitle: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  successMessage: {
    color: colors.dark.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  okButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  okButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
