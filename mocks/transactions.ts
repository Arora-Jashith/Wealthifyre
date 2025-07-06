import { Transaction } from '@/types/finance';

// Mock transaction data
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 1250.00,
    description: 'Salary Deposit',
    category: 'Income',
    date: '2025-05-20T08:30:00Z',
    type: 'income',
    merchant: 'Employer Inc.'
  },
  {
    id: '2',
    amount: -85.47,
    description: 'Grocery Shopping',
    category: 'Food',
    date: '2025-05-22T14:15:00Z',
    type: 'expense',
    merchant: 'Whole Foods',
    roundUp: 0.53
  },
  {
    id: '3',
    amount: -35.99,
    description: 'Streaming Subscription',
    category: 'Entertainment',
    date: '2025-05-21T10:00:00Z',
    type: 'expense',
    merchant: 'Netflix',
    roundUp: 0.01
  },
  {
    id: '4',
    amount: -12.50,
    description: 'Coffee Shop',
    category: 'Dining',
    date: '2025-05-23T09:20:00Z',
    type: 'expense',
    merchant: 'Starbucks',
    roundUp: 0.50
  },
  {
    id: '5',
    amount: -150.00,
    description: 'Electricity Bill',
    category: 'Utilities',
    date: '2025-05-19T16:45:00Z',
    type: 'expense',
    merchant: 'Power Company'
  },
  {
    id: '6',
    amount: -65.30,
    description: 'Gas Station',
    category: 'Transportation',
    date: '2025-05-18T11:30:00Z',
    type: 'expense',
    merchant: 'Shell',
    roundUp: 0.70
  },
  {
    id: '7',
    amount: 500.00,
    description: 'Transfer to Savings',
    category: 'Transfer',
    date: '2025-05-17T15:00:00Z',
    type: 'transfer'
  },
  {
    id: '8',
    amount: -25.00,
    description: 'Round-up Investment',
    category: 'Investment',
    date: '2025-05-16T12:00:00Z',
    type: 'investment'
  },
  {
    id: '9',
    amount: -42.99,
    description: 'Online Purchase',
    category: 'Shopping',
    date: '2025-05-15T13:25:00Z',
    type: 'expense',
    merchant: 'Amazon',
    roundUp: 0.01
  },
  {
    id: '10',
    amount: -9.99,
    description: 'Music Subscription',
    category: 'Entertainment',
    date: '2025-05-14T08:15:00Z',
    type: 'expense',
    merchant: 'Spotify',
    roundUp: 0.01
  }
];

// Helper function to get recent transactions
export const getRecentTransactions = (count: number = 5): Transaction[] => {
  return [...mockTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};

// Helper function to get transactions by type
export const getTransactionsByType = (type: Transaction['type']): Transaction[] => {
  return mockTransactions.filter(transaction => transaction.type === type);
};

// Helper function to get transactions by category
export const getTransactionsByCategory = (category: string): Transaction[] => {
  return mockTransactions.filter(transaction => 
    transaction.category.toLowerCase() === category.toLowerCase()
  );
};

// Helper to calculate total spending by category
export const getSpendingByCategory = (): Record<string, number> => {
  const spending: Record<string, number> = {};
  
  mockTransactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      const category = transaction.category;
      if (!spending[category]) {
        spending[category] = 0;
      }
      spending[category] += Math.abs(transaction.amount);
    }
  });
  
  return spending;
};

// Calculate total income
export const getTotalIncome = (): number => {
  return mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total expenses
export const getTotalExpenses = (): number => {
  return mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

// Calculate total round-ups
export const getTotalRoundUps = (): number => {
  return mockTransactions
    .filter(t => t.roundUp !== undefined)
    .reduce((sum, t) => sum + (t.roundUp || 0), 0);
};