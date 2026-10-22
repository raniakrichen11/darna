import { Injectable, computed, signal, inject } from '@angular/core';
import { CATALOG_CATEGORIES, CATALOG_ITEMS } from '../data/catalog.data';
import { CatalogCategory, CatalogItem } from '../models/catalog.model';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private i18n = inject(I18nService);

  readonly categories = signal<CatalogCategory[]>(CATALOG_CATEGORIES);
  readonly items = signal<CatalogItem[]>(CATALOG_ITEMS);

  getCategoryById(id: string): CatalogCategory | undefined {
    return this.categories().find(c => c.id === id);
  }

  getItemById(id: string): CatalogItem | undefined {
    return this.items().find(i => i.id === id);
  }

  getItemsByCategory(categoryId: string): CatalogItem[] {
    return this.items().filter(i => i.categoryId === categoryId);
  }

  searchItems(query: string, categoryId?: string): CatalogItem[] {
    const q = query.trim().toLowerCase();
    let pool = this.items();
    if (categoryId && categoryId !== 'all') {
      pool = pool.filter(i => i.categoryId === categoryId);
    }
    if (!q) {
      return pool;
    }
    return pool.filter(item => {
      const matchNameFr = item.nameFr.toLowerCase().includes(q);
      const matchNameAr = item.nameAr.includes(q);
      const matchDescFr = item.descriptionFr ? item.descriptionFr.toLowerCase().includes(q) : false;
      const matchDescAr = item.descriptionAr ? item.descriptionAr.includes(q) : false;
      return matchNameFr || matchNameAr || matchDescFr || matchDescAr;
    });
  }

  getCategoryItemCount(categoryId: string): number {
    return this.items().filter(i => i.categoryId === categoryId).length;
  }
}
