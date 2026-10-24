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
          <div class="search-and-controls-row">
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

            <!-- Traditional filter & sort -->
            <div class="quick-filter-actions">
              <button
                type="button"
                class="filter-toggle-btn"
                [class.active]="onlyTraditional()"
                (click)="onlyTraditional.set(!onlyTraditional())"
              >
                <span>🇹🇳</span>
                <span>{{ i18n.t('catalog.filter_traditional') }}</span>
              </button>

              <div class="sort-selector-wrap">
                <select [(ngModel)]="sortBy" class="sort-select">
                  <option value="default">{{ i18n.t('catalog.sort_by') }}: {{ i18n.t('sort.default') }}</option>
                  <option value="price_asc">{{ i18n.t('catalog.sort_by') }}: {{ i18n.t('sort.price_asc') }}</option>
                  <option value="price_desc">{{ i18n.t('catalog.sort_by') }}: {{ i18n.t('sort.price_desc') }}</option>
                  <option value="name">{{ i18n.t('catalog.sort_by') }}: {{ i18n.t('sort.name') }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Category Filter Pills (Horizontal Scroll) -->
          <div class="category-pills-row">
            <button
              type="button"
              class="pill-btn"
              [class.active]="selectedCategory() === 'all'"
              (click)="selectedCategory.set('all')"
            >
              <span>{{ i18n.t('catalog.all_categories') }}</span>
              <span class="pill-count">({{ catalogService.items().length }})</span>
            </button>
            @for (cat of catalogService.categories(); track cat.id) {
              <button
                type="button"
                class="pill-btn"
                [class.active]="selectedCategory() === cat.id"
                (click)="selectedCategory.set(cat.id)"
              >
                <span class="pill-icon">{{ cat.icon }}</span>
                <span>{{ catalogService.getCategoryName(cat) }}</span>
                <span class="pill-count">({{ catalogService.getCategoryItemCount(cat.id) }})</span>
              </button>
            }
          </div>
        </div>
      </header>

      <!-- Category Boutique Showcase (When browsing 'all', no search and not onlyTraditional) -->
      @if (!searchQuery() && selectedCategory() === 'all' && !onlyTraditional()) {
        <section class="boutique-showcase-section">
          <div class="categories-editorial-grid">
            @for (cat of catalogService.categories(); track cat.id) {
              <div class="boutique-category-card">
                <div class="cat-image-container">
                  <img
                    [src]="cat.image || 'assets/cat_kitchen.jpg'"
                    [alt]="catalogService.getCategoryName(cat)"
                    class="category-hero-img"
                    loading="lazy"
                  />
                  <div class="cat-gradient-scrim"></div>
                  <div class="cat-floating-info">
                    <span class="cat-emblem-badge">{{ cat.icon }}</span>
                    <h2>{{ catalogService.getCategoryName(cat) }}</h2>
                    <span class="cat-count-pill">
                      {{ catalogService.getCategoryItemCount(cat.id) }} {{ i18n.t('catalog.items_count') }}
                    </span>
                  </div>
                  <a [routerLink]="['/catalog', cat.id]" class="view-category-overlay-link" [attr.aria-label]="catalogService.getCategoryName(cat)"></a>
                </div>

                <div class="cat-footer-preview">
                  <p class="cat-desc">{{ catalogService.getCategoryDesc(cat) }}</p>

                  <!-- Subcategories tags -->
                  @if (cat.subcategories && cat.subcategories.length > 0) {
                    <div class="cat-subcategories-chips">
                      <span class="subcat-title-hint">{{ i18n.t('catalog.explore_subcategories') }}:</span>
                      <div class="subcat-chips-wrap">
                        @for (sub of cat.subcategories; track sub.id) {
                          <a
                            [routerLink]="['/catalog', cat.id]"
                            [queryParams]="{ subcategory: sub.id }"
                            class="subcat-chip"
                          >
                            <span class="subcat-chip-name">{{ catalogService.getSubcategoryName(sub) }}</span>
                            <span class="subcat-chip-count">{{ getSubcategoryCount(cat.id, sub.id) }}</span>
                          </a>
                        }
                      </div>
                    </div>
                  }
                  
                  <!-- Curated item snippets (5 preview items) -->
                  <div class="snippets-list">
                    @for (item of getPreviewItems(cat.id); track item.id) {
                      <div class="snippet-item" (click)="openArticlePreview(item)">
                        <div class="snippet-thumb-wrap">
                          <img [src]="catalogService.getItemImage(item)" class="snippet-mini-img" [alt]="catalogService.getItemName(item)" />
                        </div>
                        <div class="snippet-info">
                          <div class="snippet-name-row">
                            <span class="snippet-name">{{ catalogService.getItemName(item) }}</span>
                            @if (item.isTraditional) {
                              <span class="mini-trad-badge" title="Patrimoine Tunisien">🇹🇳</span>
                            }
                          </div>
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
                    <span>{{ i18n.currentLang() === 'ar' ? 'تصفح جميع عناصر القسم (' + catalogService.getCategoryItemCount(cat.id) + ')' : (i18n.currentLang() === 'en' ? 'Explore all ' + catalogService.getCategoryItemCount(cat.id) + ' items' : 'Explorer tous les ' + catalogService.getCategoryItemCount(cat.id) + ' articles') }}</span>
                    <span>{{ i18n.isRtl() ? '←' : '→' }}</span>
                  </a>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Filtered Items List (When searching, category selected, or traditional filter active) -->
      @if (searchQuery() || selectedCategory() !== 'all' || onlyTraditional()) {
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

    .search-and-controls-row {
      display: flex;
      flex-direction: column;
      gap: 12px;

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
      }
    }

    .search-input-box {
      flex: 1;
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

    .quick-filter-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 9px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text-main);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        background: var(--color-surface-hover);
        border-color: var(--color-primary);
      }

      &.active {
        background: #FDF2F4;
        border-color: var(--color-primary);
        color: var(--color-primary);
        box-shadow: 0 1px 4px rgba(113, 59, 72, 0.12);
      }
    }

    .sort-selector-wrap {
      .sort-select {
        padding: 9px 14px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-text-main);
        outline: none;
        cursor: pointer;
        transition: all 0.2s;

        &:focus {
          border-color: var(--color-primary);
        }
      }
    }

    .pill-count {
      font-size: 0.74rem;
      opacity: 0.82;
      font-weight: 500;
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

        .cat-subcategories-chips {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 4px 0;

          .subcat-title-hint {
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--color-text-muted);
            font-weight: 700;
          }

          .subcat-chips-wrap {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .subcat-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            background: var(--color-bg);
            border: 1px solid var(--color-border-subtle);
            border-radius: var(--radius-full);
            font-size: 0.78rem;
            color: var(--color-text-main);
            text-decoration: none;
            transition: all 0.2s ease;

            &:hover {
              background: #FFFFFF;
              border-color: var(--color-primary);
              color: var(--color-primary);
              transform: translateY(-1px);
            }

            .subcat-chip-name {
              font-weight: 500;
            }

            .subcat-chip-count {
              font-size: 0.7rem;
              background: rgba(113, 59, 72, 0.08);
              color: var(--color-primary);
              padding: 1px 6px;
              border-radius: var(--radius-full);
              font-weight: 700;
            }
          }
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

            .snippet-name-row {
              display: flex;
              align-items: center;
              gap: 6px;

              .mini-trad-badge {
                font-size: 0.82rem;
              }
            }

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

    /* Mobile Responsive Enhancements */
    @media (max-width: 600px) {
      .catalog-page {
        gap: 16px;
      }

      .catalog-header {
        gap: 10px;

        .catalog-eyebrow {
          font-size: 0.72rem;
        }

        h1 {
          font-size: 1.6rem;
        }

        p {
          font-size: 0.88rem;
          line-height: 1.5;
        }
      }

      .categories-editorial-grid {
        gap: 12px;
      }

      .boutique-category-card {
        .cat-image-container {
          height: 130px;
        }

        .cat-footer-preview {
          padding: 12px;
          gap: 8px;

          .cat-desc {
            font-size: 0.84rem;
            line-height: 1.45;
          }

          .cat-popular-preview {
            gap: 6px;

            .preview-row {
              padding: 5px 8px;
              font-size: 0.8rem;
            }
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
  onlyTraditional = signal<boolean>(false);
  sortBy = signal<string>('default');
  previewItem = signal<CatalogItem | undefined>(undefined);

  filteredItems = computed(() => {
    let items = this.catalogService.searchItems(this.searchQuery(), this.selectedCategory());
    if (this.onlyTraditional()) {
      items = items.filter(i => i.isTraditional);
    }
    const sort = this.sortBy();
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

  getPreviewItems(categoryId: string): CatalogItem[] {
    return this.catalogService.getItemsByCategory(categoryId).slice(0, 5);
  }

  getSubcategoryCount(categoryId: string, subcategoryId: string): number {
    return this.catalogService.getItemsByCategory(categoryId).filter(i => i.subcategoryId === subcategoryId).length;
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
    this.onlyTraditional.set(false);
    this.sortBy.set('default');
  }
}
