import { BalanceForecast } from '@/types/finance';

// Generate 30 days of forecast data
const generateForecastData = (): BalanceForecast[] => {
  const today = new Date();
  const forecasts: BalanceForecast[] = [];
  
  // Start with a base balance
  let currentBalance = 3245.67;
  
  // Known upcoming transactions
  const knownTransactions: { dayOffset: number; amount: number; description: string }[] = [
    { dayOffset: 2, amount: -150, description: 'Phone Bill' },
    { dayOffset: 5, amount: -1200, description: 'Rent Payment' },
    { dayOffset: 10, amount: 1250, description: 'Salary Deposit' },
    { dayOffset: 15, amount: -85, description: 'Internet Bill' },
    { dayOffset: 20, amount: -200, description: 'Credit Card Payment' },
    { dayOffset: 25, amount: 1250, description: 'Salary Deposit' },
    { dayOffset: 28, amount: -120, description: 'Utilities' }
  ];
  
  // Generate daily forecasts
  for (let i = 0; i < 30; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);
    
    // Apply known transactions for this day
    const dayTransactions = knownTransactions.filter(t => t.dayOffset === i);
    dayTransactions.forEach(transaction => {
      currentBalance += transaction.amount;
    });
    
    // Add some randomness for daily spending (between $0 and $50)
    if (i > 0) { // Skip today as we know the exact balance
      const randomSpending = Math.random() * 50;
      currentBalance -= randomSpending;
    }
    
    forecasts.push({
      date: forecastDate.toISOString(),
      balance: parseFloat(currentBalance.toFixed(2))
    });
  }
  
  return forecasts;
};

export const mockForecast: BalanceForecast[] = generateForecastData();

// Helper function to get the lowest projected balance
export const getLowestProjectedBalance = (): BalanceForecast => {
  return mockForecast.reduce((lowest, current) => 
    current.balance < lowest.balance ? current : lowest, 
    mockForecast[0]
  );
};

// Helper function to get the highest projected balance
export const getHighestProjectedBalance = (): BalanceForecast => {
  return mockForecast.reduce((highest, current) => 
    current.balance > highest.balance ? current : highest, 
    mockForecast[0]
  );
};

// Helper function to check if there's a projected negative balance
export const hasNegativeBalanceProjection = (): boolean => {
  return mockForecast.some(forecast => forecast.balance < 0);
};

// Helper function to get the date of the first negative balance (if any)
export const getFirstNegativeBalanceDate = (): string | null => {
  const negativeEntry = mockForecast.find(forecast => forecast.balance < 0);
  return negativeEntry ? negativeEntry.date : null;
};