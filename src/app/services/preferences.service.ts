import { Injectable, signal, effect, inject } from '@angular/core';
import { UserPreferences, DEFAULT_PREFERENCES, AppLanguage } from '../models/user-preferences.model';
import { StorageService } from './storage.service';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  private readonly STORAGE_KEY = 'darna_user_preferences';
  private storage = inject(StorageService);
  private i18n = inject(I18nService);

  readonly preferences = signal<UserPreferences>(this.loadPreferences());

  constructor() {
    effect(() => {
      const prefs = this.preferences();
      this.storage.setItem(this.STORAGE_KEY, prefs);
    });
  }

  private loadPreferences(): UserPreferences {
    const loaded = this.storage.getItem<UserPreferences>(this.STORAGE_KEY, DEFAULT_PREFERENCES);
    return { ...DEFAULT_PREFERENCES, ...loaded };
  }

  updatePreferences(updates: Partial<UserPreferences>): void {
    this.preferences.update(current => ({
      ...current,
      ...updates
    }));
  }

  savePreferences(prefs: UserPreferences): void {
    this.preferences.set(prefs);
    if (prefs.language) {
      this.i18n.setLanguage(prefs.language);
    }
  }

  setTargetBudget(budget: number | undefined): void {
    this.updatePreferences({ totalBudget: budget });
  }

  setCategoryBudget(categoryId: string, amount: number | undefined): void {
    const current = this.preferences().categoryBudgets || {};
    const updated = { ...current };
    if (amount !== undefined && amount > 0) {
      updated[categoryId] = amount;
    } else {
      delete updated[categoryId];
    }
    this.updatePreferences({ categoryBudgets: updated });
  }

  completeOnboarding(data: {
    brideName?: string;
    groomName?: string;
    weddingDate?: string;
    totalBudget?: number;
    homeType?: 'apartment' | 'house' | 'villa' | 'other';
    roomCount?: number;
    pacePreference?: 'relaxed' | 'moderate' | 'express';
  }): void {
    this.updatePreferences({
      ...data,
      hasChosenLanguage: true,
      hasCompletedOnboarding: true
    });
  }

  setBrideName(name: string): void {
    this.updatePreferences({ brideName: name.trim() });
  }

  setWeddingDate(date: string): void {
    this.updatePreferences({ weddingDate: date });
  }

  setLanguage(lang: AppLanguage): void {
    this.updatePreferences({ language: lang, hasChosenLanguage: true });
    this.i18n.setLanguage(lang);
  }
}

