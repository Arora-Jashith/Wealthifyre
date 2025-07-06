import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, Modal, TextInput } from 'react-native';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { ActionButton } from '@/components/ui/ActionButton';
import { AccountCard } from '@/components/finance/AccountCard';
import { TransactionItemNew } from '@/components/finance/TransactionItemNew';
import { ContactCard } from '@/components/finance/ContactCard';
import { LineChart } from '@/components/finance/LineChart';
import { InsightCard } from '@/components/finance/InsightCard';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { colors } from '@/constants/colors';
import { useFinanceStore } from '@/store/finance-store';
import { mockUserProfile } from '@/mocks/user';
import { getRecentTransactions } from '@/mocks/transactions';
import { getRecentInsights } from '@/mocks/insights';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { 
  User, 
  Bell, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  Settings,
  ChevronRight,
  Send,
  Wallet,
  MoreHorizontal,
  CreditCard,
  ArrowRight,
  BarChart2
} from 'lucide-react-native';
import { AddTransactionButton } from '@/components/finance/AddTransactionButton';
import { ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen() {
  const router = useRouter();
  const { 
    accounts, 
    transactions, 
    forecast,
    insights,
    selectedAccountId,
    setSelectedAccountId,
    markInsightAsRead,
    addTransaction
  } = useFinanceStore();
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState(new Date());
  const [showBalances, setShowBalances] = useState(false);
  const [passcodeModalVisible, setPasscodeModalVisible] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  
  // Get recent data
  const recentTransactions = getRecentTransactions(5);
  const recentInsights = getRecentInsights(5);
  
  // Calculate totals and update state when data changes
  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, [accounts, transactions, forecast]);
  
  const totalBalance = accounts
    .filter(account => account.type !== 'credit')
    .reduce((sum, account) => sum + account.balance, 0);
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  // Chart data based on selected time range
  const getChartData = () => {
    switch(timeRange) {
      case 'week':
        return forecast.slice(0, 7).map(item => ({
          value: item.balance,
          label: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 3)
        }));
      case 'year':
        return forecast.slice(0, 12).map(item => ({
          value: item.balance,
          label: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }).substring(0, 3)
        }));
      case 'month':
      default:
        return forecast.slice(0, 30).map((item, index) => ({
          value: item.balance,
          label: (index % 5 === 0) ? new Date(item.date).getDate().toString() : ''
        }));
    }
  };
  
  const chartData = getChartData();
  
  // Contacts for quick send
  const contacts = [
    { id: '1', name: 'Heya', avatar: require('@/assets/users/mock1.png') },
    { id: '2', name: 'Michel', avatar: require('@/assets/users/mock2.png') },
    { id: '3', name: 'Keya', avatar: require('@/assets/users/mock1.png') },
    { id: '4', name: 'Maria', avatar: require('@/assets/users/mock2.png') },
  ];
  
  const handleAccountPress = (accountId: string) => {
    setSelectedAccountId(accountId);
  };
  
  const handleInsightPress = (insightId: string) => {
    markInsightAsRead(insightId);
  };
  
  const handleProfilePress = () => {
    router.push('/profile');
  };
  
  const handleSettingsPress = () => {
    router.push('/settings');
  };
  
  const handleSendMoney = () => {
    // Navigate to send money screen
    router.push({
      pathname: '../send-money'
    });
  };
  
  const handleAddMoney = () => {
    // Navigate to add money screen
    router.push({
      pathname: '../add-money'
    });
  };
  
  const handleRequestMoney = () => {
    // Navigate to transactions screen with request filter
    router.push({
      pathname: '/(tabs)/transactions',
      params: { type: 'request' }
    });
  };
  
  const handleWallet = () => {
    // Navigate to transactions screen
    router.push({
      pathname: '/(tabs)/transactions'
    });
  };
  
  const handleMore = () => {
    // Navigate to settings
    router.push({
      pathname: '/settings'
    });
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Get total balance from all accounts
  const getTotalBalance = () => {
    // Using a more realistic balance instead of $1852.00
    return 3275.50; // This is a fixed value that matches the app's design
  };
  
  // Get current expiry date in MM/YY format
  const getCurrentExpiryDate = () => {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 1;
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };
  
  // Generate a consistent color based on contact ID
  const getRandomColor = (id: string) => {
    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#FFD166', // Yellow
      '#6A0572', // Purple
      '#1A936F', // Green
      '#3D5A80', // Navy
      '#E76F51', // Orange
      '#8338EC'  // Violet
    ];
    
    // Use the ID to get a consistent index
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };
  
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <Animated.View entering={FadeInDown.duration(300)} style={styles.welcomeHeader}>
        <View style={styles.userProfileSection}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.userProfileImage} 
          />
          <View style={styles.welcomeContent}>
            <Text style={styles.helloText}>Hello James,</Text>
            <Text style={styles.welcomeBackText}>Welcome back</Text>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => {}} style={styles.notificationButton}>
          <Bell size={20} color={colors.dark.text} />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Card with balance */}
      <Animated.View entering={FadeInDown.delay(100).duration(300)}>
        <Card style={styles.balanceCard}>
          <View style={styles.balanceCardContent}>
            <View style={styles.balanceCardHeader}>
              <Text style={styles.visaText}>VISA</Text>
              <Image 
                source={require('@/assets/images/icon.png')} 
                style={styles.chipImage} 
              />
            </View>
            
            <Text style={styles.availableBalanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(getTotalBalance())}</Text>
            
            <View style={styles.expirySection}>
              <Text style={styles.expiryLabel}>EX {getCurrentExpiryDate()}</Text>
            </View>
          </View>
        </Card>
      </Animated.View>
      
      {/* Bottom Navigation */}
      <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleSendMoney}>
          <View style={[styles.navIcon, { backgroundColor: '#3B1F51' }]}>
            <Send size={20} color="#B87FFF" />
          </View>
          <Text style={styles.navText}>Send</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={handleRequestMoney}>
          <View style={[styles.navIcon, { backgroundColor: '#0F3323' }]}>
            <ArrowDownRight size={20} color={colors.primary} />
          </View>
          <Text style={styles.navText}>Request</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={handleWallet}>
          <View style={[styles.navIcon, { backgroundColor: '#0A2A4A' }]}>
            <Wallet size={20} color="#8ECAFF" />
          </View>
          <Text style={styles.navText}>E-Wallet</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={() => router.push('/features/analytics')}>
          <View style={[styles.navIcon, { backgroundColor: '#2E1F51' }]}>
            <BarChart2 size={20} color="#B87FFF" />
          </View>
          <Text style={styles.navText}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navButton} onPress={handleMore}>
          <View style={[styles.navIcon, { backgroundColor: '#3D2E10' }]}>
            <MoreHorizontal size={20} color="#FFBE45" />
          </View>
          <Text style={styles.navText}>More</Text>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Sent to section */}
      <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.sentToSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sent to</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={handleSendMoney}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactsRow}>
          {contacts.map(contact => (
            <TouchableOpacity key={contact.id} style={styles.contactItem} onPress={() => handleSendMoney()}>
              <View style={styles.contactAvatar}>
                <Image source={contact.avatar} style={styles.contactImage} />
              </View>
              <Text style={styles.contactName}>{contact.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
      
      {/* Accounts Section */}
      <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.accountsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color={colors.dark.text} />
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountsSlider}>
          {/* Checking Account Card */}
          <TouchableOpacity 
            style={[styles.accountCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            <View style={styles.accountCardHeader}>
              <View style={styles.accountIconContainer}>
                <CreditCard size={20} color="#000000" />
              </View>
              <Text style={styles.accountTypeLabel}>CHECKING</Text>
            </View>
            <Text style={styles.accountName}>Primary Checking</Text>
            <View style={styles.accountBalanceRow}>
              <Text style={styles.accountBalanceLabel}>Balance</Text>
              {showBalances ? (
                <Text style={styles.accountCardBalance}>$2,795.67</Text>
              ) : (
                <TouchableOpacity onPress={() => setPasscodeModalVisible(true)}>
                  <Text style={styles.hiddenBalance}>••••••</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>

          {/* Savings Account Card */}
          <TouchableOpacity 
            style={[styles.accountCard, { backgroundColor: '#4D9FFF' }]}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            <View style={styles.accountCardHeader}>
              <View style={styles.accountIconContainer}>
                <Wallet size={20} color="#000000" />
              </View>
              <Text style={styles.accountTypeLabel}>SAVINGS</Text>
            </View>
            <Text style={styles.accountName}>High-Yield Savings</Text>
            <View style={styles.accountBalanceRow}>
              <Text style={styles.accountBalanceLabel}>Balance</Text>
              {showBalances ? (
                <Text style={styles.accountCardBalance}>$12,500.00</Text>
              ) : (
                <TouchableOpacity onPress={() => setPasscodeModalVisible(true)}>
                  <Text style={styles.hiddenBalance}>••••••</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>

          {/* Investment Account Card */}
          <TouchableOpacity 
            style={[styles.accountCard, { backgroundColor: '#B66DFF' }]}
            onPress={() => router.push('/features/investment-options')}
          >
            <View style={styles.accountCardHeader}>
              <View style={styles.accountIconContainer}>
                <BarChart2 size={20} color="#000000" />
              </View>
              <Text style={styles.accountTypeLabel}>INVESTMENT</Text>
            </View>
            <Text style={styles.accountName}>Investment Portfolio</Text>
            <View style={styles.accountBalanceRow}>
              <Text style={styles.accountBalanceLabel}>Balance</Text>
              {showBalances ? (
                <Text style={styles.accountCardBalance}>$44,856.72</Text>
              ) : (
                <TouchableOpacity onPress={() => setPasscodeModalVisible(true)}>
                  <Text style={styles.hiddenBalance}>••••••</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>

          {/* Credit Card */}
          <TouchableOpacity 
            style={[styles.accountCard, { backgroundColor: '#FF9500' }]}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            <View style={styles.accountCardHeader}>
              <View style={styles.accountIconContainer}>
                <CreditCard size={20} color="#000000" />
              </View>
              <Text style={styles.accountTypeLabel}>CREDIT</Text>
            </View>
            <Text style={styles.accountName}>Credit Card</Text>
            <View style={styles.accountBalanceRow}>
              <Text style={styles.accountBalanceLabel}>Balance</Text>
              {showBalances ? (
                <Text style={[styles.accountCardBalance, { color: '#FF3B30' }]}>-$2,340.15</Text>
              ) : (
                <TouchableOpacity onPress={() => setPasscodeModalVisible(true)}>
                  <Text style={styles.hiddenBalance}>••••••</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Analytics Button */}
      <Animated.View entering={FadeInDown.delay(400).duration(300)} style={styles.analyticsButtonContainer}>
        <TouchableOpacity 
          style={styles.analyticsButton}
          onPress={() => router.push('/features/analytics')}
        >
          <BarChart2 size={20} color={colors.primary} />
          <Text style={styles.analyticsButtonText}>View Financial Analytics</Text>
          <View style={styles.analyticsButtonArrow}>
            <ChevronRight size={20} color={colors.dark.text} />
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Recent Transactions Section */}
      <Animated.View entering={FadeInDown.delay(500).duration(300)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/transactions')}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ChevronRight size={16} color={colors.dark.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.transactionsContainerAlt}>
          {recentTransactions.slice(0, 4).map((transaction, index) => (
            <TransactionItemNew 
              key={transaction.id} 
              transaction={transaction} 
            />
          ))}
          {/* Add transaction button would go here */}
        </View>
        
        {/* Income History Button */}
        <TouchableOpacity 
          style={styles.incomeHistoryButton}
          onPress={() => router.push({
            pathname: '/(tabs)/transactions',
            params: { type: 'income' }
          })}
        >
          <Text style={styles.incomeHistoryText}>View Income History</Text>
          <ChevronRight size={20} color={colors.dark.text} />
        </TouchableOpacity>
        


        <Modal
          visible={passcodeModalVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.passcodeModal}>
              <Text style={styles.passcodeTitle}>Enter Passcode</Text>
              <Text style={styles.passcodeDescription}>Enter your passcode to view account balances</Text>
              
              {passcodeError ? <Text style={styles.passcodeError}>{passcodeError}</Text> : null}
              
              <TextInput
                style={styles.passcodeInput}
                placeholder="Enter passcode"
                placeholderTextColor="#999"
                secureTextEntry
                keyboardType="numeric"
                maxLength={4}
                value={passcode}
                onChangeText={setPasscode}
              />
              
              <View style={styles.passcodeButtons}>
                <TouchableOpacity 
                  style={styles.passcodeButton}
                  onPress={() => {
                    setPasscodeModalVisible(false);
                    setPasscode('');
                  }}
                >
                  <Text style={styles.passcodeButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.passcodeButton, styles.passcodeConfirmButton]}
                  onPress={() => {
                    if (passcode === '1234') { // Example passcode
                      setShowBalances(true);
                      setPasscodeModalVisible(false);
                      setPasscode('');
                      setPasscodeError('');
                    } else {
                      setPasscodeError('Invalid passcode');
                    }
                  }}
                >
                  <Text style={styles.passcodeConfirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
  },
  // New styles for updated design
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  helloText: {
    color: colors.dark.textSecondary,
    fontSize: 16,
  },
  welcomeBackText: {
    color: colors.dark.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  balanceCardContent: {
    padding: 20,
  },
  balanceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  visaText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 1,
  },
  chipImage: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  availableBalanceLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  expirySection: {
    alignItems: 'flex-end',
  },
  expiryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  sentToSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  contactsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightsContainer: {
    paddingBottom: 8,
  },
  analyticsButtonContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  accountsSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  accountsSlider: {
    marginBottom: 16,
  },
  accountCard: {
    width: 180,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  accountTypeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  accountBalanceRow: {
    marginTop: 'auto',
  },
  accountBalanceLabel: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: 4,
  },
  accountCardBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  hiddenBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  navText: {
    fontSize: 14,
    color: colors.dark.text,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passcodeModal: {
    width: '80%',
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  passcodeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 8,
  },
  passcodeDescription: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  passcodeError: {
    fontSize: 14,
    color: '#FF3B30',
    marginBottom: 16,
  },
  passcodeInput: {
    width: '100%',
    height: 50,
    backgroundColor: colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.dark.text,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 8,
  },
  passcodeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  passcodeButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    backgroundColor: colors.dark.card,
  },
  passcodeButtonText: {
    fontSize: 16,
    color: colors.dark.text,
  },
  passcodeConfirmButton: {
    backgroundColor: colors.primary,
  },
  passcodeConfirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  analyticsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsButtonText: {
    flex: 1,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  analyticsButtonArrow: {
    marginLeft: 8,
  },
  transactionsContainerAlt: {
    marginBottom: 16,
    backgroundColor: colors.dark.card,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  incomeHistoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  incomeHistoryText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeText: {
    color: colors.dark.text,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  welcomeSubtext: {
    color: colors.dark.textSecondary,
    fontSize: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: colors.dark.card,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitialLarge: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dashboardCardContainer: {
    marginBottom: 24,
    overflow: 'hidden',
  },
  dashboardCardGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  dashboardCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  dashboardSentToSection: {
    marginBottom: 24,
  },
  cardContent: {
    padding: 20,
    height: 200,
  },
  contactlessIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactlessWave: {
    width: 6,
    height: 12,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255, 255, 255, 0.7)',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 2,
  },
  cardBrand: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '500',
    marginTop: 60,
    marginBottom: 20,
  },
  cardNumber: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 30,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  cardFooterLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  cardFooterValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  chipContainer: {
    width: 40,
    height: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    padding: 5,
  },
  chipGrid: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chipLineAlt: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 2,
  },
  
  // Quick actions
  quickActionsAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.dark.text,
    fontFamily: 'System',
  },
  
  // Contacts section
  sentToSectionAlt: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactItem: {
    alignItems: 'center',
    width: '22%',
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  contactImage: {
    width: 50,
    height: 50,
  },
  contactInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contactName: {
    fontSize: 14,
    color: colors.dark.text,
    textAlign: 'center',
    fontFamily: 'System',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.dark.card,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: colors.dark.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 4,
  },
  welcomeBack: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  notificationButtonAlt: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  
  // Card with balance
  cardContainer: {
    marginBottom: 24,
    padding: 0,
    height: 180,
    overflow: 'hidden',
  },
  balanceLabel: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 8,
  },
  balanceAmountAlt: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  mainCardFooter: {
    marginTop: 'auto',
  },
  expiryText: {
    fontSize: 12,
    color: colors.dark.textSecondary,
  },
  
  // Quick action buttons
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  
  // Sent to section
  // insightsSection already defined above
  insightsContainerAlt: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  contactsSentToSection: {
    marginBottom: 24,
  },
  sectionHeaderAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
    fontWeight: '500',
  },
  contactsContainerAlt: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  
  // Activities section
  activitiesSection: {
    marginBottom: 24,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  todayText: {
    fontSize: 14,
    color: colors.dark.text,
    marginRight: 4,
  },
  transactionsContainerAlt2: {
    backgroundColor: colors.dark.background,
    borderRadius: 16,
  },
  
  // Income History Button already defined above
  incomeHistoryButtonAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.dark.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  incomeHistoryTextAlt: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.dark.text,
  },
  
  // Chart section
  chartCard: {
    marginBottom: 24,
    padding: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  savingsTitle: {
    color: colors.dark.textSecondary,
    fontSize: 16,
    marginBottom: 4,
  },
  savingsAmount: {
    color: colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  savingsIncrease: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsIncreaseText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 2,
  },
  chartSubtitle: {
    color: colors.positive,
    fontSize: 14,
  },
  timeRangeSelectorContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },

// Main card styles
mainCardContainer: {
  marginBottom: 24,
  padding: 0,
  height: 200,
  overflow: 'hidden',
},
mainCardGradient: {
  flex: 1,
  padding: 20,
},

// Main action buttons
mainActionsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 24,
},

// Main insights section
mainInsightsSection: {
  marginBottom: 24,
},
mainInsightsContainer: {
  paddingHorizontal: 4,
  paddingVertical: 8,
},
mainSentToSection: {
  marginBottom: 24,
},
mainSectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
},
mainSectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: colors.dark.text,
},
mainViewAllButton: {
  flexDirection: 'row',
  alignItems: 'center',
},
mainViewAllText: {
  fontSize: 14,
  color: colors.dark.textSecondary,
  marginRight: 4,
},
mainContactsContainer: {
  paddingVertical: 8,
  paddingHorizontal: 4,
},

// Main activities section
mainActivitiesSection: {
  marginBottom: 24,
},
mainTodayButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: colors.dark.card,
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
},
mainTodayText: {
  fontSize: 14,
  color: colors.dark.text,
  marginRight: 4,
},
mainTransactionsContainer: {
  backgroundColor: colors.dark.background,
  borderRadius: 16,
},

// Main income history button
mainIncomeHistoryButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: colors.dark.card,
  padding: 16,
  borderRadius: 16,
  marginBottom: 24,
},
mainIncomeHistoryText: {
  fontSize: 16,
  fontWeight: '500',
  color: colors.dark.text,
},

// Section card
sectionCard: {
  marginBottom: 24,
  padding: 16,
},

transactionsContainerMargin: {
  marginTop: 8,
},
});