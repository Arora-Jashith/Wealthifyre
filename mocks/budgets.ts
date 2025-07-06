import { Budget } from '@/types/finance';
import { colors } from '@/constants/colors';

// Mock budget data
export const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food',
    allocated: 500,
    spent: 325.47,
    period: 'monthly',
    color: colors.primary
  },
  {
    id: '2',
    category: 'Entertainment',
    allocated: 200,
    spent: 145.98,
    period: 'monthly',
    color: colors.secondary
  },
  {
    id: '3',
    category: 'Transportation',
    allocated: 300,
    spent: 265.30,
    period: 'monthly',
    color: '#FF9F1C'
  },
  {
    id: '4',
    category: 'Utilities',
    allocated: 250,
    spent: 150,
    period: 'monthly',
    color: '#2EC4B6'
  },
  {
    id: '5',
    category: 'Shopping',
    allocated: 300,
    spent: 142.99,
    period: 'monthly',
    color: '#E71D36'
  },
  {
    id: '6',
    category: 'Dining',
    allocated: 250,
    spent: 187.50,
    period: 'monthly',
    color: '#8338EC'
  }
];

// Helper function to calculate budget progress
export const getBudgetProgress = (budget: Budget): number => {
  return (budget.spent / budget.allocated) * 100;
};

// Helper function to get total budget allocated
export const getTotalBudgetAllocated = (): number => {
  return mockBudgets.reduce((total, budget) => total + budget.allocated, 0);
};

// Helper function to get total budget spent
export const getTotalBudgetSpent = (): number => {
  return mockBudgets.reduce((total, budget) => total + budget.spent, 0);
};

// Helper function to get budget by category
export const getBudgetByCategory = (category: string): Budget | undefined => {
  return mockBudgets.find(
    budget => budget.category.toLowerCase() === category.toLowerCase()
  );
};

// Helper function to get budget status
export const getBudgetStatus = (budget: Budget): 'good' | 'warning' | 'over' => {
  const percentage = getBudgetProgress(budget);
  if (percentage > 100) return 'over';
  if (percentage > 80) return 'warning';
  return 'good';
};