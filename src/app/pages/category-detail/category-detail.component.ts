import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { CatalogItem } from '../../models/catalog.model';
import { ArticlePreviewModalComponent } from '../../components/article-preview-modal/article-preview-modal.component';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ArticlePreviewModalComponent],
  template: `
    <div class="category-detail-page" [attr.dir]="i18n.dir()">
      <!-- Back Link -->
      <div class="breadcrumb-bar">
        <a routerLink="/catalog" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>{{ i18n.t('catalog.back_to_categories') }}</span>
        </a>
      </div>

      @if (category(); as cat) {
        <!-- Editorial Banner Frame -->
        <div class="cat-editorial-hero">
          @if (cat.image) {
            <div class="hero-bg-container">
              <img [src]="cat.image" [alt]="cat.nameFr" class="hero-bg-img" />
              <div class="hero-overlay"></div>
            </div>
          }

          <div class="hero-text-content">
            <span class="cat-symbol">{{ cat.icon }}</span>
            <h1>{{ catalogService.getCategoryName(cat) }}</h1>
            <p>{{ catalogService.getCategoryDesc(cat) }}</p>
            <div class="cat-tally">
              {{ categoryItems().length }} {{ i18n.t('catalog.items_count') }}
            </div>
          </div>
        </div>

        <!-- Subcategory Filter Pills -->
        @if (cat.subcategories && cat.subcategories.length > 0) {
          <div class="subcat-filter-bar">
            <button
              type="button"
              class="subcat-pill"
              [class.active]="selectedSubcategory() === 'all'"
              (click)="selectedSubcategory.set('all')"
            >
              <span>{{ i18n.t('catalog.all_categories') }}</span>
              <span class="subcat-badge-count">{{ categoryItems().length }}</span>
            </button>
            @for (sub of cat.subcategories; track sub.id) {
              <button
                type="button"
                class="subcat-pill"
                [class.active]="selectedSubcategory() === sub.id"
                (click)="selectedSubcategory.set(sub.id)"
              >
                <span>{{ catalogService.getSubcategoryName(sub) }}</span>
                <span class="subcat-badge-count">{{ getSubcategoryCount(cat.id, sub.id) }}</span>
              </button>
            }
          </div>
        }

        <!-- In-Category Search & Controls Bar -->
        <div class="category-controls-bar">
          <div class="cat-search-box">
            <svg class="search-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              [placeholder]="i18n.t('catalog.in_category_search')"
              class="cat-search-input"
            />
            @if (searchQuery()) {
              <button type="button" class="clear-btn" (click)="searchQuery.set('')">✕</button>
            }
          </div>

          <div class="controls-actions">
            <!-- Traditional toggle -->
            <button
              type="button"
              class="filter-toggle-btn"
              [class.active]="onlyTraditional()"
              (click)="onlyTraditional.set(!onlyTraditional())"
            >
              <span>{{ i18n.t('catalog.filter_traditional') }}</span>
            </button>

            <!-- Sort selector -->
            <div class="sort-selector-wrap">
              <label class="sort-label">{{ i18n.t('catalog.sort_by') }}</label>
              <select [(ngModel)]="sortBy" class="sort-select">
                <option value="default">{{ i18n.t('sort.default') }}</option>
                <option value="price_asc">{{ i18n.t('sort.price_asc') }}</option>
                <option value="price_desc">{{ i18n.t('sort.price_desc') }}</option>
                <option value="name">{{ i18n.t('sort.name') }}</option>
              </select>
            </div>
          </div>
        </div>

        @if (filteredCategoryItems().length === 0) {
          <div class="no-results-box card">
            <span class="no-res-icon">🔍</span>
            <h3>{{ i18n.t('catalog.no_results') }}</h3>
            <p>{{ i18n.t('catalog.search_empty_hint') }}</p>
            <button type="button" class="btn btn-outline btn-sm" (click)="resetFilters()">
              {{ i18n.t('catalog.all_categories') }}
            </button>
          </div>
        }

        <!-- Items Boutique Grid -->
        <div class="items-boutique-grid">
          @for (item of filteredCategoryItems(); track item.id) {
            <div class="boutique-item-card card">
              <!-- Real image preview header -->
              <div class="item-card-image-box" (click)="openArticlePreview(item)" role="button" tabindex="0">
                <img
                  [src]="catalogService.getItemImage(item)"
                  [alt]="catalogService.getItemName(item)"
                  class="item-card-real-img"
                />
                <div class="image-preview-overlay">
                  <span class="preview-badge">🔍 {{ i18n.currentLang() === 'ar' ? 'عرض الصورة والتفاصيل' : (i18n.currentLang() === 'en' ? 'Photo Preview & Details' : 'Aperçu & Détails') }}</span>
                </div>
                @if (item.isTraditional) {
                  <span class="badge-traditional-corner">
                    🇹🇳 {{ i18n.t('catalog.traditional_label') }}
                  </span>
                }
              </div>

              <div class="item-card-header">
                <div class="item-icon-circle">{{ item.icon || '🛍️' }}</div>
                <div class="item-badges-column">
                  @if (shoppingList.isCatalogItemInList(item.id)) {
                    <span class="badge badge-success">
                      ✓ {{ i18n.t('action.added') }}
                    </span>
                  }
                </div>
              </div>

              <h3 class="item-card-title clickable-title" (click)="openArticlePreview(item)">
                {{ catalogService.getItemName(item) }}
              </h3>

              <p class="item-card-desc">
                {{ catalogService.getItemDesc(item) }}
              </p>

              <div class="item-card-details">
                <div class="detail-row">
                  <span class="detail-label">{{ i18n.t('catalog.suggested_qty') }}</span>
                  <strong class="detail-val">{{ item.suggestedQuantity }}</strong>
                </div>

                <div class="detail-row">
                  <span class="detail-label">{{ i18n.t('catalog.estimated_price') }}</span>
                  <strong class="detail-val price-accent">
                    {{ item.estimatedUnitPrice ? (item.estimatedUnitPrice | number:'1.0-2') + ' ' + i18n.currency() : i18n.t('list.price_unknown') }}
                  </strong>
                </div>
              </div>

              <div class="item-card-action">
                <button
                  type="button"
                  class="btn w-full"
                  [class.btn-primary]="!shoppingList.isCatalogItemInList(item.id)"
                  [class.btn-subtle]="shoppingList.isCatalogItemInList(item.id)"
                  (click)="onAddItem(item)"
                >
                  @if (shoppingList.isCatalogItemInList(item.id)) {
                    <span>✓ {{ i18n.t('action.added') }} (+1)</span>
                  } @else {
                    <span>+ {{ i18n.t('action.add_to_list') }}</span>
                  }
                </button>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="card not-found-box">
          <h2>{{ i18n.currentLang() === 'ar' ? 'القسم غير موجود' : 'Catégorie introuvable' }}</h2>
          <a routerLink="/catalog" class="btn btn-primary">{{ i18n.currentLang() === 'ar' ? 'العودة إلى الدليل' : 'Retour au catalogue' }}</a>
        </div>
      }

      <!-- Article Photo Preview Modal -->
      <app-article-preview-modal
        [item]="previewItem()"
        (close)="closeArticlePreview()"
        (addToShoppingList)="onAddItem($event)"
      ></app-article-preview-modal>
    </div>
  `,
  styles: [`
    .category-detail-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .breadcrumb-bar {
      .back-link {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-primary);
        display: inline-flex;
        align-items: center;
        gap: 8px;
        transition: transform 0.2s;

        &:hover {
          transform: translateX(-3px);
        }
      }
    }

    /* Editorial Hero */
    .cat-editorial-hero {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
      min-height: 220px;
      display: flex;
      align-items: center;
      padding: var(--space-xl);
      background: var(--color-bg-sand);

      .hero-bg-container {
        position: absolute;
        inset: 0;

        .hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(48, 41, 39, 0.75) 0%, rgba(113, 59, 72, 0.8) 100%);
        }
      }

      .hero-text-content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 640px;

        .cat-symbol {
          font-size: 2.2rem;
          margin-bottom: 2px;
        }

        h1 {
          color: #FFFFFF;
          margin: 0;
          font-size: 2.2rem;
        }

        p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .cat-tally {
          display: inline-flex;
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.35);
          margin-top: 6px;
        }
      }
    }

    /* Subcategory Filter Pills */
    .subcat-filter-bar {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 6px;

      .subcat-pill {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        padding: 8px 16px;
        border-radius: var(--radius-full);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-text-main);
        transition: all 0.2s;

        &:hover {
          border-color: var(--color-primary);
        }

        &.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(113, 59, 72, 0.22);

          .subcat-badge-count {
            background: rgba(255, 255, 255, 0.25);
            color: #FFFFFF;
          }
        }

        .subcat-badge-count {
          font-size: 0.72rem;
          padding: 2px 6px;
          border-radius: var(--radius-full);
          background: var(--color-bg-sand);
          color: var(--color-primary);
          font-weight: 700;
        }
      }
    }

    /* In-Category Controls Bar */
    .category-controls-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 12px 16px;
      flex-wrap: wrap;

      .cat-search-box {
        position: relative;
        flex: 1;
        min-width: 220px;
        display: flex;
        align-items: center;

        .search-svg {
          position: absolute;
          inset-inline-start: 12px;
          color: var(--color-text-muted);
          pointer-events: none;
        }

        .cat-search-input {
          width: 100%;
          padding: 8px 36px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          outline: none;
          background: var(--color-surface);

          &:focus {
            border-color: var(--color-primary);
            background: #FFFFFF;
          }
        }

        .clear-btn {
          position: absolute;
          inset-inline-end: 10px;
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 0.85rem;
        }
      }

      .controls-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;

        .filter-toggle-btn {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: #FFFFFF;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-main);
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            border-color: var(--color-primary);
          }

          &.active {
            background: rgba(113, 59, 72, 0.1);
            border-color: var(--color-primary);
            color: var(--color-primary);
          }
        }

        .sort-selector-wrap {
          display: inline-flex;
          align-items: center;
          gap: 6px;

          .sort-label {
            font-size: 0.8rem;
            color: var(--color-text-muted);
            white-space: nowrap;
          }

          .sort-select {
            padding: 6px 12px;
            border-radius: var(--radius-md);
            border: 1px solid var(--color-border);
            font-size: 0.82rem;
            background: #FFFFFF;
            color: var(--color-text-main);
            outline: none;
            cursor: pointer;

            &:focus {
              border-color: var(--color-primary);
            }
          }
        }
      }
    }

    .no-results-box {
      text-align: center;
      padding: var(--space-2xl);
      background: #FFFFFF;

      .no-res-icon {
        font-size: 2.2rem;
        margin-bottom: 12px;
        display: block;
      }

      h3 {
        margin-bottom: 8px;
      }

      p {
        color: var(--color-text-muted);
        margin-bottom: var(--space-md);
      }
    }

    /* Items Grid */
    .items-boutique-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-lg);
    }

    .boutique-item-card {
      display: flex;
      flex-direction: column;
      padding: var(--space-lg);
      gap: 12px;

      .item-card-image-box {
        position: relative;
        width: 100%;
        height: 180px;
        border-radius: var(--radius-md);
        overflow: hidden;
        background: var(--color-bg-sand);
        cursor: pointer;
        border: 1px solid var(--color-border);
        margin-bottom: 4px;

        .item-card-real-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        &:hover .item-card-real-img {
          transform: scale(1.06);
        }

        .image-preview-overlay {
          position: absolute;
          inset: 0;
          background: rgba(48, 41, 39, 0.35);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;

          .preview-badge {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(4px);
            color: var(--color-primary);
            font-size: 0.78rem;
            font-weight: 700;
            padding: 6px 14px;
            border-radius: var(--radius-full);
            box-shadow: var(--shadow-sm);
          }
        }

        &:hover .image-preview-overlay {
          opacity: 1;
        }

        .badge-traditional-corner {
          position: absolute;
          top: 10px;
          inset-inline-start: 10px;
          background: rgba(113, 59, 72, 0.9);
          backdrop-filter: blur(4px);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
      }

      .clickable-title {
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: var(--color-primary);
        }
      }

      .item-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .item-icon-circle {
          font-size: 1.85rem;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--color-surface-subtle);
          border: 1px solid var(--color-border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-badges-column {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
      }

      .item-card-title {
        font-size: 1.05rem;
        color: var(--color-text-main);
        line-height: 1.35;
        min-height: 2.8rem;
      }

      .item-card-desc {
        font-size: 0.84rem;
        color: var(--color-text-muted);
        line-height: 1.5;
        min-height: 2.5rem;
      }

      .item-card-details {
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border-subtle);
        border-radius: var(--radius-md);
        padding: 10px 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.84rem;

          .detail-label {
            color: var(--color-text-muted);
          }

          .detail-val.price-accent {
            color: var(--color-primary);
            font-weight: 700;
          }
        }
      }

      .item-card-action {
        margin-top: auto;
        padding-top: 6px;

        .w-full {
          width: 100%;
        }
      }
    }

    .not-found-box {
      text-align: center;
      padding: var(--space-2xl);
    }

    /* Mobile Responsive Enhancements */
    @media (max-width: 600px) {
      .category-detail-page {
        gap: 14px;
      }

      .cat-editorial-hero {
        min-height: 140px;
        padding: 14px 12px;

        .hero-text-content {
          gap: 4px;

          .cat-symbol {
            font-size: 1.6rem;
          }

          h1 {
            font-size: 1.5rem;
          }

          p {
            font-size: 0.86rem;
            line-height: 1.45;
          }

          .cat-tally {
            font-size: 0.74rem;
            padding: 3px 8px;
          }
        }
      }

      .items-boutique-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .boutique-item-card {
        padding: 12px;
        gap: 8px;

        .item-card-image-box {
          height: 140px;
        }

        .item-card-title {
          min-height: unset;
          font-size: 0.94rem;
        }

        .item-card-desc {
          min-height: unset;
          font-size: 0.84rem;
        }
      }

      .subcat-filter-bar {
        padding-bottom: 4px;
      }
    }
  `]
})
export class CategoryDetailComponent {
  private route = inject(ActivatedRoute);
  catalogService = inject(CatalogService);
  shoppingList = inject(ShoppingListService);
  i18n = inject(I18nService);
  toast = inject(ToastService);

  categoryId = signal<string>('');
  selectedSubcategory = signal<string>('all');
  searchQuery = signal<string>('');
  onlyTraditional = signal<boolean>(false);
  sortBy = signal<string>('default');
  previewItem = signal<CatalogItem | undefined>(undefined);

  openArticlePreview(item: CatalogItem): void {
    this.previewItem.set(item);
  }

  closeArticlePreview(): void {
    this.previewItem.set(undefined);
  }

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('categoryId') || '';
      this.categoryId.set(id);
      this.selectedSubcategory.set('all');
      this.searchQuery.set('');
      this.onlyTraditional.set(false);
      this.sortBy.set('default');
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    this.route.queryParamMap.subscribe(qParams => {
      const sub = qParams.get('subcategory');
      if (sub) {
        this.selectedSubcategory.set(sub);
      }
    });
  }

  category = computed(() => this.catalogService.getCategoryById(this.categoryId()));

  categoryItems = computed(() => this.catalogService.getItemsByCategory(this.categoryId()));

  filteredCategoryItems = computed(() => {
    const sub = this.selectedSubcategory();
    const q = this.searchQuery().trim().toLowerCase();
    const trad = this.onlyTraditional();
    const sort = this.sortBy();
    let items = this.categoryItems();

    if (sub !== 'all') {
      items = items.filter(i => i.subcategoryId === sub);
    }
    if (trad) {
      items = items.filter(i => i.isTraditional);
    }
    if (q) {
      items = items.filter(i => {
        const nFr = i.nameFr.toLowerCase();
        const nAr = i.nameAr;
        const nEn = (i.nameEn || '').toLowerCase();
        const dFr = (i.descriptionFr || '').toLowerCase();
        const dAr = i.descriptionAr || '';
        return nFr.includes(q) || nAr.includes(q) || nEn.includes(q) || dFr.includes(q) || dAr.includes(q);
      });
    }

    if (sort === 'price_asc') {
      items = [...items].sort((a, b) => (a.estimatedUnitPrice || 0) - (b.estimatedUnitPrice || 0));
    } else if (sort === 'price_desc') {
      items = [...items].sort((a, b) => (b.estimatedUnitPrice || 0) - (a.estimatedUnitPrice || 0));
    } else if (sort === 'name') {
      const isAr = this.i18n.currentLang() === 'ar';
      items = [...items].sort((a, b) => isAr ? a.nameAr.localeCompare(b.nameAr) : a.nameFr.localeCompare(b.nameFr));
    }
    return items;
  });

  getSubcategoryCount(catId: string, subId: string): number {
    return this.categoryItems().filter(i => i.subcategoryId === subId).length;
  }

  resetFilters(): void {
    this.selectedSubcategory.set('all');
    this.searchQuery.set('');
    this.onlyTraditional.set(false);
    this.sortBy.set('default');
  }

  onAddItem(item: CatalogItem): void {
    const result = this.shoppingList.addCatalogItem(item);
    const itemName = this.i18n.currentLang() === 'ar' ? item.nameAr : item.nameFr;
    if (result.added) {
      this.toast.show(
        this.i18n.currentLang() === 'ar'
          ? `تمت إضافة «${itemName}» إلى قائمتك ✨`
          : `« ${itemName} » ajouté à votre trousseau ✨`
      );
    } else {
      this.toast.show(
        this.i18n.currentLang() === 'ar'
          ? `تمت زيادة الكمية: ${result.item.quantity}`
          : `Quantité augmentée : ${result.item.quantity}`
      );
    }
  }
}
