import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingDiaryService } from '../../services/wedding-diary.service';
import { RegionalTraditionRecord, WeddingEventType, EVENT_TEMPLATE_DEFINITIONS } from '../../models/wedding-diary.model';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-traditions-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()" [attr.dir]="i18n.dir()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <header class="modal-header">
          <div class="header-left">
            <span class="modal-eyebrow">{{ i18n.t('diary.traditions_title') }}</span>
            <h2 class="modal-title">
              {{ i18n.currentLang() === 'ar' ? 'استكشاف وتخصيص تقاليد العرس بالجهات التونسية' : 'Guide des traditions régionales tunisiennes' }}
            </h2>
          </div>
          <button type="button" class="close-btn" (click)="onClose()" aria-label="Fermer">✕</button>
        </header>

        <!-- Body -->
        <div class="modal-body">
          <p class="traditions-intro">
            {{ i18n.t('diary.traditions_desc') }}
          </p>

          <div class="traditions-layout">
            <!-- Region Selector Sidebar / Pills -->
            <div class="regions-list">
              <span class="list-label">{{ i18n.currentLang() === 'ar' ? 'اختاري الولاية أو الجهة :' : 'Sélectionnez la région :' }}</span>
              @for (r of diaryService.regionalTraditions(); track r.regionId) {
                <button
                  type="button"
                  class="region-item-btn"
                  [class.active]="selectedRegion.regionId === r.regionId"
                  (click)="selectedRegion = r"
                >
                  <span class="region-pin">📍</span>
                  <div class="region-meta">
                    <strong>{{ i18n.currentLang() === 'ar' ? r.regionNameAr : r.regionNameFr }}</strong>
                    <small>{{ i18n.currentLang() === 'ar' ? r.localityAr : r.localityFr }}</small>
                  </div>
                  @if (r.verificationStatus === 'verified_ethnographic') {
                    <span class="badge-status badge-verified">✓</span>
                  }
                </button>
              }
            </div>

            <!-- Detail Pane -->
            <div class="region-detail-card">
              <div class="detail-header">
                <div>
                  <h3 class="detail-name">
                    {{ i18n.currentLang() === 'ar' ? selectedRegion.regionNameAr : selectedRegion.regionNameFr }}
                  </h3>
                  <span class="detail-locality">
                    🏛️ {{ i18n.currentLang() === 'ar' ? selectedRegion.localityAr : selectedRegion.localityFr }}
                  </span>
                </div>
                <span
                  class="badge-verification"
                  [class.verified]="selectedRegion.verificationStatus === 'verified_ethnographic'"
                >
                  {{ selectedRegion.verificationStatus === 'verified_ethnographic'
                    ? (i18n.currentLang() === 'ar' ? 'توثيق تراثي مؤكد' : 'Patrimoine vérifié')
                    : (i18n.currentLang() === 'ar' ? 'يُرجى التأكد محليًا' : 'À confirmer localement') }}
                </span>
              </div>

              <!-- Summary -->
              <p class="region-summary">
                {{ i18n.currentLang() === 'ar' ? selectedRegion.summaryAr : selectedRegion.summaryFr }}
              </p>

              <!-- Traditional Outfits -->
              <div class="meta-block">
                <span class="meta-title">👗 {{ i18n.currentLang() === 'ar' ? 'الأزياء والأثواب التقليدية العريقة :' : 'Tenues et parures traditionnelles :' }}</span>
                <div class="tags-row">
                  @for (outfit of (i18n.currentLang() === 'ar' ? selectedRegion.traditionalOutfitsAr : selectedRegion.traditionalOutfitsFr); track outfit) {
                    <span class="outfit-tag">✨ {{ outfit }}</span>
                  }
                </div>
              </div>

              <!-- Traditional Celebrations Selection Checklist -->
              <div class="meta-block">
                <span class="meta-title">🎉 {{ i18n.currentLang() === 'ar' ? 'المناسبات والاحتفالات المقترحة (اختاري ما يناسبك) :' : 'Célébrations suggérées (cochez selon vos souhaits) :' }}</span>
                <div class="events-checkbox-grid">
                  @for (evType of selectedRegion.suggestedEventSequence; track evType) {
                    <label class="event-check-card">
                      <input
                        type="checkbox"
                        [checked]="isEventSelected(evType)"
                        (change)="toggleEventSelection(evType)"
                      />
                      <span class="ev-check-icon">{{ getEventDef(evType).icon }}</span>
                      <div class="ev-check-text">
                        <strong>{{ i18n.currentLang() === 'ar' ? getEventDef(evType).titleAr : getEventDef(evType).titleFr }}</strong>
                        <small>{{ getEventDef(evType).defaultOffsetDays === 0 ? (i18n.currentLang() === 'ar' ? 'اليوم الموعود' : 'Jour J') : (getEventDef(evType).defaultOffsetDays + ' ' + (i18n.currentLang() === 'ar' ? 'يوم' : 'jours')) }}</small>
                      </div>
                    </label>
                  }
                </div>
              </div>

              <!-- Wedding Date Configuration -->
              <div class="wedding-date-row">
                <label for="customWeddingDate">
                  💍 {{ i18n.currentLang() === 'ar' ? 'تاريخ موعد الزفاف المتوقع :' : 'Date prévue du mariage (Jour J) :' }}
                </label>
                <input
                  id="customWeddingDate"
                  type="date"
                  [(ngModel)]="weddingDateInput"
                  class="date-input"
                />
              </div>

              <!-- Source references footer note -->
              <div class="source-footnote">
                <span>📚 <em>{{ i18n.currentLang() === 'ar' ? 'المصدر المرجعي :' : 'Source de documentation :' }} {{ selectedRegion.sourceReference }} (Revue : {{ selectedRegion.lastReviewed }})</em></span>
              </div>

              <!-- Action Bar -->
              <div class="region-action-bar">
                <button
                  type="button"
                  class="btn btn-primary"
                  [disabled]="selectedEventTypes.length === 0 || !weddingDateInput"
                  (click)="applyPlan()"
                >
                  ✨ {{ i18n.t('diary.apply_tradition') }} ({{ selectedEventTypes.length }} {{ i18n.currentLang() === 'ar' ? 'مناسبات' : 'événements' }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(48, 42, 41, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
      animation: fadeIn 0.2s ease;
    }

    .modal-card {
      background: #FFFFFF;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 920px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 92vh;
    }

    .modal-header {
      padding: 18px 24px;
      background: var(--color-surface-subtle);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .modal-eyebrow {
        font-size: 0.72rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--color-primary);
        font-weight: 700;
        display: block;
      }

      .modal-title {
        font-family: var(--font-serif);
        font-size: 1.3rem;
        color: var(--color-text-main);
        margin: 2px 0 0 0;
      }

      .close-btn {
        background: transparent;
        border: none;
        font-size: 1.2rem;
        color: var(--color-text-muted);
        cursor: pointer;
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        transition: background 0.15s;

        &:hover {
          background: var(--color-surface-hover);
          color: var(--color-text-main);
        }
      }
    }

    .modal-body {
      padding: 20px 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .traditions-intro {
      font-size: 0.92rem;
      color: var(--color-text-muted);
      margin: 0;
      line-height: 1.5;
    }

    .traditions-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 18px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .regions-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-height: 480px;
      overflow-y: auto;
      padding-inline-end: 4px;

      .list-label {
        font-size: 0.78rem;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--color-text-muted);
        letter-spacing: 0.05em;
        margin-bottom: 2px;
      }

      .region-item-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        text-align: start;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          background: #FFFFFF;
          border-color: var(--color-primary);
        }

        &.active {
          background: #FFFFFF;
          border-color: var(--color-primary);
          box-shadow: 0 2px 8px rgba(113, 56, 72, 0.12);

          strong {
            color: var(--color-primary);
          }
        }

        .region-pin {
          font-size: 1rem;
        }

        .region-meta {
          flex: 1;
          display: flex;
          flex-direction: column;

          strong {
            font-size: 0.88rem;
            color: var(--color-text-main);
          }

          small {
            font-size: 0.72rem;
            color: var(--color-text-muted);
          }
        }

        .badge-status {
          font-size: 0.72rem;
          font-weight: bold;
          color: var(--color-success);
        }
      }
    }

    .region-detail-card {
      background: var(--color-sand);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;

      .detail-name {
        font-family: var(--font-serif);
        font-size: 1.45rem;
        color: var(--color-primary);
        margin: 0;
      }

      .detail-locality {
        font-size: 0.82rem;
        color: var(--color-text-muted);
        margin-top: 2px;
        display: block;
      }

      .badge-verification {
        font-size: 0.72rem;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: var(--radius-full);
        background: #FFFFFF;
        border: 1px solid var(--color-border);
        color: var(--color-text-muted);

        &.verified {
          background: #E8F5E9;
          color: #2E7D32;
          border-color: #C8E6C9;
        }
      }
    }

    .region-summary {
      font-size: 0.92rem;
      line-height: 1.55;
      color: var(--color-text-main);
      margin: 0;
      background: #FFFFFF;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border-subtle);
    }

    .meta-block {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .meta-title {
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--color-text-main);
      }

      .tags-row {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .outfit-tag {
          font-size: 0.78rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          color: var(--color-primary);
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }
      }
    }

    .events-checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 8px;

      .event-check-card {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #FFFFFF;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 8px 10px;
        cursor: pointer;
        user-select: none;
        transition: border-color 0.15s;

        &:hover {
          border-color: var(--color-primary);
        }

        .ev-check-icon {
          font-size: 1.15rem;
        }

        .ev-check-text {
          display: flex;
          flex-direction: column;

          strong {
            font-size: 0.82rem;
            color: var(--color-text-main);
          }

          small {
            font-size: 0.7rem;
            color: var(--color-text-muted);
          }
        }
      }
    }

    .wedding-date-row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #FFFFFF;
      padding: 10px 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      flex-wrap: wrap;

      label {
        font-size: 0.86rem;
        font-weight: 700;
        color: var(--color-text-main);
      }

      .date-input {
        padding: 6px 10px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 0.88rem;
        font-family: inherit;
        outline: none;

        &:focus {
          border-color: var(--color-primary);
        }
      }
    }

    .source-footnote {
      font-size: 0.72rem;
      color: var(--color-text-muted);
    }

    .region-action-bar {
      display: flex;
      justify-content: flex-end;
      padding-top: 6px;

      .btn {
        padding: 10px 20px;
        font-weight: 700;
        border-radius: var(--radius-md);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class TraditionsModalComponent {
  diaryService = inject(WeddingDiaryService);
  i18n = inject(I18nService);
  toast = inject(ToastService);

  @Output() close = new EventEmitter<void>();
  @Output() applied = new EventEmitter<void>();

  selectedRegion: RegionalTraditionRecord = this.diaryService.regionalTraditions()[0];
  selectedEventTypes: WeddingEventType[] = [...this.selectedRegion.suggestedEventSequence];
  weddingDateInput: string = this.diaryService.weddingDate() || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);

  isEventSelected(type: WeddingEventType): boolean {
    return this.selectedEventTypes.includes(type);
  }

  toggleEventSelection(type: WeddingEventType): void {
    if (this.selectedEventTypes.includes(type)) {
      this.selectedEventTypes = this.selectedEventTypes.filter(t => t !== type);
    } else {
      this.selectedEventTypes.push(type);
    }
  }

  getEventDef(type: WeddingEventType) {
    return EVENT_TEMPLATE_DEFINITIONS[type] || EVENT_TEMPLATE_DEFINITIONS.custom;
  }

  applyPlan(): void {
    if (!this.weddingDateInput || this.selectedEventTypes.length === 0) return;

    this.diaryService.applyRegionalTradition(
      this.selectedRegion.regionId,
      this.weddingDateInput,
      this.selectedEventTypes
    );

    const lang = this.i18n.currentLang();
    const msg = lang === 'ar'
      ? `تم تطبيق تقاليد ${this.selectedRegion.regionNameAr} بنجاح في دفترك 🕊️`
      : `Traditions de ${this.selectedRegion.regionNameFr} appliquées avec succès à votre carnet 🕊️`;

    this.toast.show(msg);
    this.applied.emit();
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
