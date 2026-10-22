import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../services/shopping-list.service';
import { PreferencesService } from '../../services/preferences.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-print-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div id="printable-export-container" class="print-container" [attr.dir]="i18n.dir()">
      <!-- Header -->
      <div class="print-header">
        <div class="brand">
          <h1 class="brand-title">Darna | دارنا</h1>
          <p class="brand-tagline">
            {{ i18n.currentLang() === 'ar' ? 'كل ما تحتاجينه لبيتك الجديد' : 'Tout pour votre nouveau chez-vous' }}
          </p>
        </div>
        <div class="meta">
          <div class="meta-item">
            <strong>{{ i18n.t('pdf.title') }}</strong>
          </div>
          <div *ngIf="preferences.preferences().brideName" class="meta-item">
            <span>{{ i18n.t('pdf.bride') }} <strong>{{ preferences.preferences().brideName }}</strong></span>
          </div>
          <div class="meta-item">
            <span>{{ i18n.t('pdf.date') }} {{ currentDate }}</span>
          </div>
        </div>
      </div>

      <!-- Summary KPI Box -->
      <div class="summary-box">
        <div class="summary-col">
          <span class="label">{{ i18n.t('pdf.total_items') }}</span>
          <span class="val">{{ shoppingList.totalItemsCount() }}</span>
        </div>
        <div class="summary-col">
          <span class="label">{{ i18n.t('pdf.purchased') }}</span>
          <span class="val success">{{ shoppingList.purchasedItemsCount() }}</span>
        </div>
        <div class="summary-col">
          <span class="label">{{ i18n.t('pdf.remaining') }}</span>
          <span class="val">{{ shoppingList.remainingItemsCount() }}</span>
        </div>
        <div class="summary-col">
          <span class="label">{{ i18n.t('pdf.est_cost') }}</span>
          <span class="val">{{ shoppingList.totalEstimatedCost() | number:'1.0-2' }} {{ i18n.currency() }}</span>
        </div>
        <div class="summary-col">
          <span class="label">{{ i18n.t('pdf.act_cost') }}</span>
          <span class="val bold">{{ shoppingList.totalActualSpent() | number:'1.0-2' }} {{ i18n.currency() }}</span>
        </div>
      </div>

      <!-- Categories & Items Tables -->
      @for (group of shoppingList.categoryGroups(); track group.categoryId) {
        <div class="category-section">
          <div class="category-header">
            <h3>
              {{ group.categoryIcon }}
              {{ i18n.currentLang() === 'ar' ? group.categoryNameAr : group.categoryNameFr }}
              <span class="cat-count">({{ group.purchasedCount }}/{{ group.totalItems }})</span>
            </h3>
            <span class="cat-subtotal">
              {{ group.actualTotal > 0 ? (group.actualTotal | number:'1.0-2') + ' ' + i18n.currency() : '' }}
            </span>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 36px; text-align: center;">{{ i18n.t('pdf.th_status') }}</th>
                <th>{{ i18n.t('pdf.th_item') }}</th>
                <th style="width: 48px; text-align: center;">{{ i18n.t('pdf.th_qty') }}</th>
                <th style="width: 80px; text-align: end;">{{ i18n.t('pdf.th_est') }}</th>
                <th style="width: 80px; text-align: end;">{{ i18n.t('pdf.th_act') }}</th>
                <th style="width: 130px;">{{ i18n.t('pdf.th_notes') }}</th>
              </tr>
            </thead>
            <tbody>
              @for (item of group.items; track item.id) {
                <tr [class.purchased-row]="item.isPurchased">
                  <td style="text-align: center;">
                    <span class="check-box" [class.checked]="item.isPurchased">
                      {{ item.isPurchased ? '✓' : '□' }}
                    </span>
                  </td>
                  <td class="item-name">
                    <strong>{{ shoppingList.getItemDisplayName(item) }}</strong>
                  </td>
                  <td style="text-align: center;">{{ item.quantity }}</td>
                  <td style="text-align: end;">
                    {{ item.estimatedUnitPrice ? (item.estimatedUnitPrice * item.quantity | number:'1.0-2') + ' ' + i18n.currency() : '-' }}
                  </td>
                  <td style="text-align: end; font-weight: 600;">
                    {{ item.isPurchased && item.actualUnitPrice ? (item.actualUnitPrice * item.quantity | number:'1.0-2') + ' ' + i18n.currency() : '-' }}
                  </td>
                  <td class="notes-col">
                    {{ item.notes || '' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <!-- Footer -->
      <div class="print-footer">
        <p>{{ i18n.t('pdf.footer') }}</p>
      </div>
    </div>
  `,
  styles: [`
    .print-container {
      background: #ffffff;
      color: #302927;
      padding: 24px;
      font-size: 11pt;
      line-height: 1.4;
      font-family: 'Plus Jakarta Sans', 'Noto Sans Arabic', sans-serif;
    }

    .print-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #713B48;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    .brand-title {
      font-family: 'Playfair Display', 'Amiri', serif;
      font-size: 22pt;
      color: #713B48;
      margin: 0;
      letter-spacing: 0.04em;
    }

    .brand-tagline {
      font-size: 9pt;
      color: #827872;
      margin: 2px 0 0 0;
    }

    .meta {
      text-align: end;
      font-size: 9.5pt;
    }

    .summary-box {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      background: #FAF7F2;
      border: 1px solid #E8E0D8;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 20px;
    }

    .summary-col {
      display: flex;
      flex-direction: column;

      .label {
        font-size: 8pt;
        color: #827872;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .val {
        font-size: 11pt;
        font-weight: 700;
        color: #302927;

        &.success {
          color: #5F7D66;
        }

        &.bold {
          color: #713B48;
        }
      }
    }

    .category-section {
      margin-bottom: 18px;
      page-break-inside: avoid;
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #F0E9E0;
      padding: 6px 12px;
      border-radius: 6px;
      border-inline-start: 4px solid #713B48;
      margin-bottom: 6px;

      h3 {
        font-family: 'Playfair Display', 'Amiri', serif;
        font-size: 11pt;
        margin: 0;
        color: #302927;
      }

      .cat-count {
        font-size: 9pt;
        font-weight: normal;
        color: #827872;
      }

      .cat-subtotal {
        font-size: 9pt;
        font-weight: bold;
        color: #713B48;
      }
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;

      th {
        border-bottom: 1px solid #E8E0D8;
        padding: 6px 8px;
        font-size: 8.5pt;
        color: #827872;
        text-align: start;
        background: #FAF7F2;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      td {
        padding: 6px 8px;
        border-bottom: 1px solid #F0E9E0;
        vertical-align: middle;
      }

      .purchased-row {
        background-color: #FAFDF9;
      }

      .check-box {
        font-size: 11pt;
        &.checked {
          color: #5F7D66;
          font-weight: bold;
        }
      }

      .notes-col {
        font-size: 8pt;
        color: #827872;
        font-style: italic;
      }
    }

    .print-footer {
      margin-top: 24px;
      border-top: 1px solid #E8E0D8;
      padding-top: 10px;
      text-align: center;
      font-size: 8.5pt;
      color: #827872;
    }
  `]
})
export class PrintViewComponent {
  shoppingList = inject(ShoppingListService);
  preferences = inject(PreferencesService);
  i18n = inject(I18nService);

  get currentDate(): string {
    return new Date().toLocaleDateString(this.i18n.currentLang() === 'ar' ? 'ar-TN' : 'fr-TN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
