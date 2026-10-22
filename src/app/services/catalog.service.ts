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

  getItemImage(item: CatalogItem): string {
    if (item.image) {
      return item.image;
    }
    // Specific iconic Tunisian items
    if (
      item.id === 'cui-001' ||
      item.nameFr.toLowerCase().includes('couscoussier') ||
      item.nameFr.toLowerCase().includes('keskas')
    ) {
      return 'assets/item_couscoussier.jpg';
    }
    if (
      item.categoryId === 'vaisselle-service' ||
      item.id === 'cui-002' ||
      item.nameFr.toLowerCase().includes('tajine') ||
      item.nameFr.toLowerCase().includes('service de table')
    ) {
      return 'assets/item_tableware.jpg';
    }
    if (
      item.categoryId === 'trousseau-mariee' ||
      item.categoryId === 'vetements-accessoires' ||
      item.nameFr.toLowerCase().includes('parfum') ||
      item.nameFr.toLowerCase().includes('bijoux')
    ) {
      return 'assets/item_bridal_set.jpg';
    }
    if (item.categoryId === 'salle-de-bain') {
      return 'assets/cat_bath.jpg';
    }
    if (item.categoryId === 'chambre-literie' || item.categoryId === 'linge-maison') {
      return 'assets/cat_bedroom.jpg';
    }
    if (item.categoryId === 'cuisine-ustensiles') {
      return 'assets/cat_kitchen.jpg';
    }
    const cat = this.getCategoryById(item.categoryId);
    return cat?.image || 'assets/cat_kitchen.jpg';
  }
}
