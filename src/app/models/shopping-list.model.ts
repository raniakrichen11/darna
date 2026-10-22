export interface ShoppingListItem {
  id: string;
  catalogItemId?: string;
  categoryId: string;
  subcategoryId?: string;
  customNameFr?: string;
  customNameAr?: string;
  quantity: number;
  estimatedUnitPrice?: number; // In TND
  actualUnitPrice?: number;    // In TND
  isPurchased: boolean;
  notes?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface CategoryGroup {
  categoryId: string;
  categoryNameFr: string;
  categoryNameAr: string;
  categoryIcon: string;
  items: ShoppingListItem[];
  totalItems: number;
  purchasedCount: number;
  estimatedTotal: number;
  actualTotal: number;
  isExpanded: boolean;
}

export interface BudgetSummary {
  totalTargetBudget?: number;
  totalEstimatedCost: number;
  totalActualSpent: number;
  remainingBudget?: number;
  itemsWithEstimatedPrice: number;
  itemsWithActualPrice: number;
  totalItemsCount: number;
  purchasedItemsCount: number;
  remainingItemsCount: number;
  progressPercentage: number;
}
