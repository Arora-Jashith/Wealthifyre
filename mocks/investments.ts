import { Investment } from '@/types/finance';

// Mock investments data
export const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'Total Market ETF',
    value: 25000.00,
    initialValue: 20000.00,
    growth: 25.0,
    type: 'etf',
    lastUpdated: '2025-05-23T16:30:00Z'
  },
  {
    id: '2',
    name: 'Tech Stocks',
    value: 15750.32,
    initialValue: 12000.00,
    growth: 31.25,
    type: 'stock',
    lastUpdated: '2025-05-23T16:30:00Z'
  },
  {
    id: '3',
    name: 'Cryptocurrency',
    value: 5000.00,
    initialValue: 3000.00,
    growth: 66.67,
    type: 'crypto',
    lastUpdated: '2025-05-23T16:30:00Z'
  },
  {
    id: '4',
    name: 'Round-Up Savings',
    value: 387.42,
    initialValue: 350.00,
    growth: 10.69,
    type: 'roundups',
    lastUpdated: '2025-05-23T16:30:00Z'
  }
];

// Helper function to get total investment value
export const getTotalInvestmentValue = (): number => {
  return mockInvestments.reduce((total, investment) => total + investment.value, 0);
};

// Helper function to get total investment growth
export const getTotalInvestmentGrowth = (): number => {
  const totalValue = getTotalInvestmentValue();
  const totalInitial = mockInvestments.reduce((total, investment) => total + investment.initialValue, 0);
  return ((totalValue - totalInitial) / totalInitial) * 100;
};

// Helper function to get round-up investments
export const getRoundUpInvestments = (): Investment | undefined => {
  return mockInvestments.find(investment => investment.type === 'roundups');
};

// Helper function to get investments by type
export const getInvestmentsByType = (type: Investment['type']): Investment[] => {
  return mockInvestments.filter(investment => investment.type === type);
};