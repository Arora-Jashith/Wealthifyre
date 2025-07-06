import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import { 
  Home, 
  BarChart3, 
  CreditCard, 
  TrendingUp, 
  MessageSquare,
  Search,
  Tv,
  Bell,
  User,
  Circle
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define custom styles for the tab bar
const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000',
    borderTopColor: 'transparent',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginHorizontal: 0,
    marginBottom: 0,
    height: 70,
    paddingVertical: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
  },
  activeIconContainer: {
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    width: 10,
    height: 10,
  }
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#A9A9A9',
          headerShown: true,
          tabBarStyle: {
            ...tabStyles.tabBar,
            height: 80,
            paddingBottom: insets.bottom,
            paddingTop: 15,
          },
          tabBarBackground: () => (
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: '#000000', borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: tabStyles.tabBar.borderBottomLeftRadius, borderBottomRightRadius: tabStyles.tabBar.borderBottomRightRadius }} />
          ),
          headerStyle: {
            backgroundColor: colors.background,
            borderBottomWidth: 0,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            textAlign: 'center',
          },
          headerTitleAlign: 'center',
          tabBarLabelStyle: { display: 'none' },
          tabBarIconStyle: {
            marginTop: 0,
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarItemStyle: tabStyles.tabItem,
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <Home size={size} color={color} strokeWidth={2.5} />
            ) : (
              <Home size={size} color={color} strokeWidth={2.5} />
            )
          ),
        }}
      />
      
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarItemStyle: tabStyles.tabItem,
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <CreditCard size={size} color={color} strokeWidth={2.5} />
            ) : (
              <CreditCard size={size} color={color} strokeWidth={2.5} />
            )
          ),
        }}
      />
      
      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarItemStyle: tabStyles.tabItem,
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <BarChart3 size={size} color={color} strokeWidth={2.5} />
            ) : (
              <BarChart3 size={size} color={color} strokeWidth={2.5} />
            )
          ),
        }}
      />
      
      <Tabs.Screen
        name="investments"
        options={{
          title: 'Investments',
          tabBarItemStyle: tabStyles.tabItem,
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <TrendingUp size={size} color={color} strokeWidth={2.5} />
            ) : (
              <TrendingUp size={size} color={color} strokeWidth={2.5} />
            )
          ),
        }}
      />
      
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'Assistant',
          tabBarItemStyle: tabStyles.tabItem,
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (
              <MessageSquare size={size} color={color} strokeWidth={2.5} />
            ) : (
              <MessageSquare size={size} color={color} strokeWidth={2.5} />
            )
          ),
        }}
      />
    </Tabs>
    </>
  );
}