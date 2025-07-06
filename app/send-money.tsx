import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { ArrowLeft, Search, User, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, Layout, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useFinanceStore } from '@/store/finance-store';

// Mock contacts data
const mockContacts = [
  { id: '1', name: 'Heya Smith', avatar: require('@/assets/users/mock1.png'), recent: true },
  { id: '2', name: 'Michal Johnson', avatar: require('@/assets/users/mock2.png'), recent: true },
  { id: '3', name: 'Iliya Brown', avatar: require('@/assets/users/mock2.png'), recent: true },
  { id: '4', name: 'Maria Garcia', avatar: null, recent: false },
  { id: '5', name: 'Alex Rodriguez', avatar: null, recent: false },
  { id: '6', name: 'Sarah Wilson', avatar: null, recent: false },
  { id: '7', name: 'James Taylor', avatar: null, recent: false },
  { id: '8', name: 'Emma Martinez', avatar: null, recent: false },
];

export default function SendMoneyScreen() {
  const router = useRouter();
  const { accounts, addTransaction, updateAccount } = useFinanceStore();
  
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Animation values
  const successScale = useSharedValue(0);
  
  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
    if (step === 1 && selectedContact) {
      setStep(2);
    } else if (step === 2 && parseFloat(amount) > 0) {
      setStep(3);
    } else if (step === 3 && selectedAccount) {
      // Process the transaction
      const selectedAccountObj = accounts.find(acc => acc.id === selectedAccount);
      const amountValue = parseFloat(amount);
      
      if (selectedAccountObj && selectedAccountObj.balance >= amountValue) {
        const recipientName = mockContacts.find(c => c.id === selectedContact)?.name || 'Contact';
        
        // Add transaction with negative amount (money going out)
        addTransaction({
          amount: -amountValue, // Negative amount for money sent
          description: `Sent money to ${recipientName}`,
          date: new Date().toISOString(),
          category: 'transfer',
          type: 'expense',
          merchant: recipientName,
        });
        
        // Update account balance in real-time
        updateAccount(selectedAccount, {
          balance: selectedAccountObj.balance - amountValue
        });
        
        // Show success animation
        setShowSuccess(true);
      } else {
        // Show insufficient funds error
        Alert.alert(
          "Insufficient Funds",
          `You don't have enough balance in this account to complete this transaction.`,
          [{ text: "OK" }]
        );
      }
      
      // Animate success icon
      successScale.value = withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(1, { duration: 200 })
      );
      
      // Navigate back to dashboard after delay
      setTimeout(() => {
        router.push('/(tabs)');
      }, 2000);
    }
  };
  
  const isContinueDisabled = 
    (step === 1 && !selectedContact) ||
    (step === 2 && (!amount || parseFloat(amount) <= 0)) ||
    (step === 3 && !selectedAccount);
  
  const formatCurrency = (value: string) => {
    if (!value) return '$0.00';
    return `$${parseFloat(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  
  const successAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: successScale.value }],
    };
  });
  
  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <Stack.Screen 
        options={{
          title: 'Send Money',
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
      
      {showSuccess ? (
        <View style={styles.successContainer}>
          <Animated.View style={[styles.successIconContainer, successAnimatedStyle]}>
            <CheckCircle2 size={80} color={colors.positive} />
          </Animated.View>
          <Text style={styles.successTitle}>Money Sent!</Text>
          <Text style={styles.successDescription}>
            {formatCurrency(amount)} has been sent successfully
          </Text>
        </View>
      ) : (
        <>
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
            
            {/* Step 1: Select Contact */}
            {step === 1 && (
              <Animated.View 
                entering={FadeInDown.duration(300)} 
                exiting={FadeOutDown.duration(200)}
                layout={Layout.springify()}
                style={styles.stepContainer}
              >
                <Text style={styles.stepTitle}>Send To</Text>
                <Text style={styles.stepDescription}>Select a contact to send money to</Text>
                
                <View style={styles.searchContainer}>
                  <Search size={20} color={colors.dark.textSecondary} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search contacts"
                    placeholderTextColor={colors.dark.textSecondary}
                  />
                </View>
                
                {searchQuery === '' && (
                  <View style={styles.recentContactsContainer}>
                    <Text style={styles.recentContactsTitle}>Recent</Text>
                    <View style={styles.recentContactsList}>
                      {mockContacts.filter(c => c.recent).map(contact => (
                        <TouchableOpacity
                          key={contact.id}
                          style={[
                            styles.recentContactItem,
                            selectedContact === contact.id && styles.selectedRecentContact
                          ]}
                          onPress={() => setSelectedContact(contact.id)}
                        >
                          <View style={styles.contactAvatarContainer}>
                            {contact.avatar ? (
                              <Image source={contact.avatar} style={styles.contactAvatar} />
                            ) : (
                              <View style={styles.contactAvatarPlaceholder}>
                                <Text style={styles.contactAvatarText}>{contact.name.charAt(0)}</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.recentContactName}>{contact.name.split(' ')[0]}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
                
                <View style={styles.contactsContainer}>
                  <Text style={styles.contactsTitle}>All Contacts</Text>
                  {filteredContacts.map(contact => (
                    <TouchableOpacity
                      key={contact.id}
                      style={[
                        styles.contactItem,
                        selectedContact === contact.id && styles.selectedContactItem
                      ]}
                      onPress={() => setSelectedContact(contact.id)}
                    >
                      <View style={styles.contactItemLeft}>
                        {contact.avatar ? (
                          <Image source={contact.avatar} style={styles.contactItemAvatar} />
                        ) : (
                          <View style={styles.contactItemAvatarPlaceholder}>
                            <User size={20} color="#FFFFFF" />
                          </View>
                        )}
                        <Text style={styles.contactItemName}>{contact.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            )}
            
            {/* Step 2: Enter Amount */}
            {step === 2 && (
              <Animated.View 
                entering={FadeInDown.duration(300)} 
                exiting={FadeOutDown.duration(200)}
                layout={Layout.springify()}
                style={styles.stepContainer}
              >
                <Text style={styles.stepTitle}>Enter Amount</Text>
                <Text style={styles.stepDescription}>
                  How much would you like to send to {mockContacts.find(c => c.id === selectedContact)?.name.split(' ')[0]}?
                </Text>
                
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
                
                <View style={styles.noteContainer}>
                  <Text style={styles.noteLabel}>Add a note (optional)</Text>
                  <TextInput
                    style={styles.noteInput}
                    value={note}
                    onChangeText={setNote}
                    placeholder="What's this for?"
                    placeholderTextColor={colors.dark.textSecondary}
                    multiline
                  />
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
                <Text style={styles.stepDescription}>Choose the account to send {formatCurrency(amount)} from</Text>
                
                <View style={styles.accountsContainer}>
                  {accounts.map(account => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.accountCard,
                        selectedAccount === account.id && styles.selectedAccountCard,
                        account.balance < parseFloat(amount) && styles.insufficientFundsCard
                      ]}
                      onPress={() => account.balance >= parseFloat(amount) && setSelectedAccount(account.id)}
                      disabled={account.balance < parseFloat(amount)}
                    >
                      <View style={styles.accountInfo}>
                        <Text style={styles.accountName}>{account.name}</Text>
                        <Text style={styles.accountBalance}>{formatCurrency(account.balance.toString())}</Text>
                        {account.balance < parseFloat(amount) && (
                          <Text style={styles.insufficientFundsText}>Insufficient funds</Text>
                        )}
                      </View>
                      <View 
                        style={[
                          styles.accountIconContainer, 
                          { backgroundColor: account.color || colors.primary }
                        ]}
                      >
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
                {step === 3 ? 'Send Money' : 'Continue'}
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    width: '100%',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: colors.dark.text,
    fontSize: 16,
  },
  recentContactsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  recentContactsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  recentContactsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentContactItem: {
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 16,
  },
  selectedRecentContact: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.dark.card,
  },
  contactAvatarContainer: {
    marginBottom: 8,
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  contactAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactAvatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  recentContactName: {
    color: colors.dark.text,
    fontSize: 14,
    fontWeight: '500',
  },
  contactsContainer: {
    width: '100%',
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark.text,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedContactItem: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.dark.card,
  },
  contactItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactItemAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  contactItemAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactItemName: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
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
    marginBottom: 30,
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
  noteContainer: {
    width: '100%',
    marginTop: 10,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  noteInput: {
    backgroundColor: colors.dark.card,
    borderRadius: 12,
    padding: 16,
    color: colors.dark.text,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
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
    overflow: 'hidden',
  },
  selectedAccountCard: {
    borderColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  insufficientFundsCard: {
    opacity: 0.5,
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
  insufficientFundsText: {
    fontSize: 12,
    color: colors.accent,
    marginTop: 4,
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
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
    backgroundColor: colors.dark.card,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 16,
    color: colors.dark.textSecondary,
    textAlign: 'center',
  },
});
