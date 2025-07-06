import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Building2, CreditCard, Wallet, Plus, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, Layout } from 'react-native-reanimated';
import { useFinanceStore } from '@/store/finance-store';

export default function AddMoneyScreen() {
  const router = useRouter();
  const { accounts, addTransaction, updateAccount } = useFinanceStore();
  
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'card' | 'wallet' | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const handleAmountChange = (text: string) => {
    // Only allow numbers and decimal point
    const filtered = text.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = filtered.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Limit to 2 decimal places
    if (parts.length > 1 && parts[1].length > 2) {
      return;
    }
    
    setAmount(filtered);
  };
  
  const handleContinue = () => {
    if (step === 1 && parseFloat(amount) > 0) {
      setStep(2);
    } else if (step === 2 && selectedMethod) {
      setStep(3);
    } else if (step === 3 && selectedAccount) {
      // Get the amount value
      const amountValue = parseFloat(amount);
      
      // Get the selected account
      const selectedAccountObj = accounts.find(acc => acc.id === selectedAccount);
      
      if (selectedAccountObj) {
        // Process the transaction
        addTransaction({
          amount: amountValue, // Positive amount for money added
          description: `Added money via ${selectedMethod}`,
          category: 'deposit',
          date: new Date().toISOString(),
          type: 'income',
          merchant: selectedMethod === 'bank' ? 'Bank Transfer' : selectedMethod === 'card' ? 'Card Deposit' : 'Cash Deposit',
        });
        
        // Update account balance in real-time
        updateAccount(selectedAccount, {
          balance: selectedAccountObj.balance + amountValue
        });
        
        // Show success message
        Alert.alert(
          "Money Added",
          `Successfully added ${formatCurrency(amount)} to your ${selectedAccountObj.name} account.`,
          [{ text: "OK", onPress: () => {
            // Navigate back to dashboard
            router.push('/(tabs)');
          }}]
        );
      }
    }
  };
  
  const isContinueDisabled = 
    (step === 1 && (!amount || parseFloat(amount) <= 0)) ||
    (step === 2 && !selectedMethod) ||
    (step === 3 && !selectedAccount);
  
  const formatCurrency = (value: string) => {
    if (!value) return '$0.00';
    return `$${parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen 
        options={{
          title: 'Add Money',
          headerStyle: {
            backgroundColor: colors.dark.background,
          },
          headerTintColor: colors.dark.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.dark.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step indicator */}
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step >= 1 && styles.activeStepDot]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 2 && styles.activeStepDot]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 3 && styles.activeStepDot]} />
        </View>
        
        {/* Step 1: Enter Amount */}
        {step === 1 && (
          <Animated.View 
            entering={FadeInDown.duration(300)} 
            exiting={FadeOutDown.duration(200)}
            layout={Layout.springify()}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Enter Amount</Text>
            <Text style={styles.stepDescription}>How much would you like to add?</Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={colors.dark.textSecondary}
                autoFocus
              />
            </View>
            
            <View style={styles.quickAmountContainer}>
              {[10, 50, 100, 500].map((quickAmount) => (
                <TouchableOpacity
                  key={quickAmount}
                  style={styles.quickAmountButton}
                  onPress={() => setAmount(quickAmount.toString())}
                >
                  <Text style={styles.quickAmountText}>${quickAmount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
        
        {/* Step 2: Select Payment Method */}
        {step === 2 && (
          <Animated.View 
            entering={FadeInDown.duration(300)} 
            exiting={FadeOutDown.duration(200)}
            layout={Layout.springify()}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Select Payment Method</Text>
            <Text style={styles.stepDescription}>How would you like to add {formatCurrency(amount)}?</Text>
            
            <View style={styles.methodsContainer}>
              <TouchableOpacity
                style={[styles.methodCard, selectedMethod === 'bank' && styles.selectedMethodCard]}
                onPress={() => setSelectedMethod('bank')}
              >
                <View style={[styles.methodIconContainer, { backgroundColor: colors.categories.housing }]}>
                  <Building2 size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.methodTitle}>Bank Transfer</Text>
                <Text style={styles.methodDescription}>2-3 business days</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.methodCard, selectedMethod === 'card' && styles.selectedMethodCard]}
                onPress={() => setSelectedMethod('card')}
              >
                <View style={[styles.methodIconContainer, { backgroundColor: colors.categories.shopping }]}>
                  <CreditCard size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.methodTitle}>Debit Card</Text>
                <Text style={styles.methodDescription}>Instant</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.methodCard, selectedMethod === 'wallet' && styles.selectedMethodCard]}
                onPress={() => setSelectedMethod('wallet')}
              >
                <View style={[styles.methodIconContainer, { backgroundColor: colors.categories.entertainment }]}>
                  <Wallet size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.methodTitle}>Digital Wallet</Text>
                <Text style={styles.methodDescription}>Instant</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
        
        {/* Step 3: Select Account */}
        {step === 3 && (
          <Animated.View 
            entering={FadeInDown.duration(300)} 
            exiting={FadeOutDown.duration(200)}
            layout={Layout.springify()}
            style={styles.stepContainer}
          >
            <Text style={styles.stepTitle}>Select Account</Text>
            <Text style={styles.stepDescription}>Where would you like to add {formatCurrency(amount)}?</Text>
            
            <View style={styles.accountsContainer}>
              {accounts.map(account => (
                <TouchableOpacity
                  key={account.id}
                  style={[styles.accountCard, selectedAccount === account.id && styles.selectedAccountCard]}
                  onPress={() => setSelectedAccount(account.id)}
                >
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.name}</Text>
                    <Text style={styles.accountBalance}>{formatCurrency(account.balance.toString())}</Text>
                  </View>
                  <View style={[styles.accountIconContainer, { backgroundColor: account.color || colors.primary }]}>
                    <Text style={styles.accountInitial}>{account.name.charAt(0)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
      
      <Animated.View 
        entering={FadeInUp.duration(300)}
        style={styles.bottomContainer}
      >
        <TouchableOpacity
          style={[styles.continueButton, isContinueDisabled && styles.disabledButton]}
          onPress={handleContinue}
          disabled={isContinueDisabled}
        >
          <Text style={styles.continueButtonText}>
            {step === 3 ? 'Add Money' : 'Continue'}
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.dark.border,
  },
  activeStepDot: {
    backgroundColor: colors.primary,
  },
  stepLine: {
    height: 2,
    width: 50,
    backgroundColor: colors.dark.border,
    marginHorizontal: 5,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    marginBottom: 30,
    textAlign: 'center',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginRight: 5,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.dark.text,
    minWidth: 150,
    textAlign: 'center',
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  quickAmountButton: {
    backgroundColor: colors.dark.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    margin: 5,
  },
  quickAmountText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  methodsContainer: {
    width: '100%',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMethodCard: {
    borderColor: colors.primary,
  },
  methodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  accountsContainer: {
    width: '100%',
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAccountCard: {
    borderColor: colors.primary,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.dark.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: colors.dark.border,
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
