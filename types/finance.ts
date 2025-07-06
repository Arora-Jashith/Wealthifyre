// Finance-related types

export type TransactionType = 'income' | 'expense' | 'transfer' | 'investment';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
  merchant?: string;
  roundUp?: number; // Amount rounded up for investment
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  currency: string;
  lastFour?: string; // Last 4 digits for cards
  institution?: string;
  color?: string; // Color for UI representation
}

export interface Card {
  id: string;
  name: string;
  type: 'debit' | 'credit';
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  cardholderName: string;
  linkedAccountId: string;
  design?: string;
  isDefault?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly';
  color?: string;
  createdAt?: string;
  transactions?: string[];
}

export interface Investment {
  id: string;
  name: string;
  ticker?: string;
  value: number;
  initialValue: number;
  growth: number; // Percentage
  type: 'stock' | 'etf' | 'crypto' | 'roundups' | 'mutualfunds' | 'ipos';
  lastUpdated: string;
  shares?: number;
  price?: number;
  purchaseDate?: string;
}

export interface FinancialInsight {
  id: string;
  title: string;
  description: string;
  type: 'tip' | 'alert' | 'achievement';
  priority: 'low' | 'medium' | 'high';
  date: string;
  read: boolean;
}

export interface BalanceForecast {
  date: string;
  balance: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  financialGoals?: string[];
  riskTolerance?: 'low' | 'medium' | 'high';
}