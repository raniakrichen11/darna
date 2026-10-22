export interface CatalogSubcategory {
  id: string;
  nameFr: string;
  nameAr: string;
}

export interface CatalogCategory {
  id: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  icon: string;
  image?: string;
  subcategories: CatalogSubcategory[];
}

export interface CatalogItem {
  id: string;
  categoryId: string;
  subcategoryId: string;
  nameFr: string;
  nameAr: string;
  descriptionFr?: string;
  descriptionAr?: string;
  suggestedQuantity: number;
  estimatedUnitPrice?: number; // In TND
  icon?: string;
  isTraditional?: boolean;
}
