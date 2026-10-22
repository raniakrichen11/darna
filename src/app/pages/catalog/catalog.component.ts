import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { CatalogItem } from '../../models/catalog.model';
import { ArticlePreviewModalComponent } from '../../components/article-preview-modal/article-preview-modal.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ArticlePreviewModalComponent],
  template: `
    <div class="catalog-page" [attr.dir]="i18n.dir()">
      <!-- Editorial Header -->
      <header class="catalog-header">
        <div class="header-intro">
          <div class="catalog-eyebrow">
            <span>{{ i18n.t('app.culture_badge') }}</span>
          </div>
          <h1>{{ i18n.t('catalog.title') }}</h1>
          <p>{{ i18n.t('catalog.subtitle') }}</p>
        </div>

        <!-- Understated Search & Category Filter Bar -->
        <div class="catalog-search-bar">
          <div class="search-input-box">
            <svg class="search-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              [placeholder]="i18n.t('action.search_placeholder')"
              class="minimal-search-input"
            />
            @if (searchQuery()) {
              <button type="button" class="clear-search-btn" (click)="searchQuery.set('')" [title]="i18n.currentLang() === 'ar' ? 'مسح' : 'Effacer'">✕</button>
            }
          </div>

          <!-- Category Filter Pills (Horizontal Scroll) -->
          <div class="category-pills-row">
            <button
              type="button"
              class="pill-btn"
              [class.active]="selectedCategory() === 'all'"
              (click)="selectedCategory.set('all')"
            >
              {{ i18n.t('catalog.all_categories') }}
            </button>
            @for (cat of catalogService.categories(); track cat.id) {
              <button
                type="button"
                class="pill-btn"
                [class.active]="selectedCategory() === cat.id"
                (click)="selectedCategory.set(cat.id)"
              >
                <span class="pill-icon">{{ cat.icon }}</span>
                <span>{{ i18n.currentLang() === 'ar' ? cat.nameAr : cat.nameFr }}</span>
              </button>
            }
          </div>
        </div>
      </header>

      <!-- Category Boutique Showcase (When browsing 'all' and no search) -->
      @if (!searchQuery() && selectedCategory() === 'all') {
        <section class="boutique-showcase-section">
          <div class="categories-editorial-grid">
            @for (cat of catalogService.categories(); track cat.id) {
              <div class="boutique-category-card">
                <div class="cat-image-container">
                  <img
                    [src]="cat.image || 'assets/cat_kitchen.jpg'"
                    [alt]="cat.nameFr"
                    class="category-hero-img"
                    loading="lazy"
                  />
                  <div class="cat-gradient-scrim"></div>
                  <div class="cat-floating-info">
                    <span class="cat-emblem-badge">{{ cat.icon }}</span>
                    <h2>{{ i18n.currentLang() === 'ar' ? cat.nameAr : cat.nameFr }}</h2>
                    <span class="cat-count-pill">
                      {{ catalogService.getCategoryItemCount(cat.id) }} {{ i18n.t('catalog.items_count') }}
                    </span>
                  </div>
                  <a [routerLink]="['/catalog', cat.id]" class="view-category-overlay-link" [attr.aria-label]="cat.nameFr"></a>
                </div>

                <div class="cat-footer-preview">
                  <p class="cat-desc">{{ i18n.currentLang() === 'ar' ? cat.descriptionAr : cat.descriptionFr }}</p>
                  
                  <!-- Curated item snippets -->
                  <div class="snippets-list">
                    @for (item of getPreviewItems(cat.id); track item.id) {
                      <div class="snippet-item" (click)="openArticlePreview(item)">
                        <div class="snippet-thumb-wrap">
                          <img [src]="catalogService.getItemImage(item)" class="snippet-mini-img" [alt]="item.nameFr" />
                        </div>
                        <div class="snippet-info">
                          <span class="snippet-name">{{ i18n.currentLang() === 'ar' ? item.nameAr : item.nameFr }}</span>
                          @if (item.estimatedUnitPrice) {
                            <span class="snippet-price">{{ item.estimatedUnitPrice }} {{ i18n.currency() }}</span>
                          }
                        </div>
                        <button
                          type="button"
                          class="add-circle-btn"
                          [class.in-list]="shoppingList.isCatalogItemInList(item.id)"
                          (click)="$event.stopPropagation(); onAddItem(item)"
                          [title]="shoppingList.isCatalogItemInList(item.id) ? i18n.t('action.added') : i18n.t('action.add')"
                        >
                          @if (shoppingList.isCatalogItemInList(item.id)) {
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          } @else {
                            +
                          }
                        </button>
                      </div>
                    }
                  </div>

                  <a [routerLink]="['/catalog', cat.id]" class="explore-cat-btn">
                    <span>{{ i18n.currentLang() === 'ar' ? 'تصفح جميع عناصر القسم' : 'Explorer tous les articles' }}</span>
                    <span>{{ i18n.isRtl() ? '←' : '→' }}</span>
                  </a>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Filtered Items List (When searching or category selected) -->
      @if (searchQuery() || selectedCategory() !== 'all') {
        <section class="catalog-items-section">
          <div class="results-header">
            <span class="results-tally">
              <strong>{{ filteredItems().length }}</strong> {{ i18n.t('catalog.items_count') }}
            </span>
          </div>

          @if (filteredItems().length === 0) {
            <div class="no-results-editorial card">
              <span class="no-res-icon">🔍</span>
              <h3>{{ i18n.t('catalog.no_results') }}</h3>
              <p>{{ i18n.t('catalog.search_empty_hint') }}</p>
              <button type="button" class="btn btn-outline btn-sm" (click)="resetFilters()">
                {{ i18n.t('catalog.all_categories') }}
              </button>
            </div>
          } @else {
            <div class="items-boutique-grid">
              @for (item of filteredItems(); track item.id) {
                <div class="boutique-item-card card">
                  <!-- Real image preview header -->
                  <div class="item-card-image-box" (click)="openArticlePreview(item)" role="button" tabindex="0">
                    <img
                      [src]="catalogService.getItemImage(item)"
                      [alt]="i18n.currentLang() === 'ar' ? item.nameAr : item.nameFr"
                      class="item-card-real-img"
                    />
                    <div class="image-preview-overlay">
                      <span class="preview-badge">🔍 {{ i18n.currentLang() === 'ar' ? 'عرض الصورة والتفاصيل' : 'Aperçu & Détails' }}</span>
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
                    {{ i18n.currentLang() === 'ar' ? item.nameAr : item.nameFr }}
                  </h3>

                  <p class="item-card-desc">
                    {{ i18n.currentLang() === 'ar' ? item.descriptionAr : item.descriptionFr }}
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
          }
        </section>
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
    .catalog-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    /* Header */
    .catalog-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);

      .catalog-eyebrow {
        font-size: 0.76rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-primary);
        font-weight: 700;
        margin-bottom: 6px;
      }

      h1 {
        margin-bottom: 8px;
      }

      p {
        font-size: 1.05rem;
        color: var(--color-text-muted);
        max-width: 620px;
        line-height: 1.6;
      }
    }

    /* Search & Filters */
    .catalog-search-bar {
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: #FFFFFF;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      box-shadow: var(--shadow-xs);
    }

    .search-input-box {
      position: relative;
      display: flex;
      align-items: center;

      .search-svg {
        position: absolute;
        inset-inline-start: 16px;
        color: var(--color-text-muted);
        pointer-events: none;
      }

      .minimal-search-input {
        width: 100%;
        padding: 12px 48px;
        border: 1px solid var(--color-border-subtle);
        border-radius: var(--radius-full);
        background: var(--color-bg);
        font-size: 0.95rem;
        color: var(--color-text-main);
        outline: none;
        transition: all 0.2s;

        &:focus {
          border-color: var(--color-primary);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(113, 59, 72, 0.1);
        }
      }

      .clear-search-btn {
        position: absolute;
        inset-inline-end: 14px;
        color: var(--color-text-muted);
        font-size: 0.9rem;
        padding: 4px;
        border-radius: 50%;

        &:hover {
          color: var(--color-text-main);
        }
      }
    }

    .category-pills-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: thin;

      .pill-btn {
        white-space: nowrap;
        padding: 8px 16px;
        border-radius: var(--radius-full);
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border);
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-text-main);
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;

        &:hover {
          background: var(--color-surface-hover);
          border-color: var(--color-border-strong);
        }

        &.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(113, 59, 72, 0.22);
        }
      }
    }

    /* Boutique Categories Grid */
    .categories-editorial-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-lg);

      @media (min-width: 860px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .boutique-category-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-xs);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
      }

      .cat-image-container {
        position: relative;
        height: 180px;
        overflow: hidden;
        background: var(--color-bg-sand);

        .category-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cat-gradient-scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(48, 41, 39, 0.1) 0%, rgba(48, 41, 39, 0.65) 100%);
        }

        .cat-floating-info {
          position: absolute;
          bottom: 16px;
          inset-inline-start: 16px;
          inset-inline-end: 16px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          .cat-emblem-badge {
            font-size: 1.5rem;
            width: 44px;
            height: 44px;
            border-radius: var(--radius-md);
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          h2 {
            font-size: 1.25rem;
            color: #FFFFFF;
            margin: 0;
            flex: 1;
            margin-inline: 12px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          }

          .cat-count-pill {
            font-size: 0.74rem;
            font-weight: 700;
            color: var(--color-text-main);
            background: rgba(255, 255, 255, 0.92);
            padding: 4px 10px;
            border-radius: var(--radius-full);
            white-space: nowrap;
          }
        }

        .view-category-overlay-link {
          position: absolute;
          inset: 0;
        }
      }

      &:hover .category-hero-img {
        transform: scale(1.05);
      }

      .cat-footer-preview {
        padding: var(--space-md) var(--space-lg);
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;

        .cat-desc {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        .snippets-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: var(--color-surface-subtle);
          border-radius: var(--radius-md);
          padding: 8px 12px;
          border: 1px solid var(--color-border-subtle);
        }

        .snippet-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          border-bottom: 1px solid var(--color-border-subtle);
          cursor: pointer;
          transition: background-color 0.15s ease;

          &:last-child {
            border-bottom: none;
          }

          &:hover .snippet-name {
            color: var(--color-primary);
          }

          .snippet-thumb-wrap {
            width: 38px;
            height: 38px;
            border-radius: var(--radius-sm);
            overflow: hidden;
            flex-shrink: 0;
            border: 1px solid var(--color-border);
            background: var(--color-bg-sand);

            .snippet-mini-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .snippet-info {
            display: flex;
            flex-direction: column;
            flex: 1;

            .snippet-name {
              font-size: 0.88rem;
              font-weight: 600;
              color: var(--color-text-main);
              transition: color 0.15s ease;
            }

            .snippet-price {
              font-size: 0.78rem;
              color: var(--color-primary);
              font-weight: 600;
            }
          }

          .add-circle-btn {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: var(--color-primary-light);
            color: var(--color-primary);
            font-size: 1.1rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

            &.in-list {
              background: var(--color-success-bg);
              color: var(--color-success);
            }

            &:hover {
              transform: scale(1.1);
            }
          }
        }

        .explore-cat-btn {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-primary);
          padding-top: 6px;
        }
      }
    }

    /* Items Boutique Grid */
    .results-header {
      margin-bottom: var(--space-md);
      font-size: 0.95rem;
      color: var(--color-text-muted);
    }

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

    .no-results-editorial {
      text-align: center;
      padding: var(--space-2xl) var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .no-res-icon {
        font-size: 2.5rem;
      }

      h3 {
        font-size: 1.35rem;
      }

      p {
        color: var(--color-text-muted);
        max-width: 420px;
      }
    }
  `]
})
export class CatalogComponent {
  catalogService = inject(CatalogService);
  shoppingList = inject(ShoppingListService);
  i18n = inject(I18nService);
  toast = inject(ToastService);

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');
  previewItem = signal<CatalogItem | undefined>(undefined);

  filteredItems = computed(() => {
    return this.catalogService.searchItems(this.searchQuery(), this.selectedCategory());
  });

  getPreviewItems(categoryId: string): CatalogItem[] {
    return this.catalogService.getItemsByCategory(categoryId).slice(0, 3);
  }

  openArticlePreview(item: CatalogItem): void {
    this.previewItem.set(item);
  }

  closeArticlePreview(): void {
    this.previewItem.set(undefined);
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

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('all');
  }
}
