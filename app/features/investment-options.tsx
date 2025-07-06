import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Search, Filter, DollarSign } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function InvestmentOptionsScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Categories of investment options
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'mutual_funds', name: 'Mutual Funds' },
    { id: 'etfs', name: 'ETFs' },
    { id: 'ipos', name: 'IPOs' },
    { id: 'crypto', name: 'Crypto' },
  ];
  
  // Mock investment options data
  const investmentOptions = [
    {
      id: '1',
      name: 'Apple Inc.',
      ticker: 'AAPL',
      price: 178.72,
      change: 2.45,
      changePercent: 1.39,
      category: 'stocks',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      description: 'Technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
    },
    {
      id: '2',
      name: 'Vanguard S&P 500 ETF',
      ticker: 'VOO',
      price: 412.65,
      change: 3.18,
      changePercent: 0.78,
      category: 'etfs',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Vanguard_logo.svg',
      description: 'Exchange-traded fund that tracks the performance of the S&P 500 Index.',
    },
    {
      id: '3',
      name: 'Bitcoin',
      ticker: 'BTC',
      price: 37245.18,
      change: -1250.32,
      changePercent: -3.25,
      category: 'crypto',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg',
      description: 'Decentralized digital currency without a central bank or single administrator.',
    },
    {
      id: '4',
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      price: 338.11,
      change: 0.87,
      changePercent: 0.26,
      category: 'stocks',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      description: 'Technology company that develops, licenses, and supports software, services, devices, and solutions.',
    },
    {
      id: '5',
      name: 'Fidelity 500 Index Fund',
      ticker: 'FXAIX',
      price: 163.44,
      change: 1.27,
      changePercent: 0.78,
      category: 'mutual_funds',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Fidelity_Investments_logo.svg',
      description: 'Mutual fund that seeks to provide investment results that correspond to the total return of common stocks publicly traded in the United States.',
    },
    {
      id: '6',
      name: 'Ethereum',
      ticker: 'ETH',
      price: 2014.37,
      change: -87.25,
      changePercent: -4.15,
      category: 'crypto',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
      description: 'Decentralized, open-source blockchain with smart contract functionality.',
    },
    {
      id: '7',
      name: 'Airbnb, Inc.',
      ticker: 'ABNB',
      price: 131.20,
      change: 3.45,
      changePercent: 2.70,
      category: 'stocks',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg',
      description: 'Online marketplace for lodging, primarily homestays for vacation rentals, and tourism activities.',
    },
    {
      id: '8',
      name: 'Vanguard Total Bond Market ETF',
      ticker: 'BND',
      price: 72.35,
      change: -0.15,
      changePercent: -0.21,
      category: 'etfs',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Vanguard_logo.svg',
      description: 'Exchange-traded fund that seeks to track the performance of a broad, market-weighted bond index.',
    },
    {
      id: '9',
      name: 'Coinbase IPO',
      ticker: 'COIN',
      price: 84.91,
      change: 1.23,
      changePercent: 1.47,
      category: 'ipos',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase.png',
      description: 'American company that operates a cryptocurrency exchange platform.',
    },
    {
      id: '10',
      name: 'Fidelity Blue Chip Growth Fund',
      ticker: 'FBGRX',
      price: 156.27,
      change: 2.31,
      changePercent: 1.50,
      category: 'mutual_funds',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Fidelity_Investments_logo.svg',
      description: 'Growth fund that seeks to provide long-term capital growth by investing in common stocks of large and medium-sized blue chip companies.',
    },
  ];
  
  // Filter options based on active category
  const filteredOptions = activeCategory === 'all'
    ? investmentOptions
    : investmentOptions.filter(option => option.category === activeCategory);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    });
  };
  
  // Handle investment selection to purchase
  const handleInvestmentPress = (investment: any) => {
    router.push({
      pathname: '/purchase-investment',
      params: {
        id: investment.id,
        name: investment.name,
        ticker: investment.ticker,
        price: investment.price.toString(),
        category: investment.category,
        image: investment.logo || ''
      }
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: "Investments",
          headerStyle: {
            backgroundColor: colors.dark.background,
          },
          headerTintColor: colors.dark.text,
          headerShadowVisible: false
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Search size={20} color={colors.dark.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Filter size={20} color={colors.dark.text} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  activeCategory === category.id && styles.activeCategoryButton
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text style={[
                  styles.categoryText,
                  activeCategory === category.id && { color: '#000000' }
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <View style={styles.featuredSection}>
            <Text style={styles.sectionTitle}>Featured Opportunities</Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {investmentOptions.slice(0, 3).map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.featuredCard}
                  onPress={() => handleInvestmentPress(option)}
                >
                  <View style={styles.featuredCardContent}>
                    <View style={styles.featuredCardHeader}>
                      <View style={styles.logoContainer}>
                        <View style={styles.logoPlaceholder}>
                          <Text style={[styles.logoPlaceholderText, { color: '#000000' }]}>{option.name.charAt(0).toUpperCase()}</Text>
                        </View>
                      </View>
                      <Text style={styles.featuredCardName}>{option.name}</Text>
                    </View>
                    <View style={styles.featuredCardInfo}>
                      <Text style={styles.featuredCardTicker}>{option.ticker}</Text>
                      <Text style={styles.featuredCardPrice}>{formatCurrency(option.price)}</Text>
                    </View>
                    <View style={styles.featuredCardFooter}>
                      <View style={[
                        styles.changeContainer,
                        option.change > 0 ? styles.positiveChange : styles.negativeChange
                      ]}>
                        <Text style={[
                          styles.changeText,
                          option.change > 0 ? styles.positiveChangeText : styles.negativeChangeText
                        ]}>
                          {option.change > 0 ? '+' : ''}{option.change.toFixed(2)} ({option.changePercent.toFixed(2)}%)
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
        
        <View style={styles.allOptionsSection}>
          <Text style={styles.sectionTitle}>All Investment Options</Text>
          <View style={styles.allOptionsContainer}>
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.optionCard}
                onPress={() => handleInvestmentPress(option)}
              >
                <View style={styles.optionCardContent}>
                  <View style={styles.optionCardLeft}>
                    <View style={styles.logoContainer}>
                      <View style={styles.logoPlaceholder}>
                        <Text style={[styles.logoPlaceholderText, { color: '#000000' }]}>{option.name.charAt(0).toUpperCase()}</Text>
                      </View>
                    </View>
                    <View style={styles.optionCardInfo}>
                      <Text style={styles.optionCardName}>{option.name}</Text>
                      <Text style={styles.optionCardTicker}>{option.ticker}</Text>
                    </View>
                  </View>
                  <View style={styles.optionCardRight}>
                    <Text style={styles.optionCardPrice}>{formatCurrency(option.price)}</Text>
                    <View style={[
                      styles.changeContainer,
                      option.change > 0 ? styles.positiveChange : styles.negativeChange
                    ]}>
                      <Text style={[
                        styles.changeText,
                        option.change > 0 ? styles.positiveChangeText : styles.negativeChangeText
                      ]}>
                        {option.change > 0 ? '+' : ''}{option.change.toFixed(2)} ({option.changePercent.toFixed(2)}%)
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    paddingHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.dark.text,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#000000',
    fontWeight: '600',
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 16,
  },
  featuredContainer: {
    paddingRight: 16,
    gap: 12,
  },
  featuredCard: {
    width: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.dark.card,
  },
  featuredCardContent: {
    padding: 16,
  },
  featuredCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    marginRight: 8,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  logoPlaceholderText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  featuredCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
    flex: 1,
    marginLeft: 8,
  },
  featuredCardInfo: {
    marginBottom: 12,
  },
  featuredCardTicker: {
    fontSize: 14,
    color: colors.dark.textSecondary,
    marginBottom: 4,
  },
  featuredCardPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  featuredCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allOptionsSection: {
    flex: 1,
    marginBottom: 24,
  },
  allOptionsContainer: {
    gap: 12,
  },
  optionCard: {
    borderRadius: 12,
    backgroundColor: colors.dark.card,
    overflow: 'hidden',
  },
  optionCardContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionCardInfo: {
    marginLeft: 16,
    flex: 1,
  },
  optionCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 4,
  },
  optionCardTicker: {
    fontSize: 14,
    color: colors.dark.textSecondary,
  },
  optionCardRight: {
    alignItems: 'flex-end',
  },
  optionCardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 4,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  positiveChange: {
    backgroundColor: 'rgba(0, 255, 102, 0.15)',
  },
  negativeChange: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  positiveChangeText: {
    color: colors.primary,
  },
  negativeChangeText: {
    color: colors.accent,
  },
  bottomPadding: {
    height: 100,
  },
});
