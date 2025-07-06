import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  // App preferences
  theme: 'dark' | 'light' | 'system';
  notificationsEnabled: boolean;
  roundUpEnabled: boolean;
  roundUpMultiplier: number; // 1x, 2x, 3x multiplier for round-ups
  
  // Actions
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  toggleNotifications: () => void;
  toggleRoundUp: () => void;
  setRoundUpMultiplier: (multiplier: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default settings
      theme: 'dark',
      notificationsEnabled: true,
      roundUpEnabled: true,
      roundUpMultiplier: 1,
      
      // Actions
      setTheme: (theme) => set({ theme }),
      
      toggleNotifications: () => set((state) => ({ 
        notificationsEnabled: !state.notificationsEnabled 
      })),
      
      toggleRoundUp: () => set((state) => ({ 
        roundUpEnabled: !state.roundUpEnabled 
      })),
      
      setRoundUpMultiplier: (multiplier) => set({ 
        roundUpMultiplier: multiplier 
      }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);