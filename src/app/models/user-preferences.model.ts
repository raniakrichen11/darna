export type AppLanguage = 'fr' | 'ar' | 'en';

export interface UserPreferences {
  language: AppLanguage;
  hasChosenLanguage: boolean;
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  totalBudget?: number; // In TND
  currency: string;     // 'DT' / 'د.ت'
  theme: 'warm' | 'cream';
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'fr',
  hasChosenLanguage: false,
  brideName: '',
  groomName: '',
  weddingDate: '',
  totalBudget: undefined,
  currency: 'DT',
  theme: 'warm'
};
