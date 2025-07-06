import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Investment } from '@/types/finance';
import { useFinanceStore } from '@/store/finance-store';
import { DollarSign, X, TrendingUp, ArrowLeft, Check, ArrowUpRight, Info } from 'lucide-react-native';

export default function PurchaseInvestmentScreen() {
  const params = useLocalSearchParams();
  const { id, name, ticker, price, category, image } = params;
  
  const { addInvestment, accounts, updateAccount, addTransaction } = useFinanceStore();
  const [amount, setAmount] = useState('');
  const [shares, setShares] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(accounts.length > 0 ? accounts[0].id : null);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchasedInvestment, setPurchasedInvestment] = useState<Investment | null>(null);
  const [calculationMode, setCalculationMode] = useState<'amount' | 'shares'>('amount');

  // Calculate shares when amount changes
  useEffect(() => {
    if (calculationMode === 'amount' && amount && !isNaN(parseFloat(amount)) && price) {
      const calculatedShares = parseFloat(amount) / parseFloat(price as string);
      setShares(calculatedShares.toFixed(4));
    }
  }, [amount, price, calculationMode]);

  // Calculate amount when shares changes
  useEffect(() => {
    if (calculationMode === 'shares' && shares && !isNaN(parseFloat(shares)) && price) {
      const calculatedAmount = parseFloat(shares) * parseFloat(price as string);
      setAmount(calculatedAmount.toFixed(2));
    }
  }, [shares, price, calculationMode]);

  const resetForm = () => {
    setAmount('');
    setShares('');
    setError('');
    if (accounts.length > 0) {
      setSelectedAccountId(accounts[0].id);
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const mapCategoryToType = (category: string): Investment['type'] => {
    const categoryMap: Record<string, Investment['type']> = {
      'stocks': 'stock',
      'etfs': 'etf',
      'crypto': 'crypto',
      'mutual_funds': 'mutualfunds',
      'ipos': 'ipos',
      'roundups': 'roundups'
    };
    
    return categoryMap[category] || 'stock';
  };

  const handlePurchase = () => {
    // Validate inputs
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }
    
    if (!selectedAccountId) {
      setError('Please select an account for this purchase');
      return;
    }
    
    const amountNum = parseFloat(amount);
    const sharesNum = parseFloat(shares);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Check if account has enough balance
    const selectedAccount = accounts.find(account => account.id === selectedAccountId);
    if (!selectedAccount) {
      setError('Selected account not found');
      return;
    }
    
    if (selectedAccount.balance < amountNum) {
      setError(`Insufficient funds in ${selectedAccount.name}. Available balance: ${formatCurrency(selectedAccount.balance)}`);
      return;
    }
    
    // Create new investment with more details
    const newInvestment: Investment = {
      id: Date.now().toString(),
      name: name as string,
      ticker: ticker as string,
      value: amountNum,
      initialValue: amountNum,
      growth: 0, // New investment starts with 0% growth
      type: mapCategoryToType(category as string),
      lastUpdated: new Date().toISOString(),
      shares: sharesNum,
      price: parseFloat(price as string),
      purchaseDate: new Date().toISOString(),
    };
    
    // Add investment to portfolio
    addInvestment(newInvestment);
    
    // Deduct amount from account and update balance in real-time
    updateAccount(selectedAccountId, {
      balance: selectedAccount.balance - amountNum
    });
    
    // Add a transaction record for this investment purchase
    addTransaction({
      amount: -amountNum, // Negative amount since it's money going out
      category: 'Investment',
      description: `Purchase of ${sharesNum} shares of ${name} (${ticker})`,
      date: new Date().toISOString(),
      type: 'expense',
      merchant: name as string // Using merchant field to store investment name
    });
    
    // Save the purchased investment for the success modal
    setPurchasedInvestment(newInvestment);
    
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    resetForm();
    router.push('/(tabs)/investments');
  };

  const handleInputModeChange = (mode: 'amount' | 'shares') => {
    setCalculationMode(mode);
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
        <Text style={styles.headerTitle}>Purchase Investment</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.investmentCard}>
          <View style={styles.investmentHeader}>
            <View style={styles.investmentIconContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={[styles.logoPlaceholderText, { color: '#000000' }]}>{(typeof name === 'string' ? name : Array.isArray(name) ? name[0] : '')?.charAt(0)?.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.investmentInfo}>
              <Text style={styles.investmentName}>{name}</Text>
              <Text style={styles.investmentTicker}>{ticker}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>{formatCurrency(parseFloat(price as string))}</Text>
              <Text style={styles.priceLabel}>Current Price</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Purchase Details</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.calculationToggle}>
            <TouchableOpacity
              style={[
                styles.calculationButton,
                calculationMode === 'amount' && styles.activeCalculationButton
              ]}
              onPress={() => handleInputModeChange('amount')}
            >
              <Text style={[
                styles.calculationButtonText,
                calculationMode === 'amount' && styles.activeCalculationButtonText
              ]}>By Amount</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.calculationButton,
                calculationMode === 'shares' && styles.activeCalculationButton
              ]}
              onPress={() => handleInputModeChange('shares')}
            >
              <Text style={[
                styles.calculationButtonText,
                calculationMode === 'shares' && styles.activeCalculationButtonText
              ]}>By Shares</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Investment Amount</Text>
            <View style={styles.amountInputContainer}>
              <DollarSign size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.dark.textSecondary}
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  if (calculationMode === 'amount') {
                    // Calculate shares based on amount
                    if (text && !isNaN(parseFloat(text)) && price) {
                      const calculatedShares = parseFloat(text) / parseFloat(price as string);
                      setShares(calculatedShares.toFixed(4));
                    } else {
                      setShares('');
                    }
                  }
                }}
                editable={calculationMode === 'amount'}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Number of Shares</Text>
            <View style={styles.amountInputContainer}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.0000"
                placeholderTextColor={colors.dark.textSecondary}
                keyboardType="numeric"
                value={shares}
                onChangeText={(text) => {
                  setShares(text);
                  if (calculationMode === 'shares') {
                    // Calculate amount based on shares
                    if (text && !isNaN(parseFloat(text)) && price) {
                      const calculatedAmount = parseFloat(text) * parseFloat(price as string);
                      setAmount(calculatedAmount.toFixed(2));
                    } else {
                      setAmount('');
                    }
                  }
                }}
                editable={calculationMode === 'shares'}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Account</Text>
            <View style={styles.accountSelectorContainer}>
              <Text style={styles.accountSelectorTitle}>Select Account</Text>
              <ScrollView horizontal={false} style={styles.accountList}>
                {accounts.map(account => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.accountButton,
                      selectedAccountId === account.id && styles.selectedAccountButton
                    ]}
                    onPress={() => setSelectedAccountId(account.id)}
                  >
                    <Text style={[
                      styles.accountButtonText,
                      selectedAccountId === account.id && { color: '#000000' }
                    ]}>{account.name}</Text>
                    <Text style={[
                      styles.accountBalance,
                      selectedAccountId === account.id && { color: '#000000' }
                    ]}>{formatCurrency(account.balance)}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Investment</Text>
              <Text style={styles.summaryValue}>{name} ({ticker})</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price per Share</Text>
              <Text style={styles.summaryValue}>{formatCurrency(parseFloat(price as string))}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shares</Text>
              <Text style={styles.summaryValue}>{shares || '0.0000'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Cost</Text>
              <Text style={styles.summaryTotal}>{formatCurrency(parseFloat(amount || '0'))}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.button, styles.buttonActive]}
          onPress={handlePurchase}
        >
          <Text style={styles.buttonText}>Complete Purchase</Text>
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
            <Text style={styles.successTitle}>Investment Purchased</Text>
            <Text style={styles.successText}>
              You have successfully purchased {purchasedInvestment?.shares} shares of {purchasedInvestment?.name} ({purchasedInvestment?.ticker}) for {formatCurrency(purchasedInvestment?.value || 0)}.
            </Text>
            <TouchableOpacity 
              style={[styles.button, styles.buttonActive]} 
              onPress={handleSuccessModalClose}
            >
              <Text style={styles.buttonText}>View My Investments</Text>
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
    backgroundColor: colors.dark.background, // black background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.dark.background, // black background
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
    color: '#FFFFFF', // white
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
  investmentCard: {
    backgroundColor: colors.dark.card, // dark card background
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  investmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary, // white background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // white
    marginBottom: 4,
  },
  investmentTicker: {
    fontSize: 14,
    color: '#FFFFFF', // white
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // white
  },
  priceLabel: {
    fontSize: 12,
    color: '#FFFFFF', // white
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: colors.dark.card, // dark card background
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF', // white
    marginBottom: 16,
  },
  errorText: {
    color: '#FF0000', // red
    marginBottom: 16,
  },
  calculationToggle: {
    flexDirection: 'row',
    backgroundColor: colors.border, // Changed from colors.dark.cardAlt to colors.border
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  calculationButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeCalculationButton: {
    backgroundColor: colors.primary, // neon green
  },
  calculationButtonText: {
    fontSize: 14,
    color: '#FFFFFF', // white
  },
  activeCalculationButtonText: {
    color: '#000000', // Changed text color to black for visibility on white background
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFFFFF', // white
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border, // Changed from colors.dark.cardAlt to colors.border
    borderRadius: 8,
    padding: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF', // white
  },
  accountSelectorContainer: {
    backgroundColor: colors.dark.background, // black background
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  accountSelectorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'left',
  },
  accountList: {
    width: '100%',
    maxHeight: 300,
  },
  accountButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.dark.card, // dark card background
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
  },
  selectedAccountButton: {
    backgroundColor: colors.primary, // white background when selected
  },
  accountButtonText: {
    fontSize: 16,
    color: '#FFFFFF', // white text for default state
  },
  selectedAccountButtonText: {
    color: '#000000', // black text for visibility on white background
    fontWeight: '600',
  },
  accountBalance: {
    fontSize: 16,
    color: '#FFFFFF', // white text for default state
  },
  selectedAccountBalance: {
    color: '#000000', // black text for visibility on white background
  },
  summaryContainer: {
    marginTop: 16,
    backgroundColor: colors.border, // Changed from colors.dark.cardAlt to colors.border
    borderRadius: 8,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#FFFFFF', // white
  },
  summaryValue: {
    fontSize: 14,
    color: '#FFFFFF', // white
    fontWeight: '500',
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary, // neon green
  },
  button: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonActive: {
    backgroundColor: colors.primary,
    opacity: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000', // Changed from white to black for better visibility
  },
  buttonDisabled: {
    opacity: 0.5,
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
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary, // White background for the placeholder circle
  },
  logoPlaceholderText: {
    color: '#000000', // Black text color for the placeholder letter
    fontWeight: 'bold',
    fontSize: 18,
  },
});
