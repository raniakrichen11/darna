import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getItem<T>(key: string, defaultValue: T): T {
    if (typeof localStorage === 'undefined') {
      return defaultValue;
    }
    try {
      const data = localStorage.getItem(key);
      if (data === null || data === undefined) {
        return defaultValue;
      }
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`[StorageService] Failed to parse key "${key}", returning default.`, e);
      return defaultValue;
    }
  }

  setItem<T>(key: string, value: T): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`[StorageService] Failed to save key "${key}".`, e);
      return false;
    }
  }

  removeItem(key: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`[StorageService] Failed to remove key "${key}".`, e);
    }
  }

  exportAllData(keys: string[]): string {
    const backup: Record<string, any> = {
      app: 'darna',
      version: '1.0.0',
      exportedAt: new Date().toISOString()
    };
    for (const key of keys) {
      const val = this.getItem(key, null);
      if (val !== null) {
        backup[key] = val;
      }
    }
    return JSON.stringify(backup, null, 2);
  }

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || parsed.app !== 'darna') {
        throw new Error('Invalid Darna backup file');
      }
      for (const key of Object.keys(parsed)) {
        if (key !== 'app' && key !== 'version' && key !== 'exportedAt') {
          this.setItem(key, parsed[key]);
        }
      }
      return true;
    } catch (e) {
      console.error('[StorageService] Import failed', e);
      return false;
    }
  }
}
