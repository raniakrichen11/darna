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
      <!-- Editorial Hero Section -->
      <section class="hero-editorial">
        <div class="hero-text-block">
          <div class="hero-pill-badge">
            <span class="badge-dot"></span>
            <span>{{ i18n.t('app.culture_badge') }}</span>
          </div>

          <h1 class="hero-headline">
            {{ i18n.t('app.headline') }}
            @if (preferences.preferences().brideName) {
              <span class="bride-highlight">, {{ preferences.preferences().brideName }}</span>
            }
          </h1>

          <p class="hero-subtext">
            {{ i18n.t('app.subtitle') }}
          </p>

          <div class="hero-action-buttons">
            <a routerLink="/my-list" class="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              <span>{{ i18n.t('action.continue_list') }}</span>
            </a>
            <a routerLink="/catalog" class="btn btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>{{ i18n.t('action.explore_catalog') }}</span>
            </a>
          </div>
        </div>

        <div class="hero-visual-frame">
          <img
            src="assets/darna_hero.jpg"
            alt="Darna Editorial Lifestyle Trousseau"
            class="hero-editorial-img"
          />
          <div class="hero-caption">
            <span>{{ i18n.currentLang() === 'ar' ? 'طبعة تونسية · جهاز العروس والبيت الجديد' : 'Édition Tunisienne · Trousseau de Mariage' }}</span>
          </div>
        </div>
      </section>

      <!-- Refined Progress & Budget Strip -->
      <section class="overview-strip card">
        <!-- Progress Block -->
        <div class="strip-progress-block">
          <div class="progress-arc-wrapper">
            <div class="progress-number">
              <span class="pct">{{ shoppingList.progressPercentage() }}%</span>
              <span class="pct-sub">{{ i18n.t('home.progress_title') }}</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" [style.width]="shoppingList.progressPercentage() + '%'"></div>
            </div>
          </div>

          <div class="progress-counts">
            <div class="count-item">
              <span class="count-bullet purchased">●</span>
              <span class="count-label">{{ i18n.t('home.items_purchased') }} :</span>
              <strong>{{ shoppingList.purchasedItemsCount() }}</strong>
            </div>
            <div class="count-item">
              <span class="count-bullet remaining">●</span>
              <span class="count-label">{{ i18n.t('home.items_remaining') }} :</span>
              <strong>{{ shoppingList.remainingItemsCount() }}</strong>
            </div>
            <div class="count-item">
              <span class="count-bullet total">●</span>
              <span class="count-label">{{ i18n.t('home.total_planned') }} :</span>
              <strong>{{ shoppingList.totalItemsCount() }}</strong>
            </div>
          </div>
        </div>

        <div class="strip-vertical-divider"></div>

        <!-- Budget Glance Block -->
        <div class="strip-budget-block">
          <div class="budget-kpi">
            <span class="kpi-tag">{{ i18n.t('home.budget_estimate') }}</span>
            <span class="kpi-value">{{ shoppingList.totalEstimatedCost() | number:'1.0-2' }} <small>{{ i18n.currency() }}</small></span>
          </div>
          <div class="budget-kpi">
            <span class="kpi-tag">{{ i18n.t('home.budget_spent') }}</span>
            <span class="kpi-value text-burgundy">{{ shoppingList.totalActualSpent() | number:'1.0-2' }} <small>{{ i18n.currency() }}</small></span>
          </div>
          <div class="budget-kpi">
            <span class="kpi-tag">{{ i18n.t('home.budget_balance') }}</span>
            @if (shoppingList.budgetSummary().remainingBudget !== undefined) {
              <span class="kpi-value" [class.negative]="(shoppingList.budgetSummary().remainingBudget ?? 0) < 0">
                {{ shoppingList.budgetSummary().remainingBudget | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
              </span>
            } @else {
              <span class="kpi-value text-muted-link">
                <a routerLink="/budget">{{ i18n.t('home.budget_undefined') }} {{ i18n.isRtl() ? '←' : '→' }}</a>
              </span>
            }
          </div>
        </div>
      </section>

      <!-- Curated Category Discovery (Magazine Boutique Cards) -->
      <section class="curated-section">
        <div class="section-title-row">
          <div>
            <h2>{{ i18n.t('home.categories_heading') }}</h2>
            <p class="section-sub">{{ i18n.currentLang() === 'ar' ? 'استكشفي أركان وتجهيزات بيتكِ الجديد بكل تفاصيلها.' : (i18n.currentLang() === 'en' ? 'Explore every world of your future home with serenity and care.' : 'Explorez chaque univers de votre futur intérieur avec soin et sérénité.') }}</p>
          </div>
          <a routerLink="/catalog" class="editorial-see-all">
            {{ i18n.t('catalog.all_categories') }} {{ i18n.isRtl() ? '←' : '→' }}
          </a>
        </div>

        <div class="curated-grid">
          @for (cat of featuredCategories; track cat.id) {
            <a [routerLink]="['/catalog', cat.id]" class="curated-card">
              <div class="card-img-wrap">
                <img [src]="cat.image || 'assets/cat_kitchen.jpg'" [alt]="catalogService.getCategoryName(cat)" class="cat-img" loading="lazy" />
                <div class="card-overlay"></div>
                <div class="card-badge">
                  <span>{{ catalogService.getCategoryItemCount(cat.id) }} {{ i18n.t('catalog.items_count') }}</span>
                </div>
              </div>
              <div class="card-body">
                <div class="card-icon-emblem">{{ cat.icon }}</div>
                <h3>{{ catalogService.getCategoryName(cat) }}</h3>
                <p>{{ catalogService.getCategoryDesc(cat) }}</p>
              </div>
            </a>
          }
        </div>
      </section>

      <!-- Recent Shopping Activity -->
      <section class="recent-activity-section card">
        <div class="section-title-row">
          <div>
            <h2>{{ i18n.t('home.recent_items') }}</h2>
            <p class="section-sub">{{ i18n.currentLang() === 'ar' ? 'تابعي آخر الإضافات وحددي ما تم شراؤه بنقرة واحدة.' : 'Vos dernières sélections prêtes à être cochées lors de vos visites.' }}</p>
          </div>
          <a routerLink="/my-list" class="editorial-see-all">
            {{ i18n.t('action.continue_list') }} {{ i18n.isRtl() ? '←' : '→' }}
          </a>
        </div>

        @if (shoppingList.recentItems().length === 0) {
          <div class="empty-welcome-box">
            <div class="empty-emblem">🕊️</div>
            <h3>{{ i18n.t('home.empty_recent') }}</h3>
            <p>{{ i18n.currentLang() === 'ar' ? 'ابدئي باختيار الأساسيات من الدليل أو أضيفي مشترياتك الخاصة.' : 'Parcourez les suggestions d’articles traditionnels et modernes pour créer votre trousseau idéal.' }}</p>
            <a routerLink="/catalog" class="btn btn-primary btn-sm">
              {{ i18n.t('action.explore_catalog') }}
            </a>
          </div>
        } @else {
          <div class="recent-checklist">
            @for (item of shoppingList.recentItems(); track item.id) {
              <div class="recent-row" [class.is-done]="item.isPurchased">
                <button
                  type="button"
                  class="custom-check-btn"
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

                <div class="recent-item-info">
                  <span class="recent-name">{{ shoppingList.getItemDisplayName(item) }}</span>
                  <span class="recent-meta">
                    {{ i18n.t('list.quantity') }}: {{ item.quantity }}
                    @if (item.estimatedUnitPrice) {
                      · {{ (item.estimatedUnitPrice * item.quantity) | number:'1.0-2' }} {{ i18n.currency() }}
                    }
                  </span>
                </div>

                <div class="recent-status">
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

    /* Editorial Hero */
    .hero-editorial {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-xl);
      align-items: center;
      padding: var(--space-md) 0 var(--space-lg);

      @media (min-width: 920px) {
        grid-template-columns: 1.15fr 0.85fr;
        padding: var(--space-lg) 0 var(--space-xl);
      }
    }

    .hero-pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      border-radius: var(--radius-full);
      background: var(--color-bg-sand);
      border: 1px solid var(--color-border);
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--color-primary);
      margin-bottom: 16px;
      letter-spacing: 0.03em;

      .badge-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--color-primary);
      }
    }

    .hero-headline {
      margin-bottom: 14px;
      color: var(--color-text-main);

      .bride-highlight {
        color: var(--color-primary);
        font-style: italic;
      }
    }

    .hero-subtext {
      font-size: 1.05rem;
      color: var(--color-text-muted);
      line-height: 1.7;
      margin-bottom: 28px;
      max-width: 520px;
    }

    .hero-action-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    /* Hero Visual Frame */
    .hero-visual-frame {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg-sand);
      max-height: 380px;

      .hero-editorial-img {
        width: 100%;
        height: 100%;
        max-height: 380px;
        object-fit: cover;
        display: block;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }

      &:hover .hero-editorial-img {
        transform: scale(1.02);
      }

      .hero-caption {
        position: absolute;
        bottom: 12px;
        left: 12px;
        right: 12px;
        background: rgba(255, 255, 255, 0.88);
        backdrop-filter: blur(8px);
        padding: 8px 14px;
        border-radius: var(--radius-md);
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text-main);
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border: 1px solid rgba(232, 224, 216, 0.8);
      }
    }

    /* Overview Progress & Budget Strip */
    .overview-strip {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
      padding: var(--space-lg) var(--space-xl);
      background: #FFFFFF;

      @media (min-width: 860px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .strip-progress-block {
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex: 1.1;

      .progress-arc-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .progress-number {
          display: flex;
          align-items: baseline;
          gap: 10px;

          .pct {
            font-size: 1.85rem;
            font-weight: 700;
            color: var(--color-primary);
            line-height: 1;
            font-family: var(--font-serif);
          }

          .pct-sub {
            font-size: 0.85rem;
            color: var(--color-text-muted);
            font-weight: 500;
          }
        }

        .progress-bar-track {
          width: 100%;
          height: 6px;
          border-radius: var(--radius-full);
          background: var(--color-bg-sand);
          overflow: hidden;

          .progress-bar-fill {
            height: 100%;
            border-radius: var(--radius-full);
            background: linear-gradient(90deg, var(--color-secondary), var(--color-primary));
            transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
        }
      }

      .progress-counts {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        font-size: 0.82rem;

        .count-item {
          display: flex;
          align-items: center;
          gap: 6px;

          .count-bullet {
            font-size: 0.8rem;
            &.purchased { color: var(--color-success); }
            &.remaining { color: var(--color-primary); }
            &.total { color: var(--color-accent-gold); }
          }

          .count-label {
            color: var(--color-text-muted);
          }

          strong {
            color: var(--color-text-main);
          }
        }
      }
    }

    .strip-vertical-divider {
      height: 1px;
      background: var(--color-border-subtle);

      @media (min-width: 860px) {
        width: 1px;
        height: 60px;
      }
    }

    .strip-budget-block {
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;

      @media (min-width: 520px) {
        flex-direction: row;
        justify-content: space-between;
      }

      .budget-kpi {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .kpi-tag {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .kpi-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text-main);

          small {
            font-size: 0.85rem;
            color: var(--color-text-muted);
          }

          &.text-burgundy {
            color: var(--color-primary);
          }

          &.negative {
            color: var(--color-danger);
          }

          &.text-muted-link a {
            font-size: 0.85rem;
            color: var(--color-secondary);
            text-decoration: underline;
          }
        }
      }
    }

    /* Curated Section */
    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: var(--space-md);

      h2 {
        margin-bottom: 2px;
      }

      .section-sub {
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }

      .editorial-see-all {
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--color-primary);
        letter-spacing: 0.01em;
        white-space: nowrap;
        margin-inline-start: 12px;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .curated-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-md);

      @media (min-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 960px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .curated-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-md);
      overflow: hidden;
      text-decoration: none;
      box-shadow: var(--shadow-xs);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.2s;
      display: flex;
      flex-direction: column;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-md);
        border-color: var(--color-border-strong);
      }

      .card-img-wrap {
        position: relative;
        height: 160px;
        overflow: hidden;
        background: var(--color-bg-sand);

        .cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(48, 41, 39, 0.4) 100%);
        }

        .card-badge {
          position: absolute;
          bottom: 10px;
          inset-inline-start: 10px;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(6px);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-main);
          padding: 3px 9px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(232, 224, 216, 0.8);
        }
      }

      &:hover .cat-img {
        transform: scale(1.06);
      }

      .card-body {
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .card-icon-emblem {
          font-size: 1.25rem;
          margin-bottom: 2px;
        }

        h3 {
          font-size: 1rem;
          color: var(--color-text-main);
          line-height: 1.3;
        }

        p {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.45;
        }
      }
    }

    /* Recent Checklist */
    .recent-checklist {
      display: flex;
      flex-direction: column;
    }

    .recent-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid var(--color-border-subtle);

      &:last-child {
        border-bottom: none;
      }

      &.is-done .recent-name {
        text-decoration: line-through;
        color: var(--color-text-light);
      }
    }

    .custom-check-btn {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1.8px solid var(--color-border-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
      background: #FFFFFF;

      &.checked {
        background: var(--color-success);
        border-color: var(--color-success);
      }

      &:hover:not(.checked) {
        border-color: var(--color-primary);
        background: var(--color-primary-light);
      }
    }

    .recent-item-info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .recent-name {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-text-main);
      }

      .recent-meta {
        font-size: 0.8rem;
        color: var(--color-text-muted);
      }
    }

    .empty-welcome-box {
      text-align: center;
      padding: var(--space-xl) var(--space-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .empty-emblem {
        font-size: 3rem;
      }

      h3 {
        font-size: 1.25rem;
        color: var(--color-text-main);
      }

      p {
        max-width: 440px;
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }
    }
  `]
})
export class HomeComponent {
  shoppingList = inject(ShoppingListService);
  catalogService = inject(CatalogService);
  preferences = inject(PreferencesService);
  i18n = inject(I18nService);

  get featuredCategories() {
    const ids = [
      'cuisine-ustensiles',
      'vaisselle-service',
      'chambre-literie',
      'salle-de-bain',
      'salon-decoration',
      'trousseau-mariee'
    ];
    return ids.map(id => this.catalogService.getCategoryById(id)).filter(Boolean) as any[];
  }
}
