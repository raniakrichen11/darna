import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { CatalogItem } from '../../models/catalog.model';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="category-detail-page" [attr.dir]="i18n.dir()">
      <!-- Back Link -->
      <div class="breadcrumb">
        <a routerLink="/catalog" class="back-link">
          ← {{ i18n.t('catalog.back_to_categories') }}
        </a>
      </div>

      @if (category(); as cat) {
        <!-- Category Banner -->
        <div class="cat-hero card">
          <div class="cat-icon-lg">{{ cat.icon }}</div>
          <div class="cat-hero-text">
            <h1>{{ i18n.currentLang() === 'ar' ? cat.nameAr : cat.nameFr }}</h1>
            <p>{{ i18n.currentLang() === 'ar' ? cat.descriptionAr : cat.descriptionFr }}</p>
          </div>
          <div class="cat-stat-badge">
            {{ categoryItems().length }} {{ i18n.t('catalog.items_count') }}
          </div>
        </div>

        <!-- Subcategory Filter Pills -->
        @if (cat.subcategories && cat.subcategories.length > 0) {
          <div class="subcat-pills">
            <button
              type="button"
              class="pill"
              [class.active]="selectedSubcategory() === 'all'"
              (click)="selectedSubcategory.set('all')"
            >
              {{ i18n.t('catalog.all_categories') }}
            </button>
            @for (sub of cat.subcategories; track sub.id) {
              <button
                type="button"
                class="pill"
                [class.active]="selectedSubcategory() === sub.id"
                (click)="selectedSubcategory.set(sub.id)"
              >
                {{ i18n.currentLang() === 'ar' ? sub.nameAr : sub.nameFr }}
              </button>
            }
          </div>
        }

        <!-- Items Grid -->
        <div class="items-grid">
          @for (item of filteredCategoryItems(); track item.id) {
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
      } @else {
        <div class="card not-found">
          <h2>Catégorie introuvable</h2>
          <a routerLink="/catalog" class="btn btn-primary">Retour au catalogue</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .category-detail-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .breadcrumb {
      .back-link {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-primary);
        display: inline-flex;
        align-items: center;
        gap: 6px;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .cat-hero {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      padding: var(--space-xl);
      background: linear-gradient(135deg, #ffffff 0%, #faf3ee 100%);

      .cat-icon-lg {
        font-size: 3rem;
        width: 72px;
        height: 72px;
        border-radius: var(--radius-lg);
        background: var(--color-primary-light);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cat-hero-text {
        flex: 1;

        h1 {
          font-size: 1.6rem;
          color: var(--color-text-main);
          margin-bottom: 4px;
        }

        p {
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }
      }

      .cat-stat-badge {
        font-size: 0.85rem;
        font-weight: 700;
        background: #fff;
        padding: 6px 14px;
        border-radius: var(--radius-full);
        border: 1px solid var(--color-border);
        color: var(--color-primary);
      }
    }

    .subcat-pills {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;

      .pill {
        white-space: nowrap;
        padding: 8px 16px;
        border-radius: var(--radius-full);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--color-text-main);
        transition: all 0.2s;

        &.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: #fff;
        }
      }
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

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('categoryId') || '';
      this.categoryId.set(id);
      this.selectedSubcategory.set('all');
    });
  }

  category = computed(() => this.catalogService.getCategoryById(this.categoryId()));

  categoryItems = computed(() => this.catalogService.getItemsByCategory(this.categoryId()));

  filteredCategoryItems = computed(() => {
    const sub = this.selectedSubcategory();
    const items = this.categoryItems();
    if (sub === 'all') return items;
    return items.filter(i => i.subcategoryId === sub);
  });

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
