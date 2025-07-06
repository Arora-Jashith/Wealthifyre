import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors } from '@/constants/colors';
import { ArrowUpRight, TrendingUp, Search, Filter, ChevronRight, Info } from 'lucide-react-native';
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
      change: -852.32,
      changePercent: -2.24,
      category: 'crypto',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg',
      description: 'Decentralized digital currency without a central bank or administrator.',
    },
    {
      id: '4',
      name: 'Fidelity Blue Chip Growth Fund',
      ticker: 'FBGRX',
      price: 156.42,
      change: 1.23,
      changePercent: 0.79,
      category: 'mutual_funds',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Fidelity_Investments_logo.svg',
      description: 'Growth fund that primarily invests in blue chip companies with above-average growth potential.',
    },
    {
      id: '5',
      name: 'Airbnb IPO',
      ticker: 'ABNB',
      price: 142.50,
      change: 0,
      changePercent: 0,
      category: 'ipos',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg',
      description: 'Initial public offering for Airbnb, an online marketplace for lodging and tourism activities.',
      ipoDate: '2023-06-15',
      expectedPrice: '$140-$150',
    },
    {
      id: '6',
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      price: 328.79,
      change: 4.21,
      changePercent: 1.30,
      category: 'stocks',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      description: 'Technology company that develops, licenses, and supports software, services, devices, and solutions.',
    },
    {
      id: '7',
      name: 'Ethereum',
      ticker: 'ETH',
      price: 2485.63,
      change: 45.32,
      changePercent: 1.86,
      category: 'crypto',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
      description: 'Decentralized, open-source blockchain with smart contract functionality.',
    },
    {
      id: '8',
      name: 'Invesco QQQ Trust',
      ticker: 'QQQ',
      price: 378.92,
      change: 5.43,
      changePercent: 1.45,
      category: 'etfs',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Invesco_logo.svg',
      description: 'Exchange-traded fund that tracks the Nasdaq-100 Index.',
    },
    {
      id: '9',
      name: 'Stripe IPO',
      ticker: 'STRP',
      price: 0,
      change: 0,
      changePercent: 0,
      category: 'ipos',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
      description: 'Expected initial public offering for Stripe, a financial services and software company.',
      ipoDate: '2023-07-20',
      expectedPrice: '$70-$80',
    },
    {
      id: '10',
      name: 'T. Rowe Price Blue Chip Growth Fund',
      ticker: 'TRBCX',
      price: 165.78,
      change: 2.34,
      changePercent: 1.43,
      category: 'mutual_funds',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/T._Rowe_Price_logo.svg',
      description: 'Growth fund that seeks to provide long-term capital growth by investing in common stocks of large and medium-sized blue chip companies.',
    },
  ];
  
  // Filter investment options based on active category
  const filteredOptions = activeCategory === 'all' 
    ? investmentOptions 
    : investmentOptions.filter(option => option.category === activeCategory);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Investment Options',
        headerStyle: {
          backgroundColor: colors.dark.background,
        },
        headerTintColor: colors.dark.text,
      }} />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(300)}>
          <View style={styles.header}>
            <Text style={styles.title}>Discover Investments</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Search size={20} color={colors.dark.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Filter size={20} color={colors.dark.text} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
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
                  activeCategory === category.id && styles.activeCategoryText
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
              {investmentOptions.slice(0, 3).map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.featuredCard}
                  onPress={() => {
                    // Navigate to investment details
                  }}
                >
                  <View style={styles.featuredCardContent}>
                    <View style={styles.featuredCardHeader}>
                      <View style={styles.logoContainer}>
                        {/* Placeholder for logo */}
                        <View style={[styles.logoPlaceholder, { backgroundColor: getRandomColor() }]}>
                          <Text style={styles.logoText}>{option.ticker.substring(0, 2)}</Text>
                        </View>
                      </View>
                      <View style={styles.featuredCardInfo}>
                        <Text style={styles.featuredCardName}>{option.name}</Text>
                        <Text style={styles.featuredCardTicker}>{option.ticker}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.featuredCardFooter}>
                      <Text style={styles.featuredCardPrice}>{formatCurrency(option.price)}</Text>
                      <View style={[
                        styles.changeContainer,
                        option.changePercent >= 0 ? styles.positiveChange : styles.negativeChange
                      ]}>
                        <ArrowUpRight size={14} color={option.changePercent >= 0 ? colors.positive : colors.accent} />
                        <Text style={[
                          styles.changeText,
                          option.changePercent >= 0 ? styles.positiveChangeText : styles.negativeChangeText
                        ]}>
                          {option.changePercent >= 0 ? '+' : ''}{option.changePercent.toFixed(2)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).duration(300)}>
          <View style={styles.allOptionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Investment Options</Text>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sort By</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.optionsList}>
              {filteredOptions.map((option, index) => (
                <Animated.View 
                  key={option.id}
                  entering={FadeInDown.delay(350 + (index * 50)).duration(300)}
                >
                  <GlassCard style={styles.optionCard}>
                    <TouchableOpacity
                      onPress={() => {
                        // Navigate to investment details
                      }}
                    >
                      <View style={styles.optionCardContent}>
                        <View style={styles.optionCardLeft}>
                          <View style={[styles.logoPlaceholder, { backgroundColor: getRandomColor() }]}>
                            <Text style={styles.logoText}>{option.ticker.substring(0, 2)}</Text>
                          </View>
                          
                          <View style={styles.optionCardInfo}>
                            <Text style={styles.optionCardName}>{option.name}</Text>
                            <Text style={styles.optionCardTicker}>{option.ticker}</Text>
                            
                            <View style={styles.optionCardCategory}>
                              <Text style={styles.optionCardCategoryText}>
                                {getCategoryName(option.category)}
                              </Text>
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.optionCardRight}>
                          <Text style={styles.optionCardPrice}>{formatCurrency(option.price)}</Text>
                          
                          {option.category !== 'ipos' || option.price > 0 ? (
                            <View style={[
                              styles.changeContainer,
                              option.changePercent >= 0 ? styles.positiveChange : styles.negativeChange
                            ]}>
                              <ArrowUpRight size={14} color={option.changePercent >= 0 ? colors.positive : colors.accent} />
                              <Text style={[
                                styles.changeText,
                                option.changePercent >= 0 ? styles.positiveChangeText : styles.negativeChangeText
                              ]}>
                                {option.changePercent >= 0 ? '+' : ''}{option.changePercent.toFixed(2)}%
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.ipoContainer}>
                              <Info size={14} color={colors.primary} />
                              <Text style={styles.ipoText}>Coming Soon</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </GlassCard>
                </Animated.View>
              ))}
            </View>
          </View>
        </Animated.View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </>
  );
}

// Helper function to get a random color for logo placeholders
function getRandomColor() {
  const colors = [
    '#4A6FFF', // Blue
    '#FF9F1C', // Orange
    '#8A4FFF', // Purple
    '#FF4F8A', // Pink
    '#4FFF8A', // Green
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

// Helper function to get category name from id
function getCategoryName(categoryId: string) {
  const categoryMap: Record<string, string> = {
    'stocks': 'Stock',
    'etfs': 'ETF',
    'mutual_funds': 'Mutual Fund',
    'ipos': 'IPO',
    'crypto': 'Cryptocurrency',
  };
  
  return categoryMap[categoryId] || categoryId;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: colors.dark.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
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
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.dark.card,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: colors.dark.text,
    fontWeight: '600',
  },
  featuredSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.dark.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuredContainer: {
    paddingRight: 16,
  },
  featuredCard: {
    width: 220,
    height: 140,
    borderRadius: 16,
    backgroundColor: colors.dark.card,
    marginRight: 12,
    padding: 16,
  },
  featuredCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  featuredCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 12,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  featuredCardInfo: {
    flex: 1,
  },
  featuredCardName: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featuredCardTicker: {
    color: colors.dark.textSecondary,
    fontSize: 12,
  },
  featuredCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredCardPrice: {
    color: colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveChange: {
    backgroundColor: `${colors.positive}20`,
  },
  negativeChange: {
    backgroundColor: `${colors.accent}20`,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  positiveChangeText: {
    color: colors.positive,
  },
  negativeChangeText: {
    color: colors.accent,
  },
  allOptionsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
  },
  optionCardContent: {
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
    marginLeft: 12,
    flex: 1,
  },
  optionCardName: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionCardTicker: {
    color: colors.dark.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  optionCardCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  optionCardCategoryText: {
    color: colors.dark.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  optionCardRight: {
    alignItems: 'flex-end',
  },
  optionCardPrice: {
    color: colors.dark.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: `${colors.primary}20`,
  },
  ipoText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  bottomPadding: {
    height: 40,
  },
});
