import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ShoppingListService } from '../../services/shopping-list.service';
import { PreferencesService } from '../../services/preferences.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { ItemPriority } from '../../models/shopping-list.model';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="budget-page" [attr.dir]="i18n.dir()">
      <!-- Page Header -->
      <header class="page-header">
        <span class="page-eyebrow">{{ i18n.currentLang() === 'ar' ? 'متابعة الميزانية والمصاريف' : 'SUIVI FINANCIER & BUDGET' }}</span>
        <h1 class="page-title">{{ i18n.t('budget.title') }}</h1>
        <p class="page-subtitle">{{ i18n.t('budget.subtitle') }}</p>
      </header>

      <!-- Target Budget Setting Card -->
      <section class="budget-target-card">
        <div class="target-info">
          <div class="target-badge">🎯 {{ i18n.t('budget.target_label') }}</div>
          <p class="target-sub">
            {{ i18n.currentLang() === 'ar' ? 'حددي سقف ميزانيتك الإجمالية لمتابعة مصاريفك وتفادي التجاوز.' : (i18n.currentLang() === 'en' ? 'Set your overall budget limit to manage expenses and avoid overspending.' : 'Fixez votre plafond budgétaire global pour garder le contrôle de vos dépenses.') }}
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
      </section>

      <!-- Financial Summary Cards -->
      <section class="summary-cards-grid">
        <!-- Card 1: Estimated Total -->
        <div class="summary-card">
          <div class="card-top">
            <span class="card-eyebrow">{{ i18n.t('budget.est_total') }}</span>
            <div class="card-icon-pill pill-terracotta">📊</div>
          </div>
          <div class="card-amount">
            {{ shoppingList.totalEstimatedCost() | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
          </div>
          <div class="card-footer">
            <span class="dot-indicator dot-terracotta"></span>
            {{ shoppingList.budgetSummary().itemsWithEstimatedPrice }} / {{ shoppingList.totalItemsCount() }} {{ i18n.currentLang() === 'ar' ? 'عنصر بسعر مقدّر' : 'articles chiffrés' }}
          </div>
        </div>

        <!-- Card 2: Actual Spent -->
        <div class="summary-card">
          <div class="card-top">
            <span class="card-eyebrow">{{ i18n.t('budget.act_spent') }}</span>
            <div class="card-icon-pill pill-sage">💸</div>
          </div>
          <div class="card-amount text-sage">
            {{ shoppingList.totalActualSpent() | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
          </div>
          <div class="card-footer">
            <span class="dot-indicator dot-sage"></span>
            {{ shoppingList.budgetSummary().itemsWithActualPrice }} {{ i18n.currentLang() === 'ar' ? 'مشتريات مسجلة' : 'articles payés' }}
          </div>
        </div>

        <!-- Card 3: Remaining Budget or Difference -->
        <div class="summary-card" [class.card-alert]="shoppingList.budgetSummary().totalTargetBudget !== undefined && (shoppingList.budgetSummary().remainingBudget ?? 0) < 0">
          <div class="card-top">
            <span class="card-eyebrow">{{ i18n.t('budget.remaining_allowed') }}</span>
            <div class="card-icon-pill pill-burgundy">⚖️</div>
          </div>

          @if (shoppingList.budgetSummary().totalTargetBudget !== undefined) {
            @if ((shoppingList.budgetSummary().remainingBudget ?? 0) >= 0) {
              <div class="card-amount text-burgundy">
                {{ shoppingList.budgetSummary().remainingBudget | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
              </div>
              <div class="card-footer text-sage">
                ✓ {{ i18n.currentLang() === 'ar' ? 'الميزانية تحت السيطرة' : 'Dans les limites du budget' }}
              </div>
            } @else {
              <div class="card-amount text-danger">
                {{ Math.abs(shoppingList.budgetSummary().remainingBudget ?? 0) | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
              </div>
              <div class="card-footer text-danger">
                ⚠️ {{ i18n.t('budget.budget_exceeded') }}
              </div>
            }
          } @else {
            <div class="card-amount text-muted">--</div>
            <div class="card-footer">
              {{ i18n.t('home.budget_undefined') }}
            </div>
          }
        </div>

        <!-- Card 4: Realized Savings (if any) or Progress -->
        <div class="summary-card">
          <div class="card-top">
            <span class="card-eyebrow">{{ i18n.t('budget.realized_savings') }}</span>
            <div class="card-icon-pill pill-sand">🏷️</div>
          </div>
          @if (shoppingList.totalSavings() > 0) {
            <div class="card-amount text-sage">
              +{{ shoppingList.totalSavings() | number:'1.0-2' }} <small>{{ i18n.currency() }}</small>
            </div>
            <div class="card-footer text-sage">
              ✨ {{ i18n.currentLang() === 'ar' ? 'مبالغ موفّرة بأقل من التقديرات' : 'Économisés sous vos prévisions' }}
            </div>
          } @else {
            <div class="card-amount text-muted">0.00 <small>{{ i18n.currency() }}</small></div>
            <div class="card-footer text-muted">
              {{ i18n.currentLang() === 'ar' ? 'متابعة الصفقات والأسعار' : 'Achats au prix ou devis respectés' }}
            </div>
          }
        </div>
      </section>

      <!-- Unknown Price Notice Warning -->
      <div class="notice-banner">
        <span class="notice-icon">💡</span>
        <p class="notice-text">
          {{ i18n.t('budget.unknown_prices_note') }}
        </p>
      </div>

      <!-- Top 5 Expense Drivers Section -->
      @if (shoppingList.topExpenseItems().length > 0) {
        <section class="breakdown-section top-expenses-section">
          <div class="breakdown-header">
            <div class="breakdown-title-wrap">
              <span class="breakdown-eyebrow">TOP INVESTISSEMENTS</span>
              <h2 class="breakdown-title">{{ i18n.t('budget.top_expenses') }}</h2>
            </div>
            <span class="badge-cat-count">
              {{ shoppingList.topExpenseItems().length }} {{ i18n.currentLang() === 'ar' ? 'مستلزمات رئيسية' : 'postes majeurs' }}
            </span>
          </div>

          <div class="top-expenses-list">
            @for (item of shoppingList.topExpenseItems(); track item.id; let idx = $index) {
              <div class="top-expense-row">
                <div class="rank-badge">#{{ idx + 1 }}</div>
                <div class="expense-info">
                  <div class="expense-name">
                    {{ shoppingList.getItemDisplayName(item) }}
                  </div>
                  <div class="expense-sub">
                    <span>{{ item.quantity }} × {{ (item.actualUnitPrice ?? item.estimatedUnitPrice) | number:'1.0-2' }} {{ i18n.currency() }}</span>
                    @if (item.priority) {
                      <span class="expense-prio">{{ getPriorityLabel(item.priority) }}</span>
                    }
                    @if (item.purchaseLocation) {
                      <span class="expense-store">📍 {{ item.purchaseLocation }}</span>
                    }
                  </div>
                </div>
                <div class="expense-total">
                  <strong>{{ ((item.actualUnitPrice ?? item.estimatedUnitPrice ?? 0) * item.quantity) | number:'1.0-2' }}</strong>
                  <small>{{ i18n.currency() }}</small>
                </div>
              </div>
            }
          </div>
        </section>
      }

      <!-- Category Spending Breakdown -->
      <section class="breakdown-section">
        <div class="breakdown-header">
          <div class="breakdown-title-wrap">
            <span class="breakdown-eyebrow">{{ i18n.currentLang() === 'ar' ? 'توزيع التكاليف' : 'RÉPARTITION' }}</span>
            <h2 class="breakdown-title">{{ i18n.t('budget.spending_by_category') }}</h2>
          </div>
          <span class="badge-cat-count">
            {{ shoppingList.categoryGroups().length }} {{ i18n.currentLang() === 'ar' ? 'أقسام نشطة' : (i18n.currentLang() === 'en' ? 'active categories' : 'catégories') }}
          </span>
        </div>

        <div class="category-bars-list">
          @for (group of shoppingList.categoryGroups(); track group.categoryId) {
            <div class="category-bar-row">
              <div class="bar-top">
                <div class="cat-label-wrap">
                  <span class="cat-icon-badge">{{ group.categoryIcon }}</span>
                  <span class="cat-label">{{ i18n.currentLang() === 'ar' ? group.categoryNameAr : (i18n.currentLang() === 'en' ? (group.categoryNameEn || group.categoryNameFr) : group.categoryNameFr) }}</span>
                </div>
                <div class="cat-amounts">
                  @if (group.actualTotal > 0) {
                    <strong class="act">{{ group.actualTotal | number:'1.0-2' }} {{ i18n.currency() }}</strong>
                  }
                  <span class="est">({{ i18n.currentLang() === 'ar' ? 'تقديري ' : 'est. ' }}{{ group.estimatedTotal | number:'1.0-2' }} {{ i18n.currency() }})</span>
                </div>
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
                <span class="bar-percentage">{{ getBarPercentage(group.actualTotal || group.estimatedTotal) }}% {{ i18n.currentLang() === 'ar' ? 'من الإجمالي' : (i18n.currentLang() === 'en' ? 'of total' : 'du budget est.') }}</span>
              </div>

              <!-- Category Budget Target allocation & editor -->
              <div class="cat-budget-target-row">
                <div class="cat-target-display">
                  <span class="cat-target-title">{{ i18n.t('budget.cat_budget_target') }}</span>
                  @if (preferences.preferences().categoryBudgets?.[group.categoryId]; as catBudget) {
                    <strong class="cat-target-num">{{ catBudget | number:'1.0-2' }} {{ i18n.currency() }}</strong>
                    @if ((group.actualTotal || group.estimatedTotal) > catBudget) {
                      <span class="badge-cat-warning">⚠️ {{ i18n.currentLang() === 'ar' ? 'تجاوز' : 'dépassement' }}</span>
                    } @else {
                      <span class="badge-cat-ok">✓ {{ i18n.currentLang() === 'ar' ? 'ضمن السقف' : 'respecté' }}</span>
                    }
                  } @else {
                    <span class="text-muted">{{ i18n.currentLang() === 'ar' ? 'غير محدد' : 'Non alloué' }}</span>
                  }
                </div>

                @if (editingCatId() === group.categoryId) {
                  <div class="cat-budget-inline-edit">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      [ngModel]="catBudgetValue()"
                      (ngModelChange)="catBudgetValue.set($event)"
                      [placeholder]="'0 ' + i18n.currency()"
                      class="cat-budget-input"
                    />
                    <button type="button" class="btn btn-sm btn-primary" (click)="saveCatBudget(group.categoryId)">
                      OK
                    </button>
                    <button type="button" class="btn btn-sm btn-outline" (click)="editingCatId.set(null)">
                      ✕
                    </button>
                  </div>
                } @else {
                  <button
                    type="button"
                    class="btn-text-edit"
                    (click)="editCatBudget(group.categoryId, preferences.preferences().categoryBudgets?.[group.categoryId])"
                  >
                    ✏️ {{ i18n.t('budget.set_cat_budget') }}
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .budget-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .page-header {
      margin-bottom: var(--space-xs);

      .page-eyebrow {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-weight: 600;
        color: var(--color-terracotta);
        display: block;
        margin-bottom: 4px;
      }

      .page-title {
        font-family: var(--font-serif);
        font-size: 2.2rem;
        color: var(--color-burgundy);
        line-height: 1.15;
        margin-bottom: 6px;
      }

      .page-subtitle {
        color: var(--color-text-muted);
        font-size: 0.95rem;
      }
    }

    /* Target Budget Card */
    .budget-target-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-sand) 100%);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }

      .target-info {
        .target-badge {
          font-family: var(--font-serif);
          font-size: 1.25rem;
          color: var(--color-burgundy);
          margin-bottom: 4px;
          font-weight: 600;
        }

        .target-sub {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          max-width: 440px;
        }
      }

      .target-input-row {
        display: flex;
        gap: 12px;
        align-items: center;

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;

          .budget-num-input {
            width: 150px;
            padding: 10px 14px;
            padding-inline-end: 46px;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            font-size: 1.1rem;
            font-weight: 700;
            background: var(--color-surface);
            color: var(--color-charcoal);
            outline: none;
            transition: all 0.2s ease;

            &:focus {
              border-color: var(--color-burgundy);
              box-shadow: 0 0 0 3px rgba(113, 59, 72, 0.12);
            }
          }

          .currency-tag {
            position: absolute;
            inset-inline-end: 12px;
            font-size: 0.8rem;
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

      @media (min-width: 680px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .summary-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: var(--shadow-sm);
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }

      &.card-alert {
        border-color: rgba(179, 57, 57, 0.35);
        background: #fffafa;
      }

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .card-eyebrow {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .card-icon-pill {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;

          &.pill-terracotta {
            background: rgba(183, 125, 114, 0.15);
          }
          &.pill-sage {
            background: rgba(113, 136, 117, 0.15);
          }
          &.pill-burgundy {
            background: rgba(113, 59, 72, 0.12);
          }
        }
      }

      .card-amount {
        font-family: var(--font-serif);
        font-size: 1.85rem;
        font-weight: 700;
        color: var(--color-charcoal);
        line-height: 1.1;

        small {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--color-text-muted);
        }

        &.text-sage {
          color: var(--color-sage);
        }
        &.text-burgundy {
          color: var(--color-burgundy);
        }
        &.text-danger {
          color: #b33939;
        }
        &.text-muted {
          color: var(--color-text-light);
        }
      }

      .card-footer {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        margin-top: auto;
        display: flex;
        align-items: center;
        gap: 6px;

        .dot-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;

          &.dot-terracotta {
            background-color: var(--color-terracotta);
          }
          &.dot-sage {
            background-color: var(--color-sage);
          }
        }

        &.text-sage {
          color: var(--color-sage);
          font-weight: 500;
        }
        &.text-danger {
          color: #b33939;
          font-weight: 600;
        }
      }
    }

    /* Notice banner */
    .notice-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--color-sand);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 14px 18px;

      .notice-icon {
        font-size: 1.25rem;
        line-height: 1;
        flex-shrink: 0;
      }

      .notice-text {
        font-size: 0.88rem;
        color: var(--color-charcoal);
        margin: 0;
        line-height: 1.5;
      }
    }

    /* Category Breakdown */
    .breakdown-section {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .breakdown-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--color-border);

      .breakdown-eyebrow {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 600;
        color: var(--color-terracotta);
        display: block;
      }

      .breakdown-title {
        font-family: var(--font-serif);
        font-size: 1.45rem;
        color: var(--color-burgundy);
        margin: 0;
      }

      .badge-cat-count {
        font-size: 0.78rem;
        padding: 4px 10px;
        background: var(--color-sand);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        color: var(--color-text-muted);
        font-weight: 500;
      }
    }

    .category-bars-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .category-bar-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      background: var(--color-ivory);
      border: 1px solid var(--color-border);
      transition: background-color 0.2s ease;

      &:hover {
        background: #fff;
      }

      .bar-top {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .cat-label-wrap {
          display: flex;
          align-items: center;
          gap: 8px;

          .cat-icon-badge {
            font-size: 1.15rem;
          }

          .cat-label {
            font-weight: 600;
            font-size: 0.95rem;
            color: var(--color-charcoal);
          }
        }

        .cat-amounts {
          display: flex;
          align-items: baseline;
          gap: 6px;

          .act {
            color: var(--color-burgundy);
            font-weight: 700;
            font-size: 0.95rem;
          }

          .est {
            font-size: 0.82rem;
            color: var(--color-text-muted);
          }
        }
      }

      .bar-track {
        height: 8px;
        background: var(--color-sand);
        border-radius: var(--radius-full);
        overflow: hidden;

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-terracotta), var(--color-burgundy));
          border-radius: var(--radius-full);
          transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      }

      .bar-sub {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.78rem;
        color: var(--color-text-muted);

        .bar-percentage {
          font-weight: 600;
          color: var(--color-terracotta);
        }
      }

      /* Mobile Responsive Category Bar Row */
      @media (max-width: 580px) {
        padding: 12px;
        gap: 8px;

        .bar-top {
          flex-direction: column;
          align-items: stretch;
          gap: 6px;

          .cat-label-wrap {
            width: 100%;
            .cat-label {
              font-size: 0.92rem;
              word-break: break-word;
            }
          }

          .cat-amounts {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: baseline;
            gap: 6px;
            font-size: 0.88rem;
          }
        }

        .bar-sub {
          font-size: 0.74rem;
        }
      }
    }

    /* Mobile Responsive Budget Page Elements */
    @media (max-width: 640px) {
      .budget-page {
        gap: 14px;
      }

      .budget-target-card {
        padding: 14px 12px;
        gap: 12px;

        .target-info {
          .target-badge {
            font-size: 1.15rem;
          }
          .target-sub {
            font-size: 0.82rem;
          }
        }

        .target-input-row {
          flex-direction: column;
          align-items: stretch;
          width: 100%;

          .input-wrap {
            width: 100%;

            .budget-num-input {
              width: 100%;
              font-size: 1.1rem;
              padding: 9px 12px;
            }
          }

          .btn {
            width: 100%;
            justify-content: center;
            min-height: 40px;
          }
        }
      }

      .summary-cards-grid {
        gap: 10px;
      }

      .summary-card {
        padding: 12px 14px;
        gap: 6px;

        .card-amount {
          font-size: 1.45rem;
        }
      }

      .breakdown-section {
        padding: 14px 12px;
        gap: 12px;

        .breakdown-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;

          .badge-cat-count {
            align-self: flex-start;
          }
        }

        .breakdown-item {
          padding: 10px 12px;
          gap: 6px;
        }
      }
    }

    /* Top Expenses List Styles */
    .top-expenses-section {
      margin-top: -6px;

      .top-expenses-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;

        .top-expense-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          transition: transform 0.15s ease, box-shadow 0.15s ease;

          &:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-xs);
          }

          .rank-badge {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--color-surface-subtle);
            color: var(--color-primary);
            font-weight: 700;
            font-size: 0.76rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 1px solid var(--color-border);
          }

          .expense-info {
            flex: 1;

            .expense-name {
              font-weight: 600;
              font-size: 0.92rem;
              color: var(--color-text-main);
            }

            .expense-sub {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 0.76rem;
              color: var(--color-text-muted);
              margin-top: 2px;
              flex-wrap: wrap;

              .expense-prio {
                padding: 1px 7px;
                border-radius: var(--radius-full);
                background: rgba(113, 56, 72, 0.08);
                color: var(--color-primary);
                font-weight: 600;
                font-size: 0.68rem;
              }

              .expense-store {
                background: var(--color-surface-subtle);
                padding: 1px 6px;
                border-radius: var(--radius-sm);
              }
            }
          }

          .expense-total {
            text-align: end;

            strong {
              font-size: 1.05rem;
              color: var(--color-primary);
            }

            small {
              font-size: 0.78rem;
              color: var(--color-text-muted);
              margin-inline-start: 2px;
            }
          }
        }
      }
    }

    /* Category budget target row in category bars */
    .cat-budget-target-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      margin-top: 6px;
      border-top: 1px dashed var(--color-border-subtle);
      font-size: 0.82rem;

      .cat-target-display {
        display: flex;
        align-items: center;
        gap: 8px;

        .cat-target-title {
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .cat-target-num {
          color: var(--color-text-main);
          font-weight: 700;
        }

        .badge-cat-warning {
          font-size: 0.72rem;
          color: #D32F2F;
          font-weight: 700;
          background: #FFEBEE;
          padding: 1px 6px;
          border-radius: var(--radius-sm);
        }

        .badge-cat-ok {
          font-size: 0.72rem;
          color: var(--color-success);
          font-weight: 700;
          background: #E8F5E9;
          padding: 1px 6px;
          border-radius: var(--radius-sm);
        }
      }

      .btn-text-edit {
        background: none;
        border: none;
        color: var(--color-primary);
        cursor: pointer;
        font-size: 0.78rem;
        font-weight: 600;
        text-decoration: underline;

        &:hover {
          color: var(--color-terracotta);
        }
      }

      .cat-budget-inline-edit {
        display: flex;
        align-items: center;
        gap: 6px;

        .cat-budget-input {
          width: 90px;
          padding: 4px 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          outline: none;

          &:focus {
            border-color: var(--color-primary);
          }
        }
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

  editingCatId = signal<string | null>(null);
  catBudgetValue = signal<number | null>(null);

  editCatBudget(catId: string, currentBudget?: number): void {
    this.editingCatId.set(catId);
    this.catBudgetValue.set(currentBudget ?? null);
  }

  saveCatBudget(catId: string): void {
    const val = this.catBudgetValue();
    const cleanVal = val !== null && val !== undefined && !isNaN(val) && val > 0 ? Number(val) : undefined;
    this.preferences.setCategoryBudget(catId, cleanVal);
    this.editingCatId.set(null);
    const lang = this.i18n.currentLang();
    const msg = lang === 'ar'
      ? 'تم تحديث ميزانية القسم بنجاح'
      : (lang === 'en' ? 'Category budget updated successfully' : 'Budget de la catégorie mis à jour');
    this.toast.show(msg);
  }

  getPriorityLabel(prio?: ItemPriority): string {
    if (!prio) return '';
    return prio === 'essential' ? this.i18n.t('priority.essential')
      : prio === 'useful' ? this.i18n.t('priority.useful')
      : this.i18n.t('priority.optional');
  }

  saveBudget(): void {
    const val = this.tempTargetBudget();
    const cleanVal = val !== undefined && val !== null && !isNaN(val) ? Number(val) : undefined;
    this.preferences.setTargetBudget(cleanVal);
    const lang = this.i18n.currentLang();
    const msg = lang === 'ar'
      ? 'تم تحديث ميزانيتك بنجاح 🎯'
      : (lang === 'en' ? 'Budget updated successfully 🎯' : 'Budget mis à jour avec succès 🎯');
    this.toast.show(msg);
  }

  getBarPercentage(amount: number): number {
    const totalEst = this.shoppingList.totalEstimatedCost();
    if (!totalEst || totalEst === 0) return 0;
    return Math.min(100, Math.round((amount / totalEst) * 100));
  }
}
