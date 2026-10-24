export type ItemPriority = 'essential' | 'useful' | 'optional';

export interface ShoppingListItem {
  id: string;
  catalogItemId?: string;
  categoryId: string;
  subcategoryId?: string;
  customNameFr?: string;
  customNameAr?: string;
  customNameEn?: string;
  quantity: number;
  estimatedUnitPrice?: number; // In TND
  actualUnitPrice?: number;    // In TND
  isPurchased: boolean;
  priority?: ItemPriority;     // 'essential' | 'useful' | 'optional'
  purchaseLocation?: string;   // e.g. "Monoprix", "Souk El Grana", "Darty"
  purchaseDate?: string;       // YYYY-MM-DD
  targetDate?: string;         // YYYY-MM-DD
  notes?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface CategoryGroup {
  categoryId: string;
  categoryNameFr: string;
  categoryNameAr: string;
  categoryNameEn?: string;
  categoryIcon: string;
  items: ShoppingListItem[];
  totalItems: number;
  purchasedCount: number;
  estimatedTotal: number;
  actualTotal: number;
  targetBudget?: number;
  isExpanded: boolean;
}

export interface BudgetSummary {
  totalTargetBudget?: number;
  totalEstimatedCost: number;
  totalActualSpent: number;
  remainingBudget?: number;
  totalSavings?: number;
  itemsWithEstimatedPrice: number;
  itemsWithActualPrice: number;
  totalItemsCount: number;
  purchasedItemsCount: number;
  remainingItemsCount: number;
  progressPercentage: number;
}

