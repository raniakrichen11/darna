export interface CatalogSubcategory {
  id: string;
  nameFr: string;
  nameAr: string;
  nameEn?: string;
}

export interface CatalogCategory {
  id: string;
  nameFr: string;
  nameAr: string;
  nameEn?: string;
  descriptionFr: string;
  descriptionAr: string;
  descriptionEn?: string;
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
  nameEn?: string;
  descriptionFr?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  suggestedQuantity: number;
  estimatedUnitPrice?: number; // In TND
  icon?: string;
  image?: string;
  isTraditional?: boolean;
}
