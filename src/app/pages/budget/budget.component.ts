import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShoppingListService } from '../../services/shopping-list.service';
import { PreferencesService } from '../../services/preferences.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="budget-page" [attr.dir]="i18n.dir()">
      <!-- Page Header -->
      <div class="page-header">
        <h1>{{ i18n.t('budget.title') }}</h1>
        <p>{{ i18n.t('budget.subtitle') }}</p>
      </div>

      <!-- Target Budget Setting Card -->
      <div class="budget-target-card card">
        <div class="target-info">
          <h3>🎯 {{ i18n.t('budget.target_label') }}</h3>
          <p class="target-sub">
            {{ i18n.currentLang() === 'ar' ? 'حددي سقف ميزانيتك الإجمالية لمتابعة مصاريفك وتفادي التجاوز.' : 'Fixez votre plafond budgétaire global pour garder le contrôle de vos dépenses.' }}
          </p>
        </div>

        <div class="target-input-row">
          <div class="input-wrap">
            <input
              type="number"
              min="0"
              step="50"
              [(ngModel)]="tempTargetBudget"
              [placeholder]="i18n.t('budget.target_placeholder')"
              class="budget-num-input"
            />
            <span class="currency-tag">{{ i18n.currency() }}</span>
          </div>
          <button type="button" class="btn btn-primary" (click)="saveBudget()">
            {{ i18n.t('budget.target_save') }}
          </button>
        </div>
      </div>

      <!-- Financial Summary Cards -->
      <div class="summary-cards-grid">
        <!-- Card 1: Estimated Total -->
        <div class="summary-card card">
          <div class="card-icon-tag bg-primary">📊</div>
          <span class="card-title">{{ i18n.t('budget.est_total') }}</span>
          <h2 class="card-amount">
            {{ shoppingList.totalEstimatedCost() | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
          </h2>
          <span class="card-footnote">
            {{ shoppingList.budgetSummary().itemsWithEstimatedPrice }} / {{ shoppingList.totalItemsCount() }} {{ i18n.currentLang() === 'ar' ? 'عنصر بسعر مقدّر' : 'articles chiffrés' }}
          </span>
        </div>

        <!-- Card 2: Actual Spent -->
        <div class="summary-card card">
          <div class="card-icon-tag bg-success">💸</div>
          <span class="card-title">{{ i18n.t('budget.act_spent') }}</span>
          <h2 class="card-amount text-success">
            {{ shoppingList.totalActualSpent() | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
          </h2>
          <span class="card-footnote">
            {{ shoppingList.budgetSummary().itemsWithActualPrice }} {{ i18n.currentLang() === 'ar' ? 'مشتريات مسجلة' : 'articles payés' }}
          </span>
        </div>

        <!-- Card 3: Remaining Budget or Difference -->
        <div class="summary-card card">
          <div class="card-icon-tag bg-secondary">⚖️</div>
          <span class="card-title">{{ i18n.t('budget.remaining_allowed') }}</span>

          @if (shoppingList.budgetSummary().totalTargetBudget !== undefined) {
            @if ((shoppingList.budgetSummary().remainingBudget ?? 0) >= 0) {
              <h2 class="card-amount text-secondary">
                {{ shoppingList.budgetSummary().remainingBudget | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
              </h2>
              <span class="card-footnote text-success">
                ✓ {{ i18n.currentLang() === 'ar' ? 'الميزانية تحت السيطرة' : 'Dans les limites du budget' }}
              </span>
            } @else {
              <h2 class="card-amount text-danger">
                {{ Math.abs(shoppingList.budgetSummary().remainingBudget ?? 0) | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
              </h2>
              <span class="card-footnote text-danger">
                ⚠️ {{ i18n.t('budget.budget_exceeded') }}
              </span>
            }
          } @else {
            <h2 class="card-amount text-muted">--</h2>
            <span class="card-footnote">
              {{ i18n.t('home.budget_undefined') }}
            </span>
          }
        </div>
      </div>

      <!-- Unknown Price Notice Warning -->
      <div class="notice-banner card">
        <span class="notice-icon">💡</span>
        <p class="notice-text">
          {{ i18n.t('budget.unknown_prices_note') }}
        </p>
      </div>

      <!-- Category Spending Breakdown -->
      <div class="breakdown-card card">
        <div class="breakdown-header">
          <h2>{{ i18n.t('budget.spending_by_category') }}</h2>
          <span class="badge badge-primary">
            {{ shoppingList.categoryGroups().length }} {{ i18n.currentLang() === 'ar' ? 'أقسام نشطة' : 'catégories actives' }}
          </span>
        </div>

        <div class="category-bars-list">
          @for (group of shoppingList.categoryGroups(); track group.categoryId) {
            <div class="category-bar-row">
              <div class="bar-top">
                <span class="cat-label">
                  {{ group.categoryIcon }} {{ i18n.currentLang() === 'ar' ? group.categoryNameAr : group.categoryNameFr }}
                </span>
                <span class="cat-amounts">
                  @if (group.actualTotal > 0) {
                    <strong class="act">{{ group.actualTotal | number:'1.0-2' }} {{ i18n.currency() }}</strong>
                  }
                  <span class="est">(est. {{ group.estimatedTotal | number:'1.0-2' }} {{ i18n.currency() }})</span>
                </span>
              </div>

              <!-- Visual progress meter -->
              <div class="bar-track">
                <div
                  class="bar-fill"
                  [style.width]="getBarPercentage(group.actualTotal || group.estimatedTotal) + '%'"
                ></div>
              </div>

              <div class="bar-sub">
                <span>{{ group.purchasedCount }} / {{ group.totalItems }} {{ i18n.t('pdf.purchased') }}</span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .budget-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .page-header {
      h1 {
        font-size: 1.85rem;
        margin-bottom: 4px;
      }
      p {
        color: var(--color-text-muted);
      }
    }

    /* Target Budget Card */
    .budget-target-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(135deg, #ffffff 0%, #faf4f0 100%);

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .target-info {
        h3 {
          font-size: 1.15rem;
          margin-bottom: 4px;
        }
        .target-sub {
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }
      }

      .target-input-row {
        display: flex;
        gap: 10px;
        align-items: center;

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;

          .budget-num-input {
            width: 140px;
            padding: 10px 14px;
            padding-inline-end: 42px;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            font-size: 1.1rem;
            font-weight: 700;
            background: #fff;
            outline: none;

            &:focus {
              border-color: var(--color-primary);
            }
          }

          .currency-tag {
            position: absolute;
            inset-inline-end: 12px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--color-text-muted);
            pointer-events: none;
          }
        }
      }
    }

    /* Summary Grid */
    .summary-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-md);

      @media (min-width: 640px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .summary-card {
      display: flex;
      flex-direction: column;
      gap: 6px;
      position: relative;

      .card-icon-tag {
        width: 40px;
        height: 40px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        margin-bottom: 4px;

        &.bg-primary { background: var(--color-primary-light); }
        &.bg-success { background: var(--color-success-bg); }
        &.bg-secondary { background: var(--color-secondary-light); }
      }

      .card-title {
        font-size: 0.82rem;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .card-amount {
        font-size: 1.65rem;
        font-weight: 800;
        color: var(--color-text-main);

        small {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        &.text-success { color: var(--color-success); }
        &.text-secondary { color: var(--color-secondary); }
        &.text-danger { color: var(--color-danger); }
        &.text-muted { color: var(--color-text-light); }
      }

      .card-footnote {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        margin-top: auto;
      }
    }

    /* Notice banner */
    .notice-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      background: var(--color-accent-gold-light);
      border: 1px solid #ebd7af;
      padding: 12px 18px;

      .notice-icon {
        font-size: 1.4rem;
        flex-shrink: 0;
      }

      .notice-text {
        font-size: 0.88rem;
        color: #7c581a;
        margin: 0;
      }
    }

    /* Category Breakdown */
    .breakdown-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .breakdown-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        font-size: 1.25rem;
      }
    }

    .category-bars-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .category-bar-row {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .bar-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.95rem;

        .cat-label {
          font-weight: 600;
          color: var(--color-text-main);
        }

        .cat-amounts {
          display: flex;
          align-items: center;
          gap: 6px;

          .act {
            color: var(--color-primary);
          }

          .est {
            font-size: 0.85rem;
            color: var(--color-text-muted);
          }
        }
      }

      .bar-track {
        height: 10px;
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        overflow: hidden;

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary-light), var(--color-primary));
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }
      }

      .bar-sub {
        font-size: 0.78rem;
        color: var(--color-text-muted);
      }
    }
  `]
})
export class BudgetComponent {
  shoppingList = inject(ShoppingListService);
  preferences = inject(PreferencesService);
  i18n = inject(I18nService);
  toast = inject(ToastService);
  Math = Math;

  tempTargetBudget = signal<number | undefined>(
    this.preferences.preferences().totalBudget
  );

  saveBudget(): void {
    const val = this.tempTargetBudget();
    const cleanVal = val !== undefined && val !== null && !isNaN(val) ? Number(val) : undefined;
    this.preferences.setTargetBudget(cleanVal);
    this.toast.show(
      this.i18n.currentLang() === 'ar'
        ? 'تم تحديث ميزانيتك بنجاح 🎯'
        : 'Budget mis à jour avec succès 🎯'
    );
  }

  getBarPercentage(amount: number): number {
    const totalEst = this.shoppingList.totalEstimatedCost();
    if (!totalEst || totalEst === 0) return 0;
    return Math.min(100, Math.round((amount / totalEst) * 100));
  }
}
