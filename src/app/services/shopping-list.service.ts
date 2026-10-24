import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { ShoppingListItem, CategoryGroup, BudgetSummary } from '../models/shopping-list.model';
import { CatalogItem } from '../models/catalog.model';
import { StorageService } from './storage.service';
import { CatalogService } from './catalog.service';
import { PreferencesService } from './preferences.service';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private readonly STORAGE_KEY = 'darna_shopping_list';
  private storage = inject(StorageService);
  private catalogService = inject(CatalogService);
  private preferencesService = inject(PreferencesService);
  private i18n = inject(I18nService);

  readonly items = signal<ShoppingListItem[]>(this.loadInitialItems());
  readonly lastRemovedItem = signal<ShoppingListItem | null>(null);

  constructor() {
    effect(() => {
      const currentItems = this.items();
      this.storage.setItem(this.STORAGE_KEY, currentItems);
    });
  }

  private loadInitialItems(): ShoppingListItem[] {
    const saved = this.storage.getItem<ShoppingListItem[]>(this.STORAGE_KEY, []);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    // Pre-populate with a tasteful starter selection of 15 Tunisian essentials so the bride discovers an active list immediately
    return this.createStarterList();
  }

  createStarterList(): ShoppingListItem[] {
    const starterCatalogIds = [
      'cui-001', // Couscoussier inox
      'cui-003', // Cocotte minute
      'cui-004', // Casseroles
      'vai-001', // Service table invités
      'vai-004', // Ménagère inox
      'vai-008', // Service à thé tunisien
      'cha-001', // Couvre lit brodé
      'cha-002', // Parures coton
      'sdb-001', // Duo peignoirs mariés
      'sdb-002', // Foutas
      'sal-002', // Tapis salon
      'tro-001', // Set valises voyage
      'tro-002', // Parfum mariage
      'lin-001', // Nappe réception brodée
      'mar-001'  // Peignoir satin blanc
    ];

    const result: ShoppingListItem[] = [];
    const now = Date.now();

    for (const catId of starterCatalogIds) {
      const catItem = this.catalogService.getItemById(catId);
      if (catItem) {
        result.push({
          id: 'item_' + catId + '_' + Math.random().toString(36).substring(2, 7),
          catalogItemId: catItem.id,
          categoryId: catItem.categoryId,
          subcategoryId: catItem.subcategoryId,
          quantity: catItem.suggestedQuantity,
          estimatedUnitPrice: catItem.estimatedUnitPrice,
          actualUnitPrice: undefined,
          isPurchased: false,
          priority: catItem.isTraditional ? 'essential' : 'useful',
          notes: '',
          createdAt: now
        });
      }
    }
    return result;
  }

  // Check if an item from catalog is already added
  isCatalogItemInList(catalogItemId: string): boolean {
    return this.items().some(i => i.catalogItemId === catalogItemId);
  }

  getItemByCatalogId(catalogItemId: string): ShoppingListItem | undefined {
    return this.items().find(i => i.catalogItemId === catalogItemId);
  }

  // Add from catalog
  addCatalogItem(catalogItem: CatalogItem): { added: boolean; item: ShoppingListItem } {
    const existing = this.getItemByCatalogId(catalogItem.id);
    if (existing) {
      // Increment quantity
      this.updateQuantity(existing.id, existing.quantity + 1);
      return { added: false, item: existing };
    }

    const newItem: ShoppingListItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      catalogItemId: catalogItem.id,
      categoryId: catalogItem.categoryId,
      subcategoryId: catalogItem.subcategoryId,
      quantity: catalogItem.suggestedQuantity || 1,
      estimatedUnitPrice: catalogItem.estimatedUnitPrice,
      actualUnitPrice: undefined,
      isPurchased: false,
      priority: catalogItem.isTraditional ? 'essential' : 'useful',
      notes: '',
      createdAt: Date.now()
    };

    this.items.update(list => [newItem, ...list]);
    return { added: true, item: newItem };
  }

  // Add custom item
  addCustomItem(params: {
    name: string;
    categoryId: string;
    subcategoryId?: string;
    quantity: number;
    estimatedUnitPrice?: number;
    actualUnitPrice?: number;
    priority?: 'essential' | 'useful' | 'optional';
    purchaseLocation?: string;
    purchaseDate?: string;
    targetDate?: string;
    notes?: string;
  }): ShoppingListItem {
    const lang = this.i18n.currentLang();
    const newItem: ShoppingListItem = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      categoryId: params.categoryId,
      subcategoryId: params.subcategoryId,
      customNameFr: lang === 'fr' ? params.name : undefined,
      customNameAr: lang === 'ar' ? params.name : undefined,
      customNameEn: lang === 'en' ? params.name : undefined,
      quantity: Math.max(1, params.quantity || 1),
      estimatedUnitPrice: params.estimatedUnitPrice,
      actualUnitPrice: params.actualUnitPrice,
      isPurchased: false,
      priority: params.priority || 'useful',
      purchaseLocation: params.purchaseLocation?.trim() || undefined,
      purchaseDate: params.purchaseDate || undefined,
      targetDate: params.targetDate || undefined,
      notes: params.notes?.trim() || '',
      createdAt: Date.now()
    };

    this.items.update(list => [newItem, ...list]);
    return newItem;
  }

  // Update item
  updateItem(id: string, updates: Partial<ShoppingListItem>): void {
    this.items.update(list =>
      list.map(item => (item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item))
    );
  }

  // Toggle purchase status
  togglePurchased(id: string): void {
    this.items.update(list =>
      list.map(item => {
        if (item.id === id) {
          const nextState = !item.isPurchased;
          // If marking purchased and no actual price is set yet, default actual price to estimated if available
          let actualPrice = item.actualUnitPrice;
          if (nextState && (actualPrice === undefined || actualPrice === null) && item.estimatedUnitPrice) {
            actualPrice = item.estimatedUnitPrice;
          }
          const todayDate = new Date().toISOString().slice(0, 10);
          return {
            ...item,
            isPurchased: nextState,
            actualUnitPrice: actualPrice,
            purchaseDate: nextState ? (item.purchaseDate || todayDate) : undefined,
            updatedAt: Date.now()
          };
        }
        return item;
      })
    );
  }

  // Update quantity
  updateQuantity(id: string, newQty: number): void {
    const qty = Math.max(1, Math.round(newQty));
    this.updateItem(id, { quantity: qty });
  }

  // Delete item with undo support
  removeItem(id: string): void {
    const itemToDelete = this.items().find(i => i.id === id);
    if (itemToDelete) {
      this.lastRemovedItem.set(itemToDelete);
    }
    this.items.update(list => list.filter(item => item.id !== id));
  }

  // Undo delete
  undoLastRemoval(): boolean {
    const item = this.lastRemovedItem();
    if (item) {
      this.items.update(list => [item, ...list]);
      this.lastRemovedItem.set(null);
      return true;
    }
    return false;
  }

  // Clear list
  clearAll(): void {
    this.items.set([]);
  }

  // Reset to recommended starter list
  resetToRecommended(): void {
    this.items.set(this.createStarterList());
  }

  // Helper to resolve display name
  getItemDisplayName(item: ShoppingListItem): string {
    const lang = this.i18n.currentLang();
    if (item.catalogItemId) {
      const catItem = this.catalogService.getItemById(item.catalogItemId);
      if (catItem) {
        if (lang === 'ar') return catItem.nameAr;
        if (lang === 'en') return catItem.nameEn || catItem.nameFr;
        return catItem.nameFr;
      }
    }
    if (lang === 'ar') {
      return item.customNameAr || item.customNameEn || item.customNameFr || 'عنصر مخصص';
    }
    if (lang === 'en') {
      return item.customNameEn || item.customNameFr || item.customNameAr || 'Custom item';
    }
    return item.customNameFr || item.customNameEn || item.customNameAr || 'Article personnalisé';
  }

  // Helper to resolve item icon
  getItemIcon(item: ShoppingListItem): string {
    if (item.catalogItemId) {
      const catItem = this.catalogService.getItemById(item.catalogItemId);
      if (catItem?.icon) {
        return catItem.icon;
      }
    }
    const cat = this.catalogService.getCategoryById(item.categoryId);
    return cat?.icon || '🛍️';
  }

  // Computed signals
  readonly totalItemsCount = computed(() => this.items().length);

  readonly purchasedItemsCount = computed(() => this.items().filter(i => i.isPurchased).length);

  readonly remainingItemsCount = computed(() => this.items().filter(i => !i.isPurchased).length);

  readonly progressPercentage = computed(() => {
    const total = this.totalItemsCount();
    if (total === 0) return 0;
    return Math.round((this.purchasedItemsCount() / total) * 100);
  });

  // Estimated total: sum of (quantity * estimatedUnitPrice) for items with estimated price
  readonly totalEstimatedCost = computed(() => {
    return this.items().reduce((acc, item) => {
      if (item.estimatedUnitPrice !== undefined && item.estimatedUnitPrice !== null) {
        return acc + item.quantity * item.estimatedUnitPrice;
      }
      return acc;
    }, 0);
  });

  // Actual total: sum of (quantity * actualUnitPrice) for PURCHASED items with actual price
  readonly totalActualSpent = computed(() => {
    return this.items().reduce((acc, item) => {
      if (item.isPurchased && item.actualUnitPrice !== undefined && item.actualUnitPrice !== null) {
        return acc + item.quantity * item.actualUnitPrice;
      }
      return acc;
    }, 0);
  });

  // Total savings realized: when actual price was less than estimated on purchased items
  readonly totalSavings = computed(() => {
    return this.items().reduce((acc, item) => {
      if (
        item.isPurchased &&
        item.actualUnitPrice !== undefined &&
        item.estimatedUnitPrice !== undefined &&
        item.actualUnitPrice < item.estimatedUnitPrice
      ) {
        return acc + (item.estimatedUnitPrice - item.actualUnitPrice) * item.quantity;
      }
      return acc;
    }, 0);
  });

  readonly budgetSummary = computed<BudgetSummary>(() => {
    const targetBudget = this.preferencesService.preferences().totalBudget;
    const est = this.totalEstimatedCost();
    const act = this.totalActualSpent();
    const remainingBudget = targetBudget !== undefined ? targetBudget - act : undefined;

    const itemsWithEst = this.items().filter(i => i.estimatedUnitPrice !== undefined && i.estimatedUnitPrice !== null).length;
    const itemsWithAct = this.items().filter(i => i.actualUnitPrice !== undefined && i.actualUnitPrice !== null).length;

    return {
      totalTargetBudget: targetBudget,
      totalEstimatedCost: est,
      totalActualSpent: act,
      remainingBudget,
      totalSavings: this.totalSavings(),
      itemsWithEstimatedPrice: itemsWithEst,
      itemsWithActualPrice: itemsWithAct,
      totalItemsCount: this.totalItemsCount(),
      purchasedItemsCount: this.purchasedItemsCount(),
      remainingItemsCount: this.remainingItemsCount(),
      progressPercentage: this.progressPercentage()
    };
  });

  // Grouped by Category with category-level budget target support
  readonly categoryGroups = computed<CategoryGroup[]>(() => {
    const allCategories = this.catalogService.categories();
    const currentItems = this.items();
    const catBudgets = this.preferencesService.preferences().categoryBudgets || {};
    const groups: CategoryGroup[] = [];

    for (const cat of allCategories) {
      const catItems = currentItems.filter(i => i.categoryId === cat.id);
      if (catItems.length > 0) {
        const purchased = catItems.filter(i => i.isPurchased).length;
        const estTotal = catItems.reduce(
          (acc, i) => acc + (i.estimatedUnitPrice ? i.quantity * i.estimatedUnitPrice : 0),
          0
        );
        const actTotal = catItems.reduce(
          (acc, i) => acc + (i.isPurchased && i.actualUnitPrice ? i.quantity * i.actualUnitPrice : 0),
          0
        );

        groups.push({
          categoryId: cat.id,
          categoryNameFr: cat.nameFr,
          categoryNameAr: cat.nameAr,
          categoryNameEn: cat.nameEn || cat.nameFr,
          categoryIcon: cat.icon,
          items: catItems,
          totalItems: catItems.length,
          purchasedCount: purchased,
          estimatedTotal: estTotal,
          actualTotal: actTotal,
          targetBudget: catBudgets[cat.id],
          isExpanded: true
        });
      }
    }

    // Check if there are items with an unknown category (or custom category)
    const knownCatIds = new Set(allCategories.map(c => c.id));
    const orphanItems = currentItems.filter(i => !knownCatIds.has(i.categoryId));
    if (orphanItems.length > 0) {
      const purchased = orphanItems.filter(i => i.isPurchased).length;
      groups.push({
        categoryId: 'other',
        categoryNameFr: 'Autres articles',
        categoryNameAr: 'أغراض ومستلزمات أخرى',
        categoryIcon: '✨',
        items: orphanItems,
        totalItems: orphanItems.length,
        purchasedCount: purchased,
        estimatedTotal: orphanItems.reduce((acc, i) => acc + (i.estimatedUnitPrice ? i.quantity * i.estimatedUnitPrice : 0), 0),
        actualTotal: orphanItems.reduce((acc, i) => acc + (i.isPurchased && i.actualUnitPrice ? i.quantity * i.actualUnitPrice : 0), 0),
        targetBudget: catBudgets['other'],
        isExpanded: true
      });
    }

    return groups;
  });

  // Recently added items (top 5)
  readonly recentItems = computed<ShoppingListItem[]>(() => {
    return [...this.items()].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  });

  // Top expensive items in list (for budget optimization)
  readonly topExpenseItems = computed<ShoppingListItem[]>(() => {
    return [...this.items()]
      .filter(i => (i.actualUnitPrice || i.estimatedUnitPrice))
      .sort((a, b) => {
        const valA = (a.actualUnitPrice || a.estimatedUnitPrice || 0) * a.quantity;
        const valB = (b.actualUnitPrice || b.estimatedUnitPrice || 0) * b.quantity;
        return valB - valA;
      })
      .slice(0, 5);
  });

  // Generate shareable WhatsApp / Messenger plain text summary
  generateShareableSummary(): string {
    const lang = this.i18n.currentLang();
    const bride = this.preferencesService.preferences().brideName;
    const currency = this.i18n.currency();
    const date = new Date().toLocaleDateString(lang === 'ar' ? 'ar-TN' : 'fr-FR');

    let text = '';
    if (lang === 'ar') {
      text += `🕊️ *قائمة جهاز العروس — دارنا (Darna)*\n`;
      if (bride) text += `👰 العروس: ${bride}\n`;
      text += `📅 التاريخ: ${date}\n`;
      text += `📊 التقدم: ${this.purchasedItemsCount()} من أصل ${this.totalItemsCount()} (${this.progressPercentage()}%)\n`;
      text += `💸 المصاريف المسجلة: ${this.totalActualSpent().toLocaleString()} ${currency}\n\n`;
      text += `*أهم المشتريات المتبقية:*\n`;
      const remaining = this.items().filter(i => !i.isPurchased).slice(0, 10);
      remaining.forEach(item => {
        text += `▫️ ${this.getItemDisplayName(item)} (كمية: ${item.quantity})\n`;
      });
      if (this.remainingItemsCount() > 10) {
        text += `... و ${this.remainingItemsCount() - 10} أغراض أخرى.\n`;
      }
      text += `\n✨ تم إعدادها عبر تطبيق دارنا (Darna) — رفيق جهاز العروس في تونس`;
    } else {
      text += `🕊️ *Mon Trousseau de Mariage — Darna*\n`;
      if (bride) text += `👰 Mariée: ${bride}\n`;
      text += `📅 Date: ${date}\n`;
      text += `📊 Avancement: ${this.purchasedItemsCount()}/${this.totalItemsCount()} (${this.progressPercentage()}%)\n`;
      text += `💸 Dépenses réelles: ${this.totalActualSpent().toLocaleString()} ${currency}\n\n`;
      text += `*Prochains achats planifiés:*\n`;
      const remaining = this.items().filter(i => !i.isPurchased).slice(0, 10);
      remaining.forEach(item => {
        text += `▫️ ${this.getItemDisplayName(item)} (Qté: ${item.quantity})\n`;
      });
      if (this.remainingItemsCount() > 10) {
        text += `... et ${this.remainingItemsCount() - 10} autres articles.\n`;
      }
      text += `\n✨ Préparé avec amour sur Darna — L'application du trousseau tunisien`;
    }
    return text;
  }

  // Export data as JSON string for backup
  exportBackupJson(): string {
    const backup = {
      version: '1.2',
      exportDate: new Date().toISOString(),
      preferences: this.preferencesService.preferences(),
      items: this.items()
    };
    return JSON.stringify(backup, null, 2);
  }

  // Restore data from backup JSON
  importBackupJson(jsonStr: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonStr);
      if (data && Array.isArray(data.items)) {
        this.items.set(data.items);
        if (data.preferences) {
          this.preferencesService.savePreferences(data.preferences);
        }
        return { success: true, message: 'Restauration réussie' };
      }
      return { success: false, message: 'Format de fichier non valide' };
    } catch {
      return { success: false, message: 'Erreur lors de la lecture du fichier JSON' };
    }
  }
}
