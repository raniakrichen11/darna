import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogItem } from '../../models/catalog.model';
import { CatalogService } from '../../services/catalog.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-article-preview-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (item) {
      <div class="modal-overlay" (click)="onBackdropClick($event)">
        <div class="modal-card article-modal-card" [attr.dir]="i18n.dir()">
          <!-- Image Section with Overlay Badges -->
          <div class="article-image-hero">
            <img
              [src]="catalogService.getItemImage(item)"
              [alt]="i18n.currentLang() === 'ar' ? item.nameAr : item.nameFr"
              class="article-photo"
            />
            <div class="image-gradient-overlay"></div>

            <button
              type="button"
              class="modal-close-floating"
              (click)="close.emit()"
              [attr.aria-label]="i18n.t('action.close')"
            >
              ✕
            </button>

            <!-- Badges on Image -->
            <div class="image-floating-badges">
              @if (item.isTraditional) {
                <span class="badge-traditional-pill">
                  🇹🇳 {{ i18n.t('catalog.traditional_label') }}
                </span>
              }
              <span class="badge-category-pill">
                {{ getCategoryName() }}
              </span>
            </div>
          </div>

          <!-- Article Content Body -->
          <div class="article-modal-body">
            <!-- Header Titles -->
            <div class="article-header">
              <span class="article-subcat">{{ getSubcategoryName() }}</span>
              <h2 class="article-title">
                {{ catalogService.getItemName(item) }}
              </h2>
            </div>

            <!-- Detailed Description / Cultural Significance -->
            <div class="article-description-box">
              <p class="description-text">
                {{ catalogService.getItemDesc(item) }}
              </p>
            </div>

            <!-- Essential Specs Grid -->
            <div class="specs-grid">
              <!-- Spec 1: Suggested Quantity -->
              <div class="spec-card">
                <span class="spec-icon">📦</span>
                <div class="spec-meta">
                  <span class="spec-label">{{ i18n.t('catalog.suggested_qty') }}</span>
                  <strong class="spec-value">{{ item.suggestedQuantity }} {{ i18n.currentLang() === 'ar' ? 'قطعة مقترحة' : (i18n.currentLang() === 'en' ? 'suggested unit(s)' : 'unité(s)') }}</strong>
                </div>
              </div>

              <!-- Spec 2: Estimated Price -->
              <div class="spec-card">
                <span class="spec-icon">💰</span>
                <div class="spec-meta">
                  <span class="spec-label">{{ i18n.t('catalog.estimated_price') }}</span>
                  <strong class="spec-value price-highlight">
                    {{ item.estimatedUnitPrice ? (item.estimatedUnitPrice | number:'1.0-2') + ' ' + i18n.currency() : i18n.t('list.price_unknown') }}
                  </strong>
                </div>
              </div>
            </div>

            <!-- Trousseau Status Banner -->
            <div class="trousseau-status-banner" [class.in-list]="isInList">
              <span class="status-icon">{{ isInList ? '✓' : 'ℹ️' }}</span>
              <span class="status-text">
                @if (isInList) {
                  {{ i18n.currentLang() === 'ar' ? 'هذا العنصر مسجل في قائمة جهازك.' : (i18n.currentLang() === 'en' ? 'This item is already saved in your trousseau.' : 'Cet article est déjà enregistré dans votre trousseau.') }}
                } @else {
                  {{ i18n.currentLang() === 'ar' ? 'لم تضيفي هذا العنصر بعد إلى قائمتك.' : (i18n.currentLang() === 'en' ? 'You have not added this item to your trousseau yet.' : 'Vous n’avez pas encore ajouté cet article à votre trousseau.') }}
                }
              </span>
            </div>

            <!-- Modal Action Footer -->
            <div class="article-modal-actions">
              <button type="button" class="btn btn-outline" (click)="close.emit()">
                {{ i18n.t('action.close') }}
              </button>

              <button
                type="button"
                class="btn btn-primary action-add-btn"
                (click)="onAddClick()"
              >
                @if (isInList) {
                  <span>✓ {{ i18n.t('action.added') }} (+1)</span>
                } @else {
                  <span>+ {{ i18n.t('action.add_to_list') }}</span>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .article-modal-card {
      max-width: 580px;
      padding: 0;
      overflow: hidden;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      position: relative;
    }

    /* Image Hero */
    .article-image-hero {
      position: relative;
      width: 100%;
      height: 280px;
      background: var(--color-bg-sand);
      overflow: hidden;

      @media (min-width: 600px) {
        height: 320px;
      }

      .article-photo {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      &:hover .article-photo {
        transform: scale(1.03);
      }

      .image-gradient-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(48, 41, 39, 0.25) 0%,
          transparent 40%,
          rgba(48, 41, 39, 0.65) 100%
        );
        pointer-events: none;
      }

      .modal-close-floating {
        position: absolute;
        top: 14px;
        inset-inline-end: 14px;
        z-index: 10;
        width: 36px;
        height: 36px;
        border-radius: var(--radius-full);
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.9);
        color: var(--color-charcoal);
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: var(--shadow-sm);

        &:hover {
          background: #FFFFFF;
          transform: scale(1.08);
          color: var(--color-burgundy);
        }
      }

      .image-floating-badges {
        position: absolute;
        bottom: 14px;
        inset-inline-start: 16px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        z-index: 5;

        .badge-traditional-pill {
          background: rgba(113, 59, 72, 0.9);
          backdrop-filter: blur(6px);
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          letter-spacing: 0.03em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .badge-category-pill {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(6px);
          color: var(--color-charcoal);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }
    }

    /* Modal Body */
    .article-modal-body {
      padding: var(--space-xl);
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .article-header {
      .article-subcat {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 600;
        color: var(--color-terracotta);
        display: block;
        margin-bottom: 4px;
      }

      .article-title {
        font-family: var(--font-serif);
        font-size: 1.55rem;
        color: var(--color-burgundy);
        line-height: 1.25;
        margin: 0;
      }
    }

    /* Description Box */
    .article-description-box {
      background: var(--color-sand);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 14px 18px;

      .description-text {
        color: var(--color-charcoal);
        font-size: 0.92rem;
        line-height: 1.65;
        margin: 0;
      }
    }

    /* Specs Grid */
    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;

      .spec-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;

        .spec-icon {
          font-size: 1.35rem;
        }

        .spec-meta {
          display: flex;
          flex-direction: column;

          .spec-label {
            font-size: 0.72rem;
            color: var(--color-text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .spec-value {
            font-size: 0.95rem;
            color: var(--color-charcoal);
            font-weight: 700;

            &.price-highlight {
              color: var(--color-burgundy);
            }
          }
        }
      }
    }

    /* Trousseau Status Banner */
    .trousseau-status-banner {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      background: var(--color-ivory);
      border: 1px solid var(--color-border);
      font-size: 0.85rem;
      color: var(--color-text-muted);

      &.in-list {
        background: rgba(113, 136, 117, 0.12);
        border-color: rgba(113, 136, 117, 0.3);
        color: var(--color-sage);
        font-weight: 600;
      }
    }

    /* Actions */
    .article-modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);

      .action-add-btn {
        flex: 1;

        @media (min-width: 480px) {
          flex: initial;
          min-width: 180px;
        }
      }
    }

    @media (max-width: 540px) {
      .article-image-hero {
        height: 220px;
      }

      .article-modal-body {
        padding: 16px;
        gap: 14px;
      }

      .article-title {
        font-size: 1.35rem;
      }

      .specs-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .article-modal-actions {
        flex-direction: column-reverse;
        gap: 8px;

        .btn {
          width: 100%;
          justify-content: center;
        }
      }
    }
  `]
})
export class ArticlePreviewModalComponent {
  @Input() item?: CatalogItem;
  @Output() close = new EventEmitter<void>();
  @Output() addToShoppingList = new EventEmitter<CatalogItem>();

  catalogService = inject(CatalogService);
  shoppingList = inject(ShoppingListService);
  i18n = inject(I18nService);

  get isInList(): boolean {
    return !!this.item && this.shoppingList.isCatalogItemInList(this.item.id);
  }

  getCategoryName(): string {
    if (!this.item) return '';
    const cat = this.catalogService.getCategoryById(this.item.categoryId);
    return this.catalogService.getCategoryName(cat);
  }

  getSubcategoryName(): string {
    if (!this.item) return '';
    const cat = this.catalogService.getCategoryById(this.item.categoryId);
    const sub = cat?.subcategories.find(s => s.id === this.item?.subcategoryId);
    return sub ? this.catalogService.getSubcategoryName(sub) : this.getCategoryName();
  }

  onAddClick(): void {
    if (this.item) {
      this.addToShoppingList.emit(this.item);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
