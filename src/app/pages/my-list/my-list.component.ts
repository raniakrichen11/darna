import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ShoppingListService } from '../../services/shopping-list.service';
import { PreferencesService } from '../../services/preferences.service';
import { I18nService } from '../../services/i18n.service';
import { PdfExportService } from '../../services/pdf-export.service';
import { ToastService } from '../../services/toast.service';
import { ShoppingListItem, CategoryGroup } from '../../models/shopping-list.model';
import { ItemModalComponent } from '../../components/item-modal/item-modal.component';

@Component({
  selector: 'app-my-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ItemModalComponent],
  template: `
    <div class="my-list-page" [attr.dir]="i18n.dir()">
      <!-- Page Header -->
      <div class="list-header-row">
        <div class="title-block">
          <h1>{{ i18n.t('list.title') }}</h1>
          <p>{{ i18n.t('list.subtitle') }}</p>
        </div>

        <div class="header-actions">
          <button type="button" class="btn btn-outline" (click)="onPrint()">
            🖨️ {{ i18n.t('action.print') }}
          </button>
          <button type="button" class="btn btn-primary" (click)="onExportPdf()" [disabled]="isExporting()">
            📄 {{ isExporting() ? 'Génération...' : i18n.t('action.export_pdf') }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="openCustomModal()">
            ➕ {{ i18n.t('action.create_custom') }}
          </button>
        </div>
      </div>

      <!-- Quick Summary Sticky Bar -->
      <div class="summary-kpi-bar card">
        <div class="kpi-block">
          <span class="kpi-label">{{ i18n.t('home.total_planned') }}</span>
          <span class="kpi-value">{{ shoppingList.totalItemsCount() }}</span>
        </div>
        <div class="kpi-block">
          <span class="kpi-label">{{ i18n.t('home.items_purchased') }}</span>
          <span class="kpi-value text-success">
            {{ shoppingList.purchasedItemsCount() }}
            <small>({{ shoppingList.progressPercentage() }}%)</small>
          </span>
        </div>
        <div class="kpi-block">
          <span class="kpi-label">{{ i18n.t('home.items_remaining') }}</span>
          <span class="kpi-value text-primary">{{ shoppingList.remainingItemsCount() }}</span>
        </div>
        <div class="kpi-block">
          <span class="kpi-label">{{ i18n.t('list.total_estimated') }}</span>
          <span class="kpi-value">{{ shoppingList.totalEstimatedCost() | number:'1.0-2' }} {{ i18n.currency() }}</span>
        </div>
        <div class="kpi-block">
          <span class="kpi-label">{{ i18n.t('list.total_actual') }}</span>
          <span class="kpi-value text-accent">{{ shoppingList.totalActualSpent() | number:'1.0-2' }} {{ i18n.currency() }}</span>
        </div>
      </div>

      <!-- Controls: Search, Status Filter & Expand/Collapse -->
      <div class="list-controls-row">
        <!-- Search -->
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            [placeholder]="i18n.t('action.search_placeholder')"
            class="search-input"
          />
          @if (searchQuery()) {
            <button type="button" class="clear-btn" (click)="searchQuery.set('')">✕</button>
          }
        </div>

        <!-- Filter Segmented Tabs -->
        <div class="filter-tabs">
          <button
            type="button"
            class="tab-btn"
            [class.active]="statusFilter() === 'all'"
            (click)="statusFilter.set('all')"
          >
            {{ i18n.t('action.filter_all') }}
            <span class="tab-count">({{ shoppingList.totalItemsCount() }})</span>
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="statusFilter() === 'remaining'"
            (click)="statusFilter.set('remaining')"
          >
            {{ i18n.t('action.filter_remaining') }}
            <span class="tab-count">({{ shoppingList.remainingItemsCount() }})</span>
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="statusFilter() === 'purchased'"
            (click)="statusFilter.set('purchased')"
          >
            {{ i18n.t('action.filter_purchased') }}
            <span class="tab-count">({{ shoppingList.purchasedItemsCount() }})</span>
          </button>
        </div>

        <!-- Collapse / Expand All toggle -->
        <div class="toggle-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="toggleAllCategories()">
            {{ allExpanded() ? i18n.t('list.collapse_all') : i18n.t('list.expand_all') }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      @if (shoppingList.totalItemsCount() === 0) {
        <div class="empty-list-card card">
          <div class="empty-icon">🕊️</div>
          <h2>{{ i18n.t('list.empty_title') }}</h2>
          <p>{{ i18n.t('list.empty_desc') }}</p>
          <div class="empty-actions">
            <a routerLink="/catalog" class="btn btn-primary">
              🛍️ {{ i18n.t('list.btn_explore') }}
            </a>
            <button type="button" class="btn btn-outline" (click)="shoppingList.resetToRecommended()">
              ✨ {{ i18n.t('action.reset_catalog') }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="openCustomModal()">
              ➕ {{ i18n.t('list.btn_add_custom') }}
            </button>
          </div>
        </div>
      } @else {
        <!-- Category Grouped Sections -->
        <div class="category-groups-list">
          @for (group of filteredCategoryGroups(); track group.categoryId) {
            <div class="category-group card">
              <!-- Category Header / Accordion Toggle -->
              <div class="group-header" (click)="toggleCategory(group.categoryId)">
                <div class="group-title-side">
                  <span class="group-toggle-icon">
                    {{ isCategoryExpanded(group.categoryId) ? '▼' : (i18n.isRtl() ? '◀' : '▶') }}
                  </span>
                  <span class="group-cat-icon">{{ group.categoryIcon }}</span>
                  <h3>
                    {{ i18n.currentLang() === 'ar' ? group.categoryNameAr : group.categoryNameFr }}
                  </h3>
                  <span class="group-badge">
                    {{ group.purchasedCount }}/{{ group.totalItems }}
                  </span>
                </div>

                <div class="group-meta-side">
                  <div class="group-totals">
                    @if (group.actualTotal > 0) {
                      <span class="subtotal-actual">
                        {{ group.actualTotal | number:'1.0-2' }} {{ i18n.currency() }}
                      </span>
                    }
                    @if (group.estimatedTotal > 0) {
                      <span class="subtotal-est">
                        est. {{ group.estimatedTotal | number:'1.0-2' }} {{ i18n.currency() }}
                      </span>
                    }
                  </div>
                </div>
              </div>

              <!-- Items inside category -->
              @if (isCategoryExpanded(group.categoryId)) {
                <div class="group-items-table">
                  @for (item of group.items; track item.id) {
                    <div class="item-row" [class.is-purchased]="item.isPurchased">
                      <!-- Status Checkbox -->
                      <div class="col-check">
                        <button
                          type="button"
                          class="checkbox-btn"
                          [class.checked]="item.isPurchased"
                          (click)="shoppingList.togglePurchased(item.id)"
                          [title]="item.isPurchased ? i18n.t('action.mark_unpurchased') : i18n.t('action.mark_purchased')"
                        >
                          {{ item.isPurchased ? '✓' : '' }}
                        </button>
                      </div>

                      <!-- Item Name & Notes -->
                      <div class="col-name" (click)="openEditModal(item)">
                        <div class="name-line">
                          <span class="item-display-name">
                            {{ shoppingList.getItemDisplayName(item) }}
                          </span>
                        </div>
                        @if (item.notes) {
                          <span class="item-notes-preview">
                            💬 {{ item.notes }}
                          </span>
                        }
                      </div>

                      <!-- Quantity Stepper -->
                      <div class="col-qty">
                        <div class="qty-stepper">
                          <button
                            type="button"
                            class="step-btn"
                            (click)="decrementQty(item)"
                            title="Diminuer"
                          >-</button>
                          <span class="qty-num">{{ item.quantity }}</span>
                          <button
                            type="button"
                            class="step-btn"
                            (click)="incrementQty(item)"
                            title="Augmenter"
                          >+</button>
                        </div>
                      </div>

                      <!-- Prices: Estimated & Actual -->
                      <div class="col-price" (click)="openEditModal(item)">
                        @if (item.isPurchased && item.actualUnitPrice) {
                          <span class="price-actual">
                            {{ (item.actualUnitPrice * item.quantity) | number:'1.0-2' }} {{ i18n.currency() }}
                          </span>
                          <small class="unit-price-sub">
                            ({{ item.actualUnitPrice }} /u)
                          </small>
                        } @else if (item.estimatedUnitPrice) {
                          <span class="price-estimated">
                            ~{{ (item.estimatedUnitPrice * item.quantity) | number:'1.0-2' }} {{ i18n.currency() }}
                          </span>
                          <small class="unit-price-sub">
                            ({{ item.estimatedUnitPrice }} /u)
                          </small>
                        } @else {
                          <span class="price-unknown">
                            {{ i18n.t('list.price_unknown') }}
                          </span>
                        }
                      </div>

                      <!-- Actions: Edit & Delete -->
                      <div class="col-actions">
                        <button
                          type="button"
                          class="icon-action-btn"
                          (click)="openEditModal(item)"
                          [title]="i18n.t('action.edit')"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          class="icon-action-btn delete"
                          (click)="onDeleteItem(item)"
                          [title]="i18n.t('action.delete')"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Danger zone / Batch actions footer -->
        <div class="list-bottom-actions">
          <button type="button" class="btn btn-outline btn-sm" (click)="onClearAll()">
            ⚠️ {{ i18n.t('action.clear_all') }}
          </button>
          <button type="button" class="btn btn-subtle btn-sm" (click)="shoppingList.resetToRecommended()">
            🔄 {{ i18n.t('action.reset_catalog') }}
          </button>
        </div>
      }

      <!-- Item Edit / Add Modal -->
      @if (showItemModal()) {
        <app-item-modal
          [existingItem]="modalItem()"
          (save)="onSaveModalItem($event)"
          (close)="closeModal()"
        ></app-item-modal>
      }
    </div>
  `,
  styles: [`
    .my-list-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .list-header-row {
      display: flex;
      flex-direction: column;
      gap: 16px;

      @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .title-block {
        h1 {
          font-size: 1.85rem;
          color: var(--color-text-main);
          margin-bottom: 4px;
        }
        p {
          color: var(--color-text-muted);
        }
      }

      .header-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }

    /* KPI Summary Bar */
    .summary-kpi-bar {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: var(--space-md) var(--space-lg);
      background: var(--color-surface);

      @media (min-width: 640px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: 900px) {
        grid-template-columns: repeat(5, 1fr);
      }

      .kpi-block {
        display: flex;
        flex-direction: column;

        .kpi-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .kpi-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text-main);

          small {
            font-size: 0.85rem;
            font-weight: normal;
          }

          &.text-success { color: var(--color-success); }
          &.text-primary { color: var(--color-primary); }
          &.text-accent { color: var(--color-accent-gold); }
        }
      }
    }

    /* Controls */
    .list-controls-row {
      display: flex;
      flex-direction: column;
      gap: 12px;

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;

      .search-icon {
        position: absolute;
        inset-inline-start: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 0.95rem;
      }

      .search-input {
        width: 100%;
        padding: 8px 36px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        background: #fff;
        outline: none;

        &:focus {
          border-color: var(--color-primary);
        }
      }

      .clear-btn {
        position: absolute;
        inset-inline-end: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-muted);
      }
    }

    .filter-tabs {
      display: flex;
      background: var(--color-surface-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      padding: 3px;

      .tab-btn {
        padding: 6px 14px;
        font-size: 0.85rem;
        font-weight: 600;
        border-radius: var(--radius-full);
        color: var(--color-text-muted);
        transition: all 0.2s;

        &.active {
          background: #fff;
          color: var(--color-primary);
          box-shadow: var(--shadow-xs);
        }

        .tab-count {
          font-size: 0.78rem;
          opacity: 0.8;
          margin-inline-start: 2px;
        }
      }
    }

    /* Category Group Accordion */
    .category-groups-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .category-group {
      padding: 0;
      overflow: hidden;
    }

    .group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: var(--color-surface-subtle);
      cursor: pointer;
      user-select: none;
      transition: background-color 0.15s;

      &:hover {
        background: var(--color-surface-hover);
      }

      .group-title-side {
        display: flex;
        align-items: center;
        gap: 10px;

        .group-toggle-icon {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          width: 16px;
        }

        .group-cat-icon {
          font-size: 1.3rem;
        }

        h3 {
          font-size: 1.05rem;
          margin: 0;
          color: var(--color-text-main);
        }

        .group-badge {
          font-size: 0.78rem;
          font-weight: 700;
          background: #fff;
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }
      }

      .group-meta-side {
        .group-totals {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;

          .subtotal-actual {
            font-weight: 700;
            color: var(--color-primary);
          }

          .subtotal-est {
            color: var(--color-text-muted);
            font-size: 0.82rem;
          }
        }
      }
    }

    .group-items-table {
      display: flex;
      flex-direction: column;
      divide-y: 1px solid var(--color-border-subtle);
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--color-border-subtle);
      transition: background-color 0.15s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: var(--color-surface-subtle);
      }

      &.is-purchased {
        background-color: #fafdfa;

        .item-display-name {
          text-decoration: line-through;
          color: var(--color-text-muted);
        }
      }

      .col-check {
        flex-shrink: 0;
      }

      .col-name {
        flex: 1;
        cursor: pointer;

        .item-display-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-main);
        }

        .item-notes-preview {
          display: block;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-top: 2px;
        }
      }

      .col-qty {
        flex-shrink: 0;
      }

      .qty-stepper {
        display: flex;
        align-items: center;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        background: #fff;

        .step-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1rem;
          color: var(--color-text-main);
          transition: background-color 0.15s;

          &:hover {
            background: var(--color-surface-hover);
          }
        }

        .qty-num {
          min-width: 28px;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 700;
        }
      }

      .col-price {
        min-width: 90px;
        text-align: end;
        cursor: pointer;

        .price-actual {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-success);
          display: block;
        }

        .price-estimated {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-main);
          display: block;
        }

        .price-unknown {
          font-size: 0.8rem;
          color: var(--color-text-light);
          font-style: italic;
        }

        .unit-price-sub {
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }
      }

      .col-actions {
        display: flex;
        align-items: center;
        gap: 4px;

        .icon-action-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          transition: all 0.15s;

          &:hover {
            background: var(--color-surface-hover);
            color: var(--color-text-main);
          }

          &.delete:hover {
            background: var(--color-danger-bg);
            color: var(--color-danger);
          }
        }
      }
    }

    .checkbox-btn {
      width: 26px;
      height: 26px;
      border-radius: 6px;
      border: 2px solid var(--color-border-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #fff;
      font-size: 0.9rem;
      transition: all 0.2s;

      &.checked {
        background: var(--color-success);
        border-color: var(--color-success);
      }

      &:hover:not(.checked) {
        border-color: var(--color-primary);
      }
    }

    .list-bottom-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 12px;
    }

    .empty-list-card {
      text-align: center;
      padding: var(--space-2xl) var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .empty-icon {
        font-size: 3.5rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      p {
        max-width: 480px;
        color: var(--color-text-muted);
      }

      .empty-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: center;
        margin-top: 8px;
      }
    }
  `]
})
export class MyListComponent {
  shoppingList = inject(ShoppingListService);
  preferences = inject(PreferencesService);
  i18n = inject(I18nService);
  pdfExport = inject(PdfExportService);
  toast = inject(ToastService);

  searchQuery = signal<string>('');
  statusFilter = signal<'all' | 'remaining' | 'purchased'>('all');
  expandedCategories = signal<Record<string, boolean>>({});
  allExpanded = signal<boolean>(true);

  showItemModal = signal<boolean>(false);
  modalItem = signal<ShoppingListItem | undefined>(undefined);
  isExporting = signal<boolean>(false);

  filteredCategoryGroups = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const filter = this.statusFilter();
    const groups = this.shoppingList.categoryGroups();

    return groups
      .map(group => {
        let items = group.items;

        // Status filter
        if (filter === 'purchased') {
          items = items.filter(i => i.isPurchased);
        } else if (filter === 'remaining') {
          items = items.filter(i => !i.isPurchased);
        }

        // Query search
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
    if (formData.id) {
      // Editing existing
      const isAr = this.i18n.currentLang() === 'ar';
      this.shoppingList.updateItem(formData.id, {
        categoryId: formData.categoryId,
        customNameFr: !isAr ? formData.name : this.modalItem()?.customNameFr,
        customNameAr: isAr ? formData.name : this.modalItem()?.customNameAr,
        quantity: formData.quantity,
        estimatedUnitPrice: formData.estimatedUnitPrice,
        actualUnitPrice: formData.actualUnitPrice,
        notes: formData.notes
      });
      this.toast.show(
        this.i18n.currentLang() === 'ar' ? 'تم تحديث العنصر بنجاح' : 'Article mis à jour avec succès'
      );
    } else {
      // Adding new custom item
      this.shoppingList.addCustomItem({
        name: formData.name,
        categoryId: formData.categoryId,
        quantity: formData.quantity,
        estimatedUnitPrice: formData.estimatedUnitPrice,
        actualUnitPrice: formData.actualUnitPrice,
        notes: formData.notes
      });
      this.toast.show(
        this.i18n.currentLang() === 'ar' ? 'تمت إضافة العنصر المخصص' : 'Article personnalisé ajouté'
      );
    }
    this.closeModal();
  }

  onDeleteItem(item: ShoppingListItem): void {
    const name = this.shoppingList.getItemDisplayName(item);
    const confirmMsg =
      this.i18n.currentLang() === 'ar'
        ? `هل تريدين حقاً حذف «${name}»؟`
        : `Voulez-vous supprimer « ${name} » ?`;

    if (confirm(confirmMsg)) {
      this.shoppingList.removeItem(item.id);
      this.toast.show(
        this.i18n.currentLang() === 'ar' ? 'تم حذف العنصر' : 'Article supprimé'
      );
    }
  }

  onClearAll(): void {
    if (confirm(this.i18n.t('action.clear_confirm'))) {
      this.shoppingList.clearAll();
      this.toast.show(
        this.i18n.currentLang() === 'ar' ? 'تم إفراغ القائمة' : 'Liste vidée'
      );
    }
  }

  onPrint(): void {
    this.pdfExport.printInBrowser();
  }

  async onExportPdf(): Promise<void> {
    this.isExporting.set(true);
    this.toast.show(
      this.i18n.currentLang() === 'ar' ? 'جارٍ تحضير ملف PDF...' : 'Génération du PDF en cours...'
    );
    try {
      await this.pdfExport.exportToPdf('printable-export-container');
    } finally {
      this.isExporting.set(false);
    }
  }
}
