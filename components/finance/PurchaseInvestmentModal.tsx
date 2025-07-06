import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Investment } from '@/types/finance';
import { useFinanceStore } from '@/store/finance-store';
import { DollarSign, X, TrendingUp, ArrowUpRight, Info } from 'lucide-react-native';

interface PurchaseInvestmentModalProps {
  visible: boolean;
  onClose: () => void;
  investmentOption: any; // Investment option from the marketplace
}

export const PurchaseInvestmentModal: React.FC<PurchaseInvestmentModalProps> = ({
  visible,
  onClose,
  investmentOption,
}) => {
  const { addInvestment, accounts, updateAccount } = useFinanceStore();
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(accounts.length > 0 ? accounts[0].id : null);
  const [error, setError] = useState('');

  const resetForm = () => {
    setAmount('');
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

  const handlePurchase = () => {
    // Validate inputs
    if (!amount.trim()) {
      setError('Please enter an investment amount');
      return;
    }
    
    if (!selectedAccountId) {
      setError('Please select an account for this purchase');
      return;
    }
    
    const amountNum = parseFloat(amount);
    
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
    
    // Calculate number of shares/units based on current price
    const units = amountNum / investmentOption.price;
    const sharesCount = parseFloat(units.toFixed(4));
    
    // Create new investment with more details
    const newInvestment: Omit<Investment, 'id' | 'lastUpdated'> = {
      name: investmentOption.name,
      ticker: investmentOption.ticker,
      value: amountNum,
      initialValue: amountNum,
      growth: 0, // New investment starts with 0% growth
      type: mapCategoryToType(investmentOption.category),
      shares: sharesCount,
      price: investmentOption.price,
      purchaseDate: new Date().toISOString(),
    };
    
    // Add investment to portfolio
    addInvestment(newInvestment);
    
    // Deduct amount from account and update balance in real-time
    updateAccount(selectedAccountId, {
      balance: selectedAccount.balance - amountNum
    });
    
    // Add a transaction record for this investment purchase
    const { addTransaction } = useFinanceStore.getState();
    addTransaction({
      amount: -amountNum, // Negative amount since it's money going out
      description: `Purchased ${sharesCount} shares of ${investmentOption.ticker}`,
      date: new Date().toISOString(),
      category: 'investment',
      type: 'expense',
      merchant: 'Investment Broker',
    });
    
    // Show success message
    Alert.alert(
      "Investment Purchased",
      `Successfully purchased ${sharesCount} shares of ${investmentOption.ticker} (${investmentOption.name}) for ${formatCurrency(amountNum)}`,
      [{ text: "OK", onPress: () => {
        resetForm();
        onClose();
      }}]
    );
  };
  
  // Map category to investment type
  const mapCategoryToType = (category: string): 'stock' | 'etf' | 'crypto' | 'mutualfunds' | 'ipos' | 'roundups' => {
    switch(category) {
      case 'stocks': return 'stock';
      case 'etfs': return 'etf';
      case 'crypto': return 'crypto';
      case 'mutual_funds': return 'mutualfunds';
      case 'ipos': return 'ipos';
      default: return 'stock';
    }
  };

  if (!investmentOption) return null;

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
            <Text style={styles.modalTitle}>Purchase Investment</Text>
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
            
            <View style={styles.investmentInfo}>
              <View style={styles.investmentHeader}>
                <Text style={styles.investmentName}>{investmentOption.name}</Text>
                <Text style={styles.investmentTicker}>{investmentOption.ticker}</Text>
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Current Price</Text>
                <Text style={styles.priceValue}>{formatCurrency(investmentOption.price)}</Text>
                
                <View style={[
                  styles.changeContainer,
                  investmentOption.changePercent >= 0 ? styles.positiveChange : styles.negativeChange
                ]}>
                  <ArrowUpRight size={16} color={investmentOption.changePercent >= 0 ? colors.positive : colors.accent} />
                  <Text style={[
                    styles.changeText,
                    investmentOption.changePercent >= 0 ? styles.positiveChangeText : styles.negativeChangeText
                  ]}>
                    {investmentOption.changePercent >= 0 ? '+' : ''}{investmentOption.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Account</Text>
              <View style={styles.accountsContainer}>
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
                      selectedAccountId === account.id && styles.selectedAccountButtonText
                    ]}>
                      {account.name}
                    </Text>
                    <Text style={styles.accountBalance}>
                      {formatCurrency(account.balance)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Investment Amount</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color={colors.dark.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor={colors.dark.textSecondary}
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>
            </View>
            
            {amount ? (
              <View style={styles.estimateContainer}>
                <Text style={styles.estimateLabel}>Estimated Units</Text>
                <Text style={styles.estimateValue}>
                  {(parseFloat(amount) / investmentOption.price).toFixed(4)}
                </Text>
              </View>
            ) : null}
            
            <TouchableOpacity
              style={styles.purchaseButton}
              onPress={handlePurchase}
            >
              <TrendingUp size={20} color={colors.dark.text} style={styles.purchaseButtonIcon} />
              <Text style={styles.purchaseButtonText}>Purchase Investment</Text>
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
  investmentInfo: {
    marginBottom: 20,
  },
  investmentHeader: {
    marginBottom: 12,
  },
  investmentName: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  investmentTicker: {
    color: colors.dark.textSecondary,
    fontSize: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  priceLabel: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    marginRight: 8,
  },
  priceValue: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 12,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveChange: {
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
  negativeChange: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
  },
  changeText: {
    fontSize: 14,
    marginLeft: 4,
  },
  positiveChangeText: {
    color: colors.positive,
  },
  negativeChangeText: {
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: colors.dark.text,
    fontSize: 16,
    marginBottom: 8,
  },
  accountsContainer: {
    marginBottom: 16,
  },
  accountButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedAccountButton: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  accountButtonText: {
    color: colors.dark.text,
    fontSize: 16,
  },
  selectedAccountButtonText: {
    fontWeight: 'bold',
  },
  accountBalance: {
    color: colors.dark.textSecondary,
    fontSize: 14,
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
  estimateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  estimateLabel: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  estimateValue: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
  purchaseButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
  purchaseButtonIcon: {
    marginRight: 8,
  },
  purchaseButtonText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
