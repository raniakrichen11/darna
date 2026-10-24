export type AppLanguage = 'fr' | 'ar' | 'en';

export interface UserPreferences {
  language: AppLanguage;
  hasChosenLanguage: boolean;
  hasCompletedOnboarding: boolean;
  brideName?: string;
  groomName?: string;
  weddingDate?: string; // YYYY-MM-DD
  totalBudget?: number; // In TND
  currency: string;     // 'DT' / 'د.ت'
  theme: 'warm' | 'cream';
  homeType?: 'apartment' | 'house' | 'villa' | 'other';
  roomCount?: number;
  pacePreference?: 'relaxed' | 'moderate' | 'express';
  categoryBudgets?: Record<string, number>;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'fr',
  hasChosenLanguage: false,
  hasCompletedOnboarding: false,
  brideName: '',
  groomName: '',
  weddingDate: '',
  totalBudget: undefined,
  currency: 'DT',
  theme: 'warm',
  homeType: 'apartment',
  roomCount: 3,
  pacePreference: 'moderate',
  categoryBudgets: {}
};

