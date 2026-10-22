import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { CatalogItem } from '../../models/catalog.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="catalog-page" [attr.dir]="i18n.dir()">
      <!-- Header -->
      <div class="page-header">
        <h1>{{ i18n.t('catalog.title') }}</h1>
        <p>{{ i18n.t('catalog.subtitle') }}</p>
      </div>

      <!-- Search & Filters Bar -->
      <div class="search-filter-section card">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            [placeholder]="i18n.t('action.search_placeholder')"
            class="search-input"
          />
          @if (searchQuery()) {
            <button type="button" class="clear-search-btn" (click)="searchQuery.set('')">✕</button>
          }
        </div>

        <!-- Category Horizontal Filter Chips -->
        <div class="filter-chips">
          <button
            type="button"
            class="chip"
            [class.active]="selectedCategory() === 'all'"
            (click)="selectedCategory.set('all')"
          >
            🌟 {{ i18n.t('catalog.all_categories') }}
          </button>
          @for (cat of catalogService.categories(); track cat.id) {
            <button
              type="button"
              class="chip"
              [class.active]="selectedCategory() === cat.id"
              (click)="selectedCategory.set(cat.id)"
            >
              {{ cat.icon }} {{ i18n.currentLang() === 'ar' ? cat.nameAr : cat.nameFr }}
            </button>
          }
        </div>
      </div>

      <!-- Category Browsing Overview (When not searching & 'all' selected) -->
      @if (!searchQuery() && selectedCategory() === 'all') {
        <section class="category-overview-section">
          <div class="categories-banner-grid">
            @for (category of catalogService.categories(); track category.id) {
              <div class="category-banner card">
                <div class="cat-banner-header">
                  <div class="cat-banner-icon">{{ category.icon }}</div>
                  <div class="cat-banner-title">
                    <h2>{{ i18n.currentLang() === 'ar' ? category.nameAr : category.nameFr }}</h2>
                    <span class="cat-badge">
                      {{ catalogService.getCategoryItemCount(category.id) }} {{ i18n.t('catalog.items_count') }}
                    </span>
                  </div>
                  <a [routerLink]="['/catalog', category.id]" class="btn btn-outline btn-sm">
                    {{ i18n.currentLang() === 'ar' ? 'عرض الكل' : 'Voir tout' }} →
                  </a>
                </div>
                <p class="cat-banner-desc">
                  {{ i18n.currentLang() === 'ar' ? category.descriptionAr : category.descriptionFr }}
                </p>

                <!-- 3 featured items quick preview -->
                <div class="quick-items-preview">
                  @for (item of getPreviewItems(category.id); track item.id) {
                    <div class="quick-item-card">
                      <div class="item-info">
                        <span class="item-name">{{ i18n.currentLang() === 'ar' ? item.nameAr : item.nameFr }}</span>
                        @if (item.estimatedUnitPrice) {
                          <span class="item-price">{{ item.estimatedUnitPrice }} {{ i18n.currency() }}</span>
                        }
                      </div>
                      <button
                        type="button"
                        class="btn-add"
                        [class.already-in]="shoppingList.isCatalogItemInList(item.id)"
                        (click)="onAddItem(item)"
                        [title]="shoppingList.isCatalogItemInList(item.id) ? i18n.t('action.added') : i18n.t('action.add')"
                      >
                        {{ shoppingList.isCatalogItemInList(item.id) ? '✓' : '+' }}
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Filtered Items List (When searching or category selected) -->
      @if (searchQuery() || selectedCategory() !== 'all') {
        <section class="items-grid-section">
          <div class="results-meta">
            <span>
              <strong>{{ filteredItems().length }}</strong> {{ i18n.t('catalog.items_count') }}
            </span>
          </div>

          @if (filteredItems().length === 0) {
            <div class="no-results card">
              <div class="no-results-icon">🔎</div>
              <h3>{{ i18n.t('catalog.no_results') }}</h3>
              <p>{{ i18n.t('catalog.search_empty_hint') }}</p>
              <button type="button" class="btn btn-outline" (click)="resetFilters()">
                {{ i18n.t('catalog.all_categories') }}
              </button>
            </div>
          } @else {
            <div class="items-grid">
              @for (item of filteredItems(); track item.id) {
                <div class="item-card card">
                  <div class="item-top">
                    <div class="item-icon-box">{{ item.icon || '🛍️' }}</div>
                    <div class="item-badges">
                      @if (item.isTraditional) {
                        <span class="badge badge-traditional">
                          🇹🇳 {{ i18n.t('catalog.traditional_label') }}
                        </span>
                      }
                      @if (shoppingList.isCatalogItemInList(item.id)) {
                        <span class="badge badge-success">
                          ✓ {{ i18n.t('action.added') }}
                        </span>
                      }
                    </div>
                  </div>

                  <h3 class="item-title">
                    {{ i18n.currentLang() === 'ar' ? item.nameAr : item.nameFr }}
                  </h3>

                  <p class="item-desc">
                    {{ i18n.currentLang() === 'ar' ? item.descriptionAr : item.descriptionFr }}
                  </p>

                  <div class="item-specs">
                    <div class="spec-row">
                      <span class="spec-label">{{ i18n.t('catalog.suggested_qty') }}</span>
                      <strong class="spec-val">{{ item.suggestedQuantity }}</strong>
                    </div>

                    <div class="spec-row">
                      <span class="spec-label">{{ i18n.t('catalog.estimated_price') }}</span>
                      <strong class="spec-val price">
                        {{ item.estimatedUnitPrice ? (item.estimatedUnitPrice | number:'1.0-2') + ' ' + i18n.currency() : i18n.t('list.price_unknown') }}
                      </strong>
                    </div>
                  </div>

                  <div class="item-footer">
                    <button
                      type="button"
                      class="btn w-full"
                      [class.btn-primary]="!shoppingList.isCatalogItemInList(item.id)"
                      [class.btn-subtle]="shoppingList.isCatalogItemInList(item.id)"
                      (click)="onAddItem(item)"
                    >
                      @if (shoppingList.isCatalogItemInList(item.id)) {
                        <span>✓</span> {{ i18n.t('action.added') }} (+1)
                      } @else {
                        <span>+</span> {{ i18n.t('action.add_to_list') }}
                      }
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </section>
      }
    </div>
  `,
  styles: [`
    .catalog-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .page-header {
      h1 {
        font-size: 1.85rem;
        color: var(--color-text-main);
        margin-bottom: 6px;
      }
      p {
        color: var(--color-text-muted);
        font-size: 1.05rem;
      }
    }

    /* Search & Filter Section */
    .search-filter-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .search-icon {
        position: absolute;
        inset-inline-start: 14px;
        font-size: 1.1rem;
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 12px 42px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        background: var(--color-surface-subtle);
        font-size: 1rem;
        outline: none;
        transition: all 0.2s;

        &:focus {
          border-color: var(--color-primary);
          background: #fff;
          box-shadow: 0 0 0 3px rgba(179, 107, 92, 0.15);
        }
      }

      .clear-search-btn {
        position: absolute;
        inset-inline-end: 14px;
        color: var(--color-text-muted);
        font-size: 1rem;
        padding: 4px;
      }
    }

    .filter-chips {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        height: 4px;
      }

      .chip {
        white-space: nowrap;
        padding: 8px 16px;
        border-radius: var(--radius-full);
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border);
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--color-text-main);
        transition: all 0.2s;

        &:hover {
          background: var(--color-surface-hover);
          border-color: var(--color-border-strong);
        }

        &.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #fff;
        }
      }
    }

    /* Category Overview Grid */
    .categories-banner-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-lg);

      @media (min-width: 840px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .category-banner {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .cat-banner-header {
        display: flex;
        align-items: center;
        gap: 12px;

        .cat-banner-icon {
          font-size: 2rem;
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: var(--color-primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-banner-title {
          flex: 1;

          h2 {
            font-size: 1.15rem;
            margin: 0;
          }

          .cat-badge {
            font-size: 0.8rem;
            color: var(--color-text-muted);
          }
        }
      }

      .cat-banner-desc {
        font-size: 0.88rem;
        color: var(--color-text-muted);
      }

      .quick-items-preview {
        display: flex;
        flex-direction: column;
        gap: 6px;
        background: var(--color-surface-subtle);
        border-radius: var(--radius-md);
        padding: 8px;
        border: 1px solid var(--color-border-subtle);
      }

      .quick-item-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 10px;
        background: #fff;
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border-subtle);

        .item-info {
          display: flex;
          flex-direction: column;

          .item-name {
            font-size: 0.88rem;
            font-weight: 600;
            color: var(--color-text-main);
          }

          .item-price {
            font-size: 0.78rem;
            color: var(--color-primary);
            font-weight: 600;
          }
        }

        .btn-add {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-primary-light);
          color: var(--color-primary);
          font-weight: bold;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;

          &.already-in {
            background: var(--color-success-bg);
            color: var(--color-success);
          }

          &:hover {
            transform: scale(1.08);
          }
        }
      }
    }

    /* Items Grid */
    .results-meta {
      margin-bottom: var(--space-md);
      font-size: 0.95rem;
      color: var(--color-text-muted);
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-lg);
    }

    .item-card {
      display: flex;
      flex-direction: column;
      padding: var(--space-lg);
      gap: 10px;

      .item-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .item-icon-box {
        font-size: 2rem;
        width: 48px;
        height: 48px;
        background: var(--color-surface-subtle);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border-subtle);
      }

      .item-badges {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
      }

      .item-title {
        font-size: 1.05rem;
        color: var(--color-text-main);
        line-height: 1.35;
        min-height: 2.7rem;
      }

      .item-desc {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        min-height: 2.5rem;
      }

      .item-specs {
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border-subtle);
        border-radius: var(--radius-md);
        padding: 8px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .spec-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;

          .spec-label {
            color: var(--color-text-muted);
          }

          .spec-val.price {
            color: var(--color-primary);
            font-weight: 700;
          }
        }
      }

      .item-footer {
        margin-top: auto;
        padding-top: 8px;

        .w-full {
          width: 100%;
        }
      }
    }

    .no-results {
      text-align: center;
      padding: var(--space-2xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .no-results-icon {
        font-size: 3rem;
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

  filteredItems = computed(() => {
    return this.catalogService.searchItems(this.searchQuery(), this.selectedCategory());
  });

  getPreviewItems(categoryId: string): CatalogItem[] {
    return this.catalogService.getItemsByCategory(categoryId).slice(0, 3);
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
