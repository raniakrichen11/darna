import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShoppingListService } from '../../services/shopping-list.service';
import { CatalogService } from '../../services/catalog.service';
import { PreferencesService } from '../../services/preferences.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page" [attr.dir]="i18n.dir()">
      <!-- Hero Section -->
      <section class="hero-card card">
        <div class="hero-content">
          <div class="badge badge-traditional">
            ✨ {{ i18n.t('app.culture_badge') }}
          </div>
          <h1 class="hero-title">
            {{ i18n.t('home.welcome') }}
            @if (preferences.preferences().brideName) {
              <span>{{ preferences.preferences().brideName }}</span>
            }
          </h1>
          <p class="hero-subtitle">
            {{ i18n.t('app.subtitle') }}
          </p>

          <div class="hero-actions">
            <a routerLink="/catalog" class="btn btn-primary">
              <span>🛍️</span> {{ i18n.t('action.explore_catalog') }}
            </a>
            <a routerLink="/my-list" class="btn btn-outline">
              <span>📋</span> {{ i18n.t('action.continue_list') }}
            </a>
          </div>

          <div class="hero-image-wrap">
            <img src="assets/darna_hero.jpg" alt="Darna Trousseau Preview" class="hero-img" loading="lazy" />
          </div>
        </div>

        <!-- Progress Overview Widget -->
        <div class="progress-widget">
          <div class="progress-ring-container">
            <div class="circle-progress" [style.--progress]="shoppingList.progressPercentage() + '%'">
              <span class="percentage">{{ shoppingList.progressPercentage() }}%</span>
              <span class="pct-label">{{ i18n.t('home.progress_title') }}</span>
            </div>
          </div>

          <div class="progress-kpis">
            <div class="kpi-row">
              <span class="kpi-bullet purchased">●</span>
              <span class="kpi-label">{{ i18n.t('home.items_purchased') }}</span>
              <strong class="kpi-val">{{ shoppingList.purchasedItemsCount() }}</strong>
            </div>
            <div class="kpi-row">
              <span class="kpi-bullet remaining">●</span>
              <span class="kpi-label">{{ i18n.t('home.items_remaining') }}</span>
              <strong class="kpi-val">{{ shoppingList.remainingItemsCount() }}</strong>
            </div>
            <div class="kpi-row">
              <span class="kpi-bullet total">●</span>
              <span class="kpi-label">{{ i18n.t('home.total_planned') }}</span>
              <strong class="kpi-val">{{ shoppingList.totalItemsCount() }}</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- Budget Glance Banner -->
      <section class="budget-glance card">
        <div class="glance-item">
          <div class="glance-icon">💰</div>
          <div class="glance-info">
            <span class="glance-label">{{ i18n.t('home.budget_estimate') }}</span>
            <span class="glance-amount">{{ shoppingList.totalEstimatedCost() | number:'1.0-2' }} {{ i18n.currency() }}</span>
          </div>
        </div>

        <div class="glance-divider"></div>

        <div class="glance-item">
          <div class="glance-icon">🛍️</div>
          <div class="glance-info">
            <span class="glance-label">{{ i18n.t('home.budget_spent') }}</span>
            <span class="glance-amount spent">{{ shoppingList.totalActualSpent() | number:'1.0-2' }} {{ i18n.currency() }}</span>
          </div>
        </div>

        <div class="glance-divider"></div>

        <div class="glance-item">
          <div class="glance-icon">⚖️</div>
          <div class="glance-info">
            <span class="glance-label">{{ i18n.t('home.budget_balance') }}</span>
            @if (shoppingList.budgetSummary().remainingBudget !== undefined) {
              <span class="glance-amount" [class.negative]="(shoppingList.budgetSummary().remainingBudget ?? 0) < 0">
                {{ shoppingList.budgetSummary().remainingBudget | number:'1.0-2' }} {{ i18n.currency() }}
              </span>
            } @else {
              <span class="glance-amount undefined">
                <a routerLink="/budget">{{ i18n.t('home.budget_undefined') }}</a>
              </span>
            }
          </div>
        </div>
      </section>

      <!-- Category Shortcuts Grid -->
      <section class="categories-section">
        <div class="section-header">
          <h2>{{ i18n.t('home.categories_heading') }}</h2>
          <a routerLink="/catalog" class="see-all-link">
            {{ i18n.t('catalog.all_categories') }} →
          </a>
        </div>

        <div class="categories-grid">
          @for (category of catalogService.categories(); track category.id) {
            <a [routerLink]="['/catalog', category.id]" class="category-card card interactive">
              <div class="cat-icon-wrap">{{ category.icon }}</div>
              <div class="cat-details">
                <h3>{{ i18n.currentLang() === 'ar' ? category.nameAr : category.nameFr }}</h3>
                <p>{{ i18n.currentLang() === 'ar' ? category.descriptionAr : category.descriptionFr }}</p>
              </div>
              <div class="cat-count-badge">
                {{ catalogService.getCategoryItemCount(category.id) }}
              </div>
            </a>
          }
        </div>
      </section>

      <!-- Recently Added Items -->
      <section class="recent-items-section card">
        <div class="section-header">
          <h2>{{ i18n.t('home.recent_items') }}</h2>
          <a routerLink="/my-list" class="see-all-link">
            {{ i18n.t('action.continue_list') }} →
          </a>
        </div>

        @if (shoppingList.recentItems().length === 0) {
          <div class="empty-recent">
            <p>{{ i18n.t('home.empty_recent') }}</p>
            <a routerLink="/catalog" class="btn btn-subtle btn-sm">
              {{ i18n.t('action.explore_catalog') }}
            </a>
          </div>
        } @else {
          <div class="recent-list">
            @for (item of shoppingList.recentItems(); track item.id) {
              <div class="recent-item-row" [class.is-done]="item.isPurchased">
                <button
                  type="button"
                  class="checkbox-btn"
                  [class.checked]="item.isPurchased"
                  (click)="shoppingList.togglePurchased(item.id)"
                  [title]="item.isPurchased ? i18n.t('action.mark_unpurchased') : i18n.t('action.mark_purchased')"
                >
                  {{ item.isPurchased ? '✓' : '' }}
                </button>
                <div class="item-meta">
                  <span class="item-name">{{ shoppingList.getItemDisplayName(item) }}</span>
                  <span class="item-sub">
                    {{ i18n.t('list.quantity') }}: {{ item.quantity }}
                    @if (item.estimatedUnitPrice) {
                      • {{ item.estimatedUnitPrice * item.quantity | number:'1.0-2' }} {{ i18n.currency() }}
                    }
                  </span>
                </div>
                <div class="status-indicator">
                  @if (item.isPurchased) {
                    <span class="badge badge-success">{{ i18n.t('pdf.status_done') }}</span>
                  } @else {
                    <span class="badge badge-primary">{{ i18n.t('pdf.status_todo') }}</span>
                  }
                </div>
              </div>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    /* Hero */
    .hero-card {
      background: linear-gradient(135deg, #ffffff 0%, #faf3ee 100%);
      border: 1px solid var(--color-border);
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-xl);
      align-items: center;

      @media (min-width: 840px) {
        grid-template-columns: 1.2fr 0.8fr;
        padding: var(--space-2xl);
      }
    }

    .hero-title {
      font-size: 1.8rem;
      margin: 12px 0 8px;
      color: var(--color-text-main);

      span {
        color: var(--color-primary);
      }
    }

    .hero-subtitle {
      font-size: 1.05rem;
      color: var(--color-text-muted);
      margin-bottom: 24px;
      max-width: 480px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    .hero-image-wrap {
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
      max-height: 180px;

      .hero-img {
        width: 100%;
        height: 100%;
        max-height: 180px;
        object-fit: cover;
        display: block;
      }
    }

    /* Progress Widget */
    .progress-widget {
      background: var(--color-surface);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-md);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-xs);

      @media (min-width: 500px) {
        flex-direction: row;
        justify-content: space-around;
      }
    }

    .circle-progress {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background: radial-gradient(closest-side, white 76%, transparent 77% 100%),
                  conic-gradient(var(--color-primary) var(--progress), #ebdcd4 0);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);

      .percentage {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--color-primary);
        line-height: 1;
      }

      .pct-label {
        font-size: 0.68rem;
        text-align: center;
        color: var(--color-text-muted);
        margin-top: 2px;
        padding: 0 4px;
      }
    }

    .progress-kpis {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 170px;

      .kpi-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.9rem;
      }

      .kpi-bullet {
        font-size: 1.1rem;
        margin-inline-end: 8px;

        &.purchased { color: var(--color-success); }
        &.remaining { color: var(--color-primary); }
        &.total { color: var(--color-accent-gold); }
      }

      .kpi-label {
        flex: 1;
        color: var(--color-text-muted);
      }

      .kpi-val {
        color: var(--color-text-main);
        font-weight: 700;
      }
    }

    /* Budget Glance */
    .budget-glance {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .glance-item {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
    }

    .glance-icon {
      font-size: 1.8rem;
      width: 48px;
      height: 48px;
      background: var(--color-surface-subtle);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .glance-info {
      display: flex;
      flex-direction: column;

      .glance-label {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .glance-amount {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-text-main);

        &.spent {
          color: var(--color-primary);
        }

        &.negative {
          color: var(--color-danger);
        }

        &.undefined a {
          font-size: 0.88rem;
          color: var(--color-secondary);
          text-decoration: underline;
        }
      }
    }

    .glance-divider {
      height: 1px;
      background: var(--color-border-subtle);

      @media (min-width: 768px) {
        width: 1px;
        height: 40px;
      }
    }

    /* Categories Grid */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);

      h2 {
        font-size: 1.35rem;
      }

      .see-all-link {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-primary);
      }
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--space-md);
    }

    .category-card {
      padding: var(--space-md);
      display: flex;
      align-items: center;
      gap: 14px;
      position: relative;
      text-decoration: none;

      .cat-icon-wrap {
        font-size: 1.9rem;
        min-width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        background: var(--color-primary-light);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cat-details {
        flex: 1;

        h3 {
          font-size: 0.98rem;
          color: var(--color-text-main);
          margin-bottom: 2px;
        }

        p {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      }

      .cat-count-badge {
        font-size: 0.75rem;
        font-weight: 700;
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border);
        color: var(--color-text-muted);
        padding: 2px 8px;
        border-radius: var(--radius-full);
      }
    }

    /* Recent Items */
    .recent-list {
      display: flex;
      flex-direction: column;
      divide-y: 1px solid var(--color-border-subtle);
    }

    .recent-item-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid var(--color-border-subtle);

      &:last-child {
        border-bottom: none;
      }

      &.is-done .item-name {
        text-decoration: line-through;
        color: var(--color-text-muted);
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

    .item-meta {
      flex: 1;
      display: flex;
      flex-direction: column;

      .item-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-text-main);
      }

      .item-sub {
        font-size: 0.8rem;
        color: var(--color-text-muted);
      }
    }

    .empty-recent {
      text-align: center;
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class HomeComponent {
  shoppingList = inject(ShoppingListService);
  catalogService = inject(CatalogService);
  preferences = inject(PreferencesService);
  i18n = inject(I18nService);
}
