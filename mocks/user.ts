import { UserProfile } from '@/types/finance';

// Mock user profile data
export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
  financialGoals: [
    'Save $10,000 for emergency fund',
    'Pay off student loans by 2026',
    'Save for down payment on house'
  ],
  riskTolerance: 'medium'
};