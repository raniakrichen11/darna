import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list.service';
import { PreferencesService } from '../../services/preferences.service';
import { I18nService } from '../../services/i18n.service';
import { CatalogService } from '../../services/catalog.service';
import { PdfExportService } from '../../services/pdf-export.service';
import { ToastService } from '../../services/toast.service';
import { ShoppingListItem, CategoryGroup } from '../../models/shopping-list.model';
import { CatalogItem } from '../../models/catalog.model';
import { ItemModalComponent } from '../../components/item-modal/item-modal.component';
import { ArticlePreviewModalComponent } from '../../components/article-preview-modal/article-preview-modal.component';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ItemModalComponent, ArticlePreviewModalComponent],
  template: `
    <div class="my-list-page" [attr.dir]="i18n.dir()">
      <!-- Page Header -->
      <header class="list-page-header">
        <div class="header-intro">
          <div class="list-eyebrow">
            <span>{{ i18n.t('app.culture_badge') }}</span>
          </div>
          <h1>{{ i18n.t('list.title') }}</h1>
          <p>{{ i18n.t('list.subtitle') }}</p>
        </div>

        <div class="header-action-group">
          <button type="button" class="btn btn-outline btn-sm" (click)="onPrint()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span>{{ i18n.t('action.print') }}</span>
          </button>

          <button type="button" class="btn btn-primary btn-sm" (click)="onExportPdf()" [disabled]="isExporting()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>{{ isExporting() ? '...' : i18n.t('action.export_pdf') }}</span>
          </button>

          <button type="button" class="btn btn-secondary btn-sm" (click)="openCustomModal()">
            <span>+</span>
            <span>{{ i18n.t('action.create_custom') }}</span>
          </button>
        </div>
      </header>

      <!-- Compact Progress & Financial Overview Bar -->
      <section class="summary-strip-card card">
        <div class="summary-kpi">
          <span class="kpi-label">{{ i18n.t('home.total_planned') }}</span>
          <span class="kpi-val">{{ shoppingList.totalItemsCount() }}</span>
        </div>

        <div class="summary-kpi">
          <span class="kpi-label">{{ i18n.t('home.items_purchased') }}</span>
          <span class="kpi-val text-sage">
            {{ shoppingList.purchasedItemsCount() }}
            <small class="kpi-pct">({{ shoppingList.progressPercentage() }}%)</small>
          </span>
        </div>

        <div class="summary-kpi">
          <span class="kpi-label">{{ i18n.t('home.items_remaining') }}</span>
          <span class="kpi-val text-burgundy">{{ shoppingList.remainingItemsCount() }}</span>
        </div>

        <div class="summary-kpi">
          <span class="kpi-label">{{ i18n.t('list.total_estimated') }}</span>
          <span class="kpi-val">{{ shoppingList.totalEstimatedCost() | number:'1.0-2' }} <small>{{ i18n.currency() }}</small></span>
        </div>

        <div class="summary-kpi">
          <span class="kpi-label">{{ i18n.t('list.total_actual') }}</span>
          <span class="kpi-val text-accent">{{ shoppingList.totalActualSpent() | number:'1.0-2' }} <small>{{ i18n.currency() }}</small></span>
        </div>
      </section>

      <!-- Search & Status Filter Strip -->
      <section class="list-filters-strip">
        <div class="search-field-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            [placeholder]="i18n.t('action.search_placeholder')"
            class="list-search-input"
          />
          @if (searchQuery()) {
            <button type="button" class="clear-btn" (click)="searchQuery.set('')">✕</button>
          }
        </div>

        <div class="filter-pills-wrap">
          <button
            type="button"
            class="filter-pill"
            [class.active]="statusFilter() === 'all'"
            (click)="statusFilter.set('all')"
          >
            {{ i18n.t('action.filter_all') }}
            <span class="tally">({{ shoppingList.totalItemsCount() }})</span>
          </button>

          <button
            type="button"
            class="filter-pill"
            [class.active]="statusFilter() === 'remaining'"
            (click)="statusFilter.set('remaining')"
          >
            {{ i18n.t('action.filter_remaining') }}
            <span class="tally">({{ shoppingList.remainingItemsCount() }})</span>
          </button>

          <button
            type="button"
            class="filter-pill"
            [class.active]="statusFilter() === 'purchased'"
            (click)="statusFilter.set('purchased')"
          >
            {{ i18n.t('action.filter_purchased') }}
            <span class="tally">({{ shoppingList.purchasedItemsCount() }})</span>
          </button>
        </div>

        <div class="toggle-all-wrap">
          <button type="button" class="btn btn-outline btn-sm" (click)="toggleAllCategories()">
            {{ allExpanded() ? i18n.t('list.collapse_all') : i18n.t('list.expand_all') }}
          </button>
        </div>
      </section>

      <!-- Empty State -->
      @if (shoppingList.totalItemsCount() === 0) {
        <div class="empty-trousseau-box card">
          <div class="empty-icon">🕊️</div>
          <h2>{{ i18n.t('list.empty_title') }}</h2>
          <p>{{ i18n.t('list.empty_desc') }}</p>
          <div class="empty-actions-row">
            <a routerLink="/catalog" class="btn btn-primary">
              {{ i18n.t('list.btn_explore') }}
            </a>
            <button type="button" class="btn btn-outline" (click)="shoppingList.resetToRecommended()">
              ✨ {{ i18n.t('action.reset_catalog') }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="openCustomModal()">
              + {{ i18n.t('list.btn_add_custom') }}
            </button>
          </div>
        </div>
      } @else {
        <!-- Category Grouped Sections -->
        <div class="category-sections-container">
          @for (group of filteredCategoryGroups(); track group.categoryId) {
            <div class="category-block card">
              <!-- Category Header Accordion -->
              <div class="cat-block-header" (click)="toggleCategory(group.categoryId)">
                <div class="header-left">
                  <span class="chevron-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      [style.transform]="isCategoryExpanded(group.categoryId) ? 'rotate(180deg)' : 'rotate(0deg)'"
                      style="transition: transform 0.25s ease;"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                  <span class="cat-icon-badge">{{ group.categoryIcon }}</span>
                  <h3 class="cat-title">
                    {{ i18n.currentLang() === 'ar' ? group.categoryNameAr : (i18n.currentLang() === 'en' ? (group.categoryNameEn || group.categoryNameFr) : group.categoryNameFr) }}
                  </h3>
                  <span class="cat-progress-pill">
                    {{ group.purchasedCount }}/{{ group.totalItems }}
                  </span>
                </div>

                <div class="header-right">
                  <div class="cat-subtotals">
                    @if (group.actualTotal > 0) {
                      <span class="act-amount">
                        {{ group.actualTotal | number:'1.0-2' }} {{ i18n.currency() }}
                      </span>
                    }
                    @if (group.estimatedTotal > 0) {
                      <span class="est-amount">
                        {{ i18n.currentLang() === 'ar' ? 'تقديري: ' : 'est. ' }}{{ group.estimatedTotal | number:'1.0-2' }} {{ i18n.currency() }}
                      </span>
                    }
                  </div>
                </div>
              </div>

              <!-- Item Checklist Rows -->
              @if (isCategoryExpanded(group.categoryId)) {
                <div class="checklist-rows-wrapper">
                  @for (item of group.items; track item.id) {
                    <div class="checklist-row" [class.is-done]="item.isPurchased">
                      <!-- Touch-friendly Circular Checkbox -->
                      <div class="row-check">
                        <button
                          type="button"
                          class="round-checkbox"
                          [class.checked]="item.isPurchased"
                          (click)="shoppingList.togglePurchased(item.id)"
                          [title]="item.isPurchased ? i18n.t('action.mark_unpurchased') : i18n.t('action.mark_purchased')"
                        >
                          @if (item.isPurchased) {
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          }
                        </button>
                      </div>

                      <!-- Item Name & Notes -->
                      <div class="row-info" (click)="openEditModal(item)">
                        <span class="item-name-text">
                          {{ shoppingList.getItemDisplayName(item) }}
                        </span>
                        @if (item.notes) {
                          <span class="item-notes-text">
                            💬 {{ item.notes }}
                          </span>
                        }
                      </div>

                      <!-- Tactile Stepper -->
                      <div class="row-stepper">
                        <div class="stepper-box">
                          <button
                            type="button"
                            class="stepper-btn"
                            (click)="decrementQty(item)"
                            [title]="i18n.currentLang() === 'ar' ? 'إنقاص' : (i18n.currentLang() === 'en' ? 'Decrease' : 'Diminuer')"
                          >−</button>
                          <span class="stepper-val">{{ item.quantity }}</span>
                          <button
                            type="button"
                            class="stepper-btn"
                            (click)="incrementQty(item)"
                            [title]="i18n.currentLang() === 'ar' ? 'زيادة' : (i18n.currentLang() === 'en' ? 'Increase' : 'Augmenter')"
                          >+</button>
                        </div>
                      </div>

                      <!-- Price Display -->
                      <div class="row-price" (click)="openEditModal(item)">
                        @if (item.isPurchased && item.actualUnitPrice) {
                          <span class="price-val text-sage">
                            {{ (item.actualUnitPrice * item.quantity) | number:'1.0-2' }} {{ i18n.currency() }}
                          </span>
                          <small class="unit-sub">({{ item.actualUnitPrice }} {{ i18n.currentLang() === 'ar' ? 'للوحدة' : (i18n.currentLang() === 'en' ? '/unit' : '/u') }})</small>
                        } @else if (item.estimatedUnitPrice) {
                          <span class="price-val">
                            ~{{ (item.estimatedUnitPrice * item.quantity) | number:'1.0-2' }} {{ i18n.currency() }}
                          </span>
                          <small class="unit-sub">({{ item.estimatedUnitPrice }} {{ i18n.currentLang() === 'ar' ? 'للوحدة' : (i18n.currentLang() === 'en' ? '/unit' : '/u') }})</small>
                        } @else {
                          <span class="price-unspecified">
                            {{ i18n.t('list.price_unknown') }}
                          </span>
                        }
                      </div>

                      <!-- Row Action Buttons -->
                      <div class="row-actions">
                        <button
                          type="button"
                          class="action-icon-btn preview-btn"
                          (click)="openArticlePreview(item)"
                          [title]="i18n.currentLang() === 'ar' ? 'عرض صورة المقال' : (i18n.currentLang() === 'en' ? 'Photo preview of this item' : 'Aperçu photo de cet article')"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </button>

                        <button
                          type="button"
                          class="action-icon-btn"
                          (click)="openEditModal(item)"
                          [title]="i18n.t('action.edit')"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>

                        <button
                          type="button"
                          class="action-icon-btn delete-btn"
                          (click)="onDeleteItem(item)"
                          [title]="i18n.t('action.delete')"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Danger Zone Footer -->
        <div class="list-danger-strip">
          <button type="button" class="btn btn-outline btn-sm" (click)="onClearAll()">
            ⚠️ {{ i18n.t('action.clear_all') }}
          </button>
          <button type="button" class="btn btn-subtle btn-sm" (click)="shoppingList.resetToRecommended()">
            🔄 {{ i18n.t('action.reset_catalog') }}
          </button>
        </div>
      }

      <!-- Item Add / Edit Modal -->
      @if (showItemModal()) {
        <app-item-modal
          [existingItem]="modalItem()"
          (save)="onSaveModalItem($event)"
          (close)="closeModal()"
        ></app-item-modal>
      }

      <!-- Article Photo Preview Modal -->
      <app-article-preview-modal
        [item]="previewArticleItem()"
        (close)="closeArticlePreview()"
      ></app-article-preview-modal>

      <!-- Clear All Confirmation Modal -->
      @if (showClearConfirmModal()) {
        <div class="modal-overlay" (click)="closeClearConfirmModal()">
          <div class="modal-card confirm-modal-card" (click)="$event.stopPropagation()" [attr.dir]="i18n.dir()">
            <div class="confirm-modal-header">
              <div class="confirm-warning-icon">⚠️</div>
              <div class="confirm-header-text">
                <span class="confirm-eyebrow">
                  {{ i18n.currentLang() === 'ar' ? 'تأكيد الحذف' : (i18n.currentLang() === 'en' ? 'CONFIRM DELETION' : 'CONFIRMATION') }}
                </span>
                <h2 class="confirm-title">
                  {{ i18n.currentLang() === 'ar' ? 'إفراغ القائمة بالكامل؟' : (i18n.currentLang() === 'en' ? 'Clear entire list?' : 'Vider toute la liste ?') }}
                </h2>
              </div>
            </div>

            <p class="confirm-body-text">
              {{ i18n.currentLang() === 'ar'
                ? 'هل أنتِ متأكدة من رغبتك في حذف جميع عناصر جهازك؟ هذه العملية نهائية ولا يمكن التراجع عنها.'
                : (i18n.currentLang() === 'en'
                  ? 'Are you sure you want to remove all items from your shopping list? This action is permanent and cannot be undone.'
                  : 'Êtes-vous sûre de vouloir supprimer tous les articles de votre liste ? Cette action est irréversible.')
              }}
            </p>

            <div class="confirm-stats-pill">
              <span>📋 {{ shoppingList.totalItemsCount() }} {{ i18n.t('catalog.items_count') }}</span>
              <span>💰 {{ shoppingList.totalEstimatedCost() | number:'1.0-2' }} {{ i18n.currency() }}</span>
            </div>

            <div class="confirm-modal-actions">
              <button type="button" class="btn btn-outline" (click)="closeClearConfirmModal()">
                {{ i18n.currentLang() === 'ar' ? 'لا، تراجع' : (i18n.currentLang() === 'en' ? 'No, cancel' : 'Non, annuler') }}
              </button>
              <button type="button" class="btn btn-danger-confirm" (click)="confirmClearAll()">
                🗑️ {{ i18n.currentLang() === 'ar' ? 'نعم، إفراغ القائمة' : (i18n.currentLang() === 'en' ? 'Yes, clear list' : 'Oui, vider la liste') }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .my-list-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    /* Page Header */
    .list-page-header {
      display: flex;
      flex-direction: column;
      gap: 16px;

      @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
      }

      .list-eyebrow {
        font-size: 0.76rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-primary);
        font-weight: 700;
        margin-bottom: 4px;
      }

      h1 {
        margin-bottom: 4px;
      }

      p {
        color: var(--color-text-muted);
        font-size: 0.98rem;
      }

      .header-action-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    /* Summary KPI Strip */
    .summary-strip-card {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      padding: 12px 14px;
      background: #FFFFFF;

      @media (max-width: 639px) {
        .summary-kpi:last-child {
          grid-column: span 2;
        }
      }

      @media (min-width: 640px) {
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
        padding: var(--space-md) var(--space-lg);
      }

      @media (min-width: 940px) {
        grid-template-columns: repeat(5, 1fr);
      }

      .summary-kpi {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .kpi-label {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .kpi-val {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text-main);

          small {
            font-size: 0.85rem;
            color: var(--color-text-muted);
          }

          .kpi-pct {
            font-size: 0.8rem;
            font-weight: 600;
          }

          &.text-sage { color: var(--color-success); }
          &.text-burgundy { color: var(--color-primary); }
          &.text-accent { color: var(--color-accent-gold); }
        }
      }
    }

    /* Filters Strip */
    .list-filters-strip {
      display: flex;
      flex-direction: column;
      gap: 12px;

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .search-field-wrap {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      max-width: 380px;

      svg {
        position: absolute;
        inset-inline-start: 14px;
        color: var(--color-text-muted);
        pointer-events: none;
      }

      .list-search-input {
        width: 100%;
        padding: 9px 38px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        background: #FFFFFF;
        font-size: 0.9rem;
        outline: none;
        transition: all 0.2s;

        &:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(113, 59, 72, 0.1);
        }
      }

      .clear-btn {
        position: absolute;
        inset-inline-end: 12px;
        color: var(--color-text-muted);
        font-size: 0.85rem;
      }
    }

    .filter-pills-wrap {
      display: flex;
      background: var(--color-surface-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      padding: 3px;

      .filter-pill {
        padding: 6px 14px;
        font-size: 0.84rem;
        font-weight: 600;
        border-radius: var(--radius-full);
        color: var(--color-text-muted);
        transition: all 0.2s;

        &.active {
          background: #FFFFFF;
          color: var(--color-primary);
          box-shadow: var(--shadow-xs);
        }

        .tally {
          font-size: 0.76rem;
          opacity: 0.85;
        }
      }
    }

    /* Category Blocks */
    .category-sections-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .category-block {
      padding: 0;
      overflow: hidden;
    }

    .cat-block-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: var(--color-surface-subtle);
      cursor: pointer;
      user-select: none;
      transition: background-color 0.15s ease;

      &:hover {
        background: var(--color-surface-hover);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 12px;

        .chevron-icon {
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
        }

        .cat-icon-badge {
          font-size: 1.25rem;
        }

        .cat-title {
          font-size: 1.05rem;
          color: var(--color-text-main);
          margin: 0;
        }

        .cat-progress-pill {
          font-size: 0.75rem;
          font-weight: 700;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }
      }

      .header-right {
        .cat-subtotals {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;

          .act-amount {
            font-weight: 700;
            color: var(--color-primary);
          }

          .est-amount {
            color: var(--color-text-muted);
            font-size: 0.8rem;
          }
        }
      }
    }

    /* Checklist Item Rows */
    .checklist-rows-wrapper {
      display: flex;
      flex-direction: column;
    }

    .checklist-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--color-border-subtle);
      transition: background-color 0.15s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: var(--color-surface-subtle);
      }

      &.is-done {
        background-color: #FAFCFA;

        .item-name-text {
          text-decoration: line-through;
          color: var(--color-text-light);
        }
      }

      .row-check {
        flex-shrink: 0;
      }

      .round-checkbox {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1.8px solid var(--color-border-strong);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #FFFFFF;
        background: #FFFFFF;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

        &.checked {
          background: var(--color-success);
          border-color: var(--color-success);
        }

        &:hover:not(.checked) {
          border-color: var(--color-primary);
          background: var(--color-primary-light);
        }
      }

      .row-info {
        flex: 1;
        cursor: pointer;

        .item-name-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-main);
          display: block;
        }

        .item-notes-text {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-top: 2px;
          display: block;
        }
      }

      .row-stepper {
        flex-shrink: 0;

        .stepper-box {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: #FFFFFF;

          .stepper-btn {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            font-weight: bold;
            color: var(--color-text-main);
            transition: background-color 0.15s;

            &:hover {
              background: var(--color-surface-hover);
            }
          }

          .stepper-val {
            min-width: 26px;
            text-align: center;
            font-size: 0.88rem;
            font-weight: 700;
          }
        }
      }

      .row-price {
        min-width: 95px;
        text-align: end;
        cursor: pointer;

        .price-val {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--color-text-main);
          display: block;

          &.text-sage {
            color: var(--color-success);
          }
        }

        .unit-sub {
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }

        .price-unspecified {
          font-size: 0.78rem;
          color: var(--color-text-light);
          font-style: italic;
        }
      }

      .row-actions {
        display: flex;
        align-items: center;
        gap: 4px;

        .action-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted);
          transition: all 0.15s;

          &:hover {
            background: var(--color-surface-hover);
            color: var(--color-text-main);
          }

          &.delete-btn:hover {
            background: var(--color-danger-bg);
            color: var(--color-danger);
          }
        }
      }

      /* Mobile Responsive Checklist Item Layout */
      @media (max-width: 680px) {
        display: grid;
        grid-template-columns: 28px 1fr auto;
        grid-template-areas:
          "check info actions"
          "empty stepper price";
        row-gap: 6px;
        column-gap: 8px;
        padding: 10px 12px;
        align-items: center;

        .row-check {
          grid-area: check;
          align-self: flex-start;
          margin-top: 2px;

          .round-checkbox {
            width: 24px;
            height: 24px;
          }
        }

        .row-info {
          grid-area: info;
          min-width: 0;

          .item-name-text {
            font-size: 0.9rem;
            line-height: 1.3;
            word-break: break-word;
          }

          .item-notes-text {
            font-size: 0.74rem;
            margin-top: 1px;
          }
        }

        .row-actions {
          grid-area: actions;
          align-self: flex-start;
          gap: 2px;

          .action-icon-btn {
            width: 28px;
            height: 28px;
          }
        }

        .row-stepper {
          grid-area: stepper;
          justify-self: start;

          .stepper-box {
            .stepper-btn {
              width: 28px;
              height: 26px;
            }

            .stepper-val {
              min-width: 24px;
              font-size: 0.85rem;
            }
          }
        }

        .row-price {
          grid-area: price;
          text-align: end;
          min-width: unset;

          .price-val {
            font-size: 0.9rem;
          }

          .unit-sub {
            font-size: 0.68rem;
          }
        }
      }
    }

    /* Mobile Responsive Category Header */
    @media (max-width: 680px) {
      .cat-block-header {
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
        padding: 10px 12px;

        .header-left {
          width: 100%;
          gap: 8px;

          .cat-title {
            font-size: 0.92rem;
            flex: 1;
            min-width: 0;
            word-break: break-word;
          }

          .cat-progress-pill {
            font-size: 0.7rem;
            padding: 2px 6px;
            flex-shrink: 0;
          }
        }

        .header-right {
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding-top: 4px;
          border-top: 1px dashed var(--color-border-subtle);

          .cat-subtotals {
            display: flex;
            align-items: baseline;
            gap: 8px;
            font-size: 0.82rem;

            .act-amount {
              font-weight: 700;
              color: var(--color-primary);
            }

            .est-amount {
              color: var(--color-text-muted);
              font-size: 0.76rem;
            }
          }
        }
      }

      .summary-strip-card {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        padding: 14px;

        .summary-kpi:first-child {
          grid-column: span 2;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .summary-kpi {
          .kpi-label {
            font-size: 0.68rem;
          }
          .kpi-val {
            font-size: 1.15rem;
            small {
              font-size: 0.78rem;
            }
          }
        }
      }

      .list-page-header {
        gap: 12px;

        .header-action-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          width: 100%;

          .btn {
            width: 100%;
            padding: 8px 10px;
            font-size: 0.8rem;
            min-height: 40px;
            justify-content: center;
          }
        }
      }

      .list-filters-strip {
        gap: 10px;

        .search-field-wrap {
          max-width: 100%;
          width: 100%;
        }

        .filter-pills-wrap {
          width: 100%;
          justify-content: space-between;

          .filter-pill {
            flex: 1;
            text-align: center;
            padding: 6px 8px;
            font-size: 0.8rem;
          }
        }
      }
    }

    .list-danger-strip {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
    }

    .empty-trousseau-box {
      text-align: center;
      padding: var(--space-2xl) var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 14px;

      .empty-icon {
        font-size: 3.5rem;
      }

      h2 {
        font-size: 1.5rem;
        color: var(--color-text-main);
      }

      p {
        max-width: 460px;
        color: var(--color-text-muted);
        line-height: 1.6;
      }

      .empty-actions-row {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
        margin-top: 8px;
      }
    }

    /* Clear All Confirmation Modal */
    .confirm-modal-card {
      max-width: 460px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: #FFFFFF;
      box-shadow: var(--shadow-lg);

      .confirm-modal-header {
        display: flex;
        align-items: center;
        gap: 14px;

        .confirm-warning-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #FDF2F2;
          color: #B84743;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          border: 1px solid rgba(184, 71, 67, 0.2);
        }

        .confirm-header-text {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .confirm-eyebrow {
            font-size: 0.72rem;
            font-weight: 700;
            color: var(--color-danger);
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }

          .confirm-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--color-text-main);
            margin: 0;
            line-height: 1.25;
          }
        }
      }

      .confirm-body-text {
        font-size: 0.92rem;
        color: var(--color-text-muted);
        line-height: 1.55;
        margin: 0;
      }

      .confirm-stats-pill {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 10px 14px;
        font-size: 0.84rem;
        font-weight: 600;
        color: var(--color-text-main);
      }

      .confirm-modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 6px;
        padding-top: 14px;
        border-top: 1px solid var(--color-border-subtle);

        .btn-danger-confirm {
          background-color: var(--color-danger);
          color: #FFFFFF;
          border: none;
          font-weight: 600;
          padding: 10px 18px;
          border-radius: var(--radius-full);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px rgba(184, 71, 67, 0.25);
          cursor: pointer;

          &:hover {
            background-color: #9E3733;
            box-shadow: 0 4px 12px rgba(184, 71, 67, 0.35);
            transform: translateY(-1px);
          }

          &:active {
            transform: scale(0.97);
          }
        }

        @media (max-width: 480px) {
          flex-direction: column-reverse;
          gap: 8px;

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      }
    }
  `]
})
export class MyListComponent {
  shoppingList = inject(ShoppingListService);
  preferences = inject(PreferencesService);
  i18n = inject(I18nService);
  catalogService = inject(CatalogService);
  pdfExport = inject(PdfExportService);
  toast = inject(ToastService);

  searchQuery = signal<string>('');
  statusFilter = signal<'all' | 'remaining' | 'purchased'>('all');
  expandedCategories = signal<Record<string, boolean>>({});
  allExpanded = signal<boolean>(true);

  showItemModal = signal<boolean>(false);
  modalItem = signal<ShoppingListItem | undefined>(undefined);
  previewArticleItem = signal<CatalogItem | undefined>(undefined);
  showClearConfirmModal = signal<boolean>(false);
  isExporting = signal<boolean>(false);

  openArticlePreview(listItem: ShoppingListItem): void {
    if (listItem.catalogItemId) {
      const catItem = this.catalogService.getItemById(listItem.catalogItemId);
      if (catItem) {
        this.previewArticleItem.set(catItem);
        return;
      }
    }
    const name = this.shoppingList.getItemDisplayName(listItem);
    this.previewArticleItem.set({
      id: listItem.id,
      categoryId: listItem.categoryId,
      subcategoryId: listItem.subcategoryId || '',
      nameFr: listItem.customNameFr || name,
      nameAr: listItem.customNameAr || name,
      descriptionFr: listItem.notes || 'Article enregistré dans votre trousseau de mariage tunisien.',
      descriptionAr: listItem.notes || 'مقال محفوظ في جهاز العروس التونسية.',
      suggestedQuantity: listItem.quantity,
      estimatedUnitPrice: listItem.estimatedUnitPrice || listItem.actualUnitPrice,
      isTraditional: false
    });
  }

  closeArticlePreview(): void {
    this.previewArticleItem.set(undefined);
  }

  filteredCategoryGroups = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const filter = this.statusFilter();
    const groups = this.shoppingList.categoryGroups();

    return groups
      .map(group => {
        let items = group.items;

        if (filter === 'purchased') {
          items = items.filter(i => i.isPurchased);
        } else if (filter === 'remaining') {
          items = items.filter(i => !i.isPurchased);
        }

        if (query) {
          items = items.filter(i => {
            const name = this.shoppingList.getItemDisplayName(i).toLowerCase();
            const notes = (i.notes || '').toLowerCase();
            return name.includes(query) || notes.includes(query);
          });
        }

        return {
          ...group,
          items,
          totalItems: items.length,
          purchasedCount: items.filter(i => i.isPurchased).length
        };
      })
      .filter(g => g.items.length > 0);
  });

  isCategoryExpanded(categoryId: string): boolean {
    const map = this.expandedCategories();
    return map[categoryId] !== undefined ? map[categoryId] : this.allExpanded();
  }

  toggleCategory(categoryId: string): void {
    const current = this.isCategoryExpanded(categoryId);
    this.expandedCategories.update(map => ({
      ...map,
      [categoryId]: !current
    }));
  }

  toggleAllCategories(): void {
    const nextState = !this.allExpanded();
    this.allExpanded.set(nextState);
    const newMap: Record<string, boolean> = {};
    for (const group of this.shoppingList.categoryGroups()) {
      newMap[group.categoryId] = nextState;
    }
    this.expandedCategories.set(newMap);
  }

  incrementQty(item: ShoppingListItem): void {
    this.shoppingList.updateQuantity(item.id, item.quantity + 1);
  }

  decrementQty(item: ShoppingListItem): void {
    if (item.quantity > 1) {
      this.shoppingList.updateQuantity(item.id, item.quantity - 1);
    }
  }

  openCustomModal(): void {
    this.modalItem.set(undefined);
    this.showItemModal.set(true);
  }

  openEditModal(item: ShoppingListItem): void {
    this.modalItem.set(item);
    this.showItemModal.set(true);
  }

  closeModal(): void {
    this.showItemModal.set(false);
    this.modalItem.set(undefined);
  }

  onSaveModalItem(formData: any): void {
    const lang = this.i18n.currentLang();
    if (formData.id) {
      this.shoppingList.updateItem(formData.id, {
        categoryId: formData.categoryId,
        customNameFr: lang === 'fr' ? formData.name : this.modalItem()?.customNameFr,
        customNameAr: lang === 'ar' ? formData.name : this.modalItem()?.customNameAr,
        customNameEn: lang === 'en' ? formData.name : this.modalItem()?.customNameEn,
        quantity: formData.quantity,
        estimatedUnitPrice: formData.estimatedUnitPrice,
        actualUnitPrice: formData.actualUnitPrice,
        notes: formData.notes
      });
      const msg = lang === 'ar'
        ? 'تم تحديث العنصر بنجاح ✨'
        : (lang === 'en' ? 'Item updated successfully ✨' : 'Article mis à jour avec succès ✨');
      this.toast.show(msg);
    } else {
      this.shoppingList.addCustomItem({
        name: formData.name,
        categoryId: formData.categoryId,
        quantity: formData.quantity,
        estimatedUnitPrice: formData.estimatedUnitPrice,
        actualUnitPrice: formData.actualUnitPrice,
        notes: formData.notes
      });
      const msg = lang === 'ar'
        ? 'تمت إضافة العنصر المخصص ✨'
        : (lang === 'en' ? 'Custom item added ✨' : 'Article personnalisé ajouté ✨');
      this.toast.show(msg);
    }
    this.closeModal();
  }

  onDeleteItem(item: ShoppingListItem): void {
    const name = this.shoppingList.getItemDisplayName(item);
    const lang = this.i18n.currentLang();
    const confirmMsg =
      lang === 'ar'
        ? `هل تريدين حذف «${name}»؟`
        : (lang === 'en' ? `Do you want to delete "${name}"?` : `Voulez-vous supprimer « ${name} » ?`);

    if (confirm(confirmMsg)) {
      this.shoppingList.removeItem(item.id);
      const msg = lang === 'ar'
        ? 'تم حذف العنصر'
        : (lang === 'en' ? 'Item removed' : 'Article supprimé');
      this.toast.show(msg);
    }
  }

  onClearAll(): void {
    this.showClearConfirmModal.set(true);
  }

  closeClearConfirmModal(): void {
    this.showClearConfirmModal.set(false);
  }

  confirmClearAll(): void {
    this.shoppingList.clearAll();
    this.showClearConfirmModal.set(false);
    const lang = this.i18n.currentLang();
    const msg = lang === 'ar'
      ? 'تم إفراغ القائمة بنجاح ✨'
      : (lang === 'en' ? 'List cleared successfully ✨' : 'Liste vidée avec succès ✨');
    this.toast.show(msg);
  }

  onPrint(): void {
    this.pdfExport.printInBrowser();
  }

  async onExportPdf(): Promise<void> {
    this.isExporting.set(true);
    const lang = this.i18n.currentLang();
    const msg = lang === 'ar'
      ? 'جارٍ تحضير ملف PDF...'
      : (lang === 'en' ? 'Generating PDF...' : 'Génération du PDF en cours...');
    this.toast.show(msg);
    try {
      await this.pdfExport.exportToPdf('printable-export-container');
    } finally {
      this.isExporting.set(false);
    }
  }
}
