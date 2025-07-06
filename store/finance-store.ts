import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account, Transaction, Investment, Card, Budget, FinancialInsight, BalanceForecast } from '@/types/finance';
import { mockInsights } from '@/mocks/insights';
import { mockForecast } from '@/mocks/forecast';

interface FinanceState {
  accounts: Account[];
  transactions: Transaction[];
  investments: Investment[];
  cards: Card[];
  budgets: Budget[];
  insights: FinancialInsight[];
  forecast: BalanceForecast[];

  // Account actions
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Investment actions
  addInvestment: (investment: Omit<Investment, 'id' | 'lastUpdated'>) => void;
  updateInvestment: (id: string, updates: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;

  // Card actions
  addCard: (card: Omit<Card, 'id'>) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;

  // Budget actions
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  // Insight actions
  markInsightAsRead: (id: string) => void;

  // UI state
  selectedAccountId: string | null;
  selectedTimeRange: 'week' | 'month' | 'year';
  selectedYear: number;
  setSelectedYear: (year: number) => void;

  setSelectedAccountId: (id: string | null) => void;
  setSelectedTimeRange: (range: 'week' | 'month' | 'year') => void;
}

export const useFinanceStore = create(
  persist<FinanceState>(
    (set) => ({
      accounts: [],
      transactions: [],
      investments: [],
      cards: [],
      budgets: [],
      insights: mockInsights,
      forecast: mockForecast,

      // UI state
      selectedAccountId: null,
      selectedTimeRange: 'month',
      selectedYear: new Date().getFullYear(),

      // Account actions
      addAccount: (account) => set((state) => {
        const newAccount = {
          ...account,
          id: Date.now().toString(),
        };

        return { accounts: [...state.accounts, newAccount] };
      }),

      updateAccount: (id, updates) => set((state) => ({
        accounts: state.accounts.map((account) =>
          account.id === id ? { ...account, ...updates } : account
        ),
      })),

      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter((account) => account.id !== id),
      })),

      // Transaction actions
      addTransaction: (transaction) => set((state) => {
        const newTransaction = {
          ...transaction,
          id: Date.now().toString(),
        };

        return { transactions: [newTransaction, ...state.transactions] };
      }),

      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === id ? { ...transaction, ...updates } : transaction
        ),
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((transaction) => transaction.id !== id),
      })),

      // Investment actions
      addInvestment: (investment) => set((state) => {
        const newInvestment = {
          ...investment,
          id: Date.now().toString(),
          lastUpdated: new Date().toISOString(),
        };

        return { investments: [...state.investments, newInvestment] };
      }),

      updateInvestment: (id, updates) => set((state) => ({
        investments: state.investments.map((investment) =>
          investment.id === id ? { ...investment, ...updates, lastUpdated: new Date().toISOString() } : investment
        ),
      })),

      deleteInvestment: (id) => set((state) => ({
        investments: state.investments.filter((investment) => investment.id !== id),
      })),

      // Card actions
      addCard: (card) => set((state) => ({
        cards: [...state.cards, { ...card, id: Date.now().toString() }],
      })),

      updateCard: (id, updates) => set((state) => ({
        cards: state.cards.map((card) =>
          card.id === id ? { ...card, ...updates } : card
        ),
      })),

      deleteCard: (id) => set((state) => ({
        cards: state.cards.filter((card) => card.id !== id),
      })),

      // Budget actions
      addBudget: (budget) => set((state) => ({
        budgets: [...state.budgets, { ...budget, id: Date.now().toString() }],
      })),

      updateBudget: (id, updates) => set((state) => ({
        budgets: state.budgets.map((budget) =>
          budget.id === id ? { ...budget, ...updates } : budget
        ),
      })),
      
      deleteBudget: (id: string) => set((state) => ({
        budgets: state.budgets.filter((budget) => budget.id !== id),
      })),
      
      markInsightAsRead: (id: string) => set((state) => ({
        insights: state.insights.map(insight => 
          insight.id === id ? { ...insight, read: true } : insight
        )
      })),
      
      setSelectedAccountId: (id) => set({ selectedAccountId: id }),
      
      setSelectedTimeRange: (range) => set({ selectedTimeRange: range }),
      setSelectedYear: (year: number) => set({ selectedYear: year })
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        // Only persist data fields, not functions
        return { 
          transactions: state.transactions, 
          accounts: state.accounts, 
          budgets: state.budgets, 
          investments: state.investments, 
          cards: state.cards, 
          selectedAccountId: state.selectedAccountId, 
          selectedTimeRange: state.selectedTimeRange, 
          selectedYear: state.selectedYear, 
          insights: state.insights, 
          forecast: state.forecast 
        } as unknown as FinanceState;
      },
    }
  )
);