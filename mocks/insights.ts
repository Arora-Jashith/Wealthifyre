import { FinancialInsight } from '@/types/finance';

// Mock financial insights data
export const mockInsights: FinancialInsight[] = [
  {
    id: '1',
    title: 'Budget Alert',
    description: "You've spent 90% of your Entertainment budget this month.",
    type: 'alert',
    priority: 'medium',
    date: '2025-05-23T10:15:00Z',
    read: false
  },
  {
    id: '2',
    title: 'Saving Opportunity',
    description: "Based on your spending patterns, you could save $150 more each month by reducing dining expenses.",
    type: 'tip',
    priority: 'high',
    date: '2025-05-22T14:30:00Z',
    read: false
  },
  {
    id: '3',
    title: 'Investment Milestone',
    description: "Congratulations! Your round-up investments have reached $350.",
    type: 'achievement',
    priority: 'medium',
    date: '2025-05-21T09:45:00Z',
    read: true
  },
  {
    id: '4',
    title: 'Recurring Payment',
    description: "Your Netflix subscription ($35.99) will be charged tomorrow.",
    type: 'alert',
    priority: 'low',
    date: '2025-05-20T16:20:00Z',
    read: true
  },
  {
    id: '5',
    title: 'Spending Pattern',
    description: "You spend most on groceries on weekends. Consider weekday shopping for better deals.",
    type: 'tip',
    priority: 'low',
    date: '2025-05-19T11:10:00Z',
    read: true
  }
];

// Helper function to get unread insights
export const getUnreadInsights = (): FinancialInsight[] => {
  return mockInsights.filter(insight => !insight.read);
};

// Helper function to get insights by type
export const getInsightsByType = (type: FinancialInsight['type']): FinancialInsight[] => {
  return mockInsights.filter(insight => insight.type === type);
};

// Helper function to get insights by priority
export const getInsightsByPriority = (priority: FinancialInsight['priority']): FinancialInsight[] => {
  return mockInsights.filter(insight => insight.priority === priority);
};

// Helper function to get recent insights
export const getRecentInsights = (count: number = 3): FinancialInsight[] => {
  return [...mockInsights]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};