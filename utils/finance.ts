/**
 * Calculates the growth percentage between two values
 * @param currentValue The current value
 * @param previousValue The previous value
 * @returns The growth percentage as a decimal (e.g., 0.05 for 5% growth)
 */
export const calculateGrowth = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return 0;
  return (currentValue - previousValue) / previousValue;
};

/**
 * Formats a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Calculates the total balance across multiple accounts
 * @param accounts Array of accounts
 * @returns Total balance
 */
export const calculateTotalBalance = (accounts: { balance: number }[]): number => {
  return accounts.reduce((total, account) => total + account.balance, 0);
};
