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

  private normalizeCategoryId(id: string): string {
    const raw = (id || '').trim().toLowerCase();
    const aliasMap: Record<string, string> = {
      'cat-cuisine': 'cuisine-ustensiles',
      'cuisine': 'cuisine-ustensiles',
      'kitchen': 'cuisine-ustensiles',
      'cat-vaisselle': 'vaisselle-service',
      'vaisselle': 'vaisselle-service',
      'tableware': 'vaisselle-service',
      'cat-chambre': 'chambre-literie',
      'chambre': 'chambre-literie',
      'bedroom': 'chambre-literie',
      'cat-bain': 'salle-de-bain',
      'bain': 'salle-de-bain',
      'bath': 'salle-de-bain',
      'cat-salon': 'salon-decoration',
      'salon': 'salon-decoration',
      'living': 'salon-decoration',
      'cat-electro': 'electromenager',
      'electro': 'electromenager',
      'appliances': 'electromenager',
      'cat-vetements': 'vetements-accessoires',
      'vetements': 'vetements-accessoires',
      'apparel': 'vetements-accessoires',
      'cat-trousseau': 'trousseau-mariee',
      'trousseau': 'trousseau-mariee',
      'bridal': 'trousseau-mariee'
    };
    return aliasMap[raw] || raw;
  }

  getCategoryById(id: string): CatalogCategory | undefined {
    const targetId = this.normalizeCategoryId(id);
    return this.categories().find(c => c.id === targetId || c.id === id);
  }

  getItemById(id: string): CatalogItem | undefined {
    return this.items().find(i => i.id === id);
  }

  getItemsByCategory(categoryId: string): CatalogItem[] {
    const targetId = this.normalizeCategoryId(categoryId);
    return this.items().filter(i => i.categoryId === targetId || i.categoryId === categoryId);
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
      const matchNameEn = item.nameEn ? item.nameEn.toLowerCase().includes(q) : false;
      const matchDescFr = item.descriptionFr ? item.descriptionFr.toLowerCase().includes(q) : false;
      const matchDescAr = item.descriptionAr ? item.descriptionAr.includes(q) : false;
      const matchDescEn = item.descriptionEn ? item.descriptionEn.toLowerCase().includes(q) : false;
      return matchNameFr || matchNameAr || matchNameEn || matchDescFr || matchDescAr || matchDescEn;
    });
  }

  getCategoryItemCount(categoryId: string): number {
    return this.items().filter(i => i.categoryId === categoryId).length;
  }

  getCategoryName(cat: CatalogCategory | undefined): string {
    if (!cat) return '';
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return cat.nameAr;
    if (lang === 'en') return cat.nameEn || cat.nameFr;
    return cat.nameFr;
  }

  getCategoryDesc(cat: CatalogCategory | undefined): string {
    if (!cat) return '';
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return cat.descriptionAr;
    if (lang === 'en') return cat.descriptionEn || cat.descriptionFr;
    return cat.descriptionFr;
  }

  getItemName(item: CatalogItem | undefined): string {
    if (!item) return '';
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return item.nameAr;
    if (lang === 'en') return item.nameEn || item.nameFr;
    return item.nameFr;
  }

  getItemDesc(item: CatalogItem | undefined): string {
    if (!item) return '';
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return item.descriptionAr || '';
    if (lang === 'en') return item.descriptionEn || item.descriptionFr || '';
    return item.descriptionFr || '';
  }

  getSubcategoryName(sub: { nameFr: string; nameAr: string; nameEn?: string } | undefined): string {
    if (!sub) return '';
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return sub.nameAr;
    if (lang === 'en') return sub.nameEn || sub.nameFr;
    return sub.nameFr;
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
    if (item.categoryId === 'vaisselle-service' && (item.id === 'cui-002' || item.nameFr.toLowerCase().includes('tajine') || item.nameFr.toLowerCase().includes('service de table'))) {
      return 'assets/item_tableware.jpg';
    }
    if (item.categoryId === 'trousseau-mariee' && (item.nameFr.toLowerCase().includes('parfum') || item.nameFr.toLowerCase().includes('bijoux') || item.nameFr.toLowerCase().includes('coffret'))) {
      return 'assets/item_bridal_set.jpg';
    }
    const cat = this.getCategoryById(item.categoryId);
    return cat?.image || 'assets/cat_kitchen.jpg';
  }
}
