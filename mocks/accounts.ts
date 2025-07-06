import { Account } from '@/types/finance';

// Mock accounts data
export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Primary Checking',
    type: 'checking',
    balance: 3245.67,
    currency: 'USD',
    lastFour: '4321',
    institution: 'Chase Bank'
  },
  {
    id: '2',
    name: 'High-Yield Savings',
    type: 'savings',
    balance: 12500.00,
    currency: 'USD',
    lastFour: '8765',
    institution: 'Ally Bank'
  },
  {
    id: '3',
    name: 'Investment Portfolio',
    type: 'investment',
    balance: 45750.32,
    currency: 'USD',
    institution: 'Vanguard'
  },
  {
    id: '4',
    name: 'Credit Card',
    type: 'credit',
    balance: -2340.15,
    currency: 'USD',
    lastFour: '9876',
    institution: 'American Express'
  },
  {
    id: '5',
    name: 'Round-Up Investments',
    type: 'investment',
    balance: 387.42,
    currency: 'USD',
    institution: 'Wealthifyre'
  }
];

// Helper function to get total balance across all accounts
export const getTotalBalance = (): number => {
  return mockAccounts.reduce((total, account) => {
    // For credit accounts, we don't add the negative balance to the total
    if (account.type === 'credit') {
      return total;
    }
    return total + account.balance;
  }, 0);
};

// Helper function to get total debt (credit accounts)
export const getTotalDebt = (): number => {
  return mockAccounts
    .filter(account => account.type === 'credit')
    .reduce((total, account) => total + Math.abs(account.balance), 0);
};

// Helper function to get accounts by type
export const getAccountsByType = (type: Account['type']): Account[] => {
  return mockAccounts.filter(account => account.type === type);
};

// Helper function to get round-up investment account
export const getRoundUpAccount = (): Account | undefined => {
  return mockAccounts.find(account => account.name === 'Round-Up Investments');
};