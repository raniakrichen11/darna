import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeddingEventType, TaskPriority, EVENT_TEMPLATE_DEFINITIONS } from '../../models/wedding-diary.model';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-add-event-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onCancel()" [attr.dir]="i18n.dir()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <div class="header-title-wrap">
            <span class="modal-eyebrow">{{ i18n.t('diary.add_event') }}</span>
            <h2 class="modal-title">
              {{ i18n.currentLang() === 'ar' ? 'إضافة مناسبة أو احتفال جديد' : 'Planifier une nouvelle célébration' }}
            </h2>
          </div>
          <button type="button" class="close-btn" (click)="onCancel()" aria-label="Fermer">✕</button>
        </header>

        <form (ngSubmit)="onSubmit()" class="modal-form">
          <!-- Event Type Template Selector -->
          <div class="form-group">
            <label>{{ i18n.currentLang() === 'ar' ? 'نوع الاحتفال أو المناسبة :' : 'Type de célébration :' }}</label>
            <div class="templates-grid">
              @for (item of templateList; track item.type) {
                <button
                  type="button"
                  class="template-card-btn"
                  [class.active]="selectedType === item.type"
                  (click)="onSelectTemplate(item.type)"
                >
                  <span class="tpl-icon">{{ item.icon }}</span>
                  <span class="tpl-name">{{ i18n.currentLang() === 'ar' ? item.titleAr : item.titleFr }}</span>
                </button>
              }
            </div>
          </div>

          <!-- Event Title -->
          <div class="form-group">
            <label for="eventTitle">{{ i18n.currentLang() === 'ar' ? 'اسم المناسبة :' : 'Nom de l’événement :' }}</label>
            <input
              id="eventTitle"
              type="text"
              required
              [(ngModel)]="title"
              name="title"
              class="form-control"
            />
          </div>

          <!-- Date & Time Row -->
          <div class="form-row">
            <div class="form-group">
              <label for="eventDate">{{ i18n.currentLang() === 'ar' ? 'التاريخ :' : 'Date :' }}</label>
              <input
                id="eventDate"
                type="date"
                required
                [(ngModel)]="date"
                name="date"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="eventTime">{{ i18n.currentLang() === 'ar' ? 'الوقت (اختياري) :' : 'Heure (optionnel) :' }}</label>
              <input
                id="eventTime"
                type="time"
                [(ngModel)]="startTime"
                name="startTime"
                class="form-control"
              />
            </div>
          </div>

          <!-- Location & Budget Row -->
          <div class="form-row">
            <div class="form-group">
              <label for="eventLocation">{{ i18n.currentLang() === 'ar' ? 'المكان أو القاعة :' : 'Lieu ou salle :' }}</label>
              <input
                id="eventLocation"
                type="text"
                [(ngModel)]="location"
                name="location"
                [placeholder]="i18n.currentLang() === 'ar' ? 'مثال: نابل، قاعة الأفراح، دار العائلة...' : 'Ex: Maison familiale, Salle des fêtes...'"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="eventBudget">{{ i18n.currentLang() === 'ar' ? 'سقف الميزانية (د.ت) :' : 'Budget plafond prévu (DT) :' }}</label>
              <input
                id="eventBudget"
                type="number"
                min="0"
                step="50"
                [(ngModel)]="budgetLimit"
                name="budgetLimit"
                placeholder="0"
                class="form-control"
              />
            </div>
          </div>

          <!-- Color & Priority Row -->
          <div class="form-row">
            <div class="form-group">
              <label>{{ i18n.currentLang() === 'ar' ? 'اللون التمييزي في الروزنامة :' : 'Couleur dans le calendrier :' }}</label>
              <div class="color-picker-row">
                @for (c of presetColors; track c) {
                  <button
                    type="button"
                    class="color-dot-btn"
                    [class.selected]="selectedColor === c"
                    [style.background]="c"
                    (click)="selectedColor = c"
                  ></button>
                }
              </div>
            </div>

            <div class="form-group">
              <label>{{ i18n.t('priority.essential') }} / {{ i18n.t('priority.useful') }} :</label>
              <select [(ngModel)]="priority" name="priority" class="form-control">
                <option value="essential">💎 {{ i18n.t('priority.essential') }}</option>
                <option value="useful">✨ {{ i18n.t('priority.useful') }}</option>
                <option value="optional">🌸 {{ i18n.t('priority.optional') }}</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline" (click)="onCancel()">
              {{ i18n.t('action.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="!title || !date">
              {{ i18n.t('action.save') }}
            </button>
          </div>
        </form>
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
      max-width: 620px;
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
        font-size: 1.25rem;
        color: var(--color-text-main);
        margin: 2px 0 0 0;
      }

      .close-btn {
        width: 40px;
        height: 40px;
        min-width: 40px;
        min-height: 40px;
        border-radius: var(--radius-full);
        background: var(--color-surface-hover);
        border: 1px solid var(--color-border);
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-text-muted);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        transition: all 0.2s ease;

        &:hover, &:active {
          background: #FFFFFF;
          color: var(--color-primary);
          border-color: var(--color-primary);
        }
      }
    }

    .modal-form {
      padding: 22px 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
      gap: 6px;
      max-height: 160px;
      overflow-y: auto;
      padding: 4px;
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-md);
      background: var(--color-surface-subtle);

      .template-card-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        background: #FFFFFF;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        cursor: pointer;
        text-align: start;
        transition: all 0.15s;

        .tpl-icon { font-size: 1.1rem; }
        .tpl-name { font-size: 0.76rem; font-weight: 600; color: var(--color-text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        &:hover {
          border-color: var(--color-primary);
        }

        &.active {
          background: var(--color-sand);
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(113, 56, 72, 0.2);
          .tpl-name { color: var(--color-primary); }
        }
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--color-text-muted);
      }

      .form-control {
        padding: 9px 12px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 0.9rem;
        outline: none;
        font-family: inherit;

        &:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(113, 56, 72, 0.1);
        }
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    .color-picker-row {
      display: flex;
      gap: 8px;
      align-items: center;

      .color-dot-btn {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.15s;

        &:hover {
          transform: scale(1.15);
        }

        &.selected {
          transform: scale(1.2);
          outline: 2px solid var(--color-primary);
        }
      }
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--color-border-subtle);
      margin-top: 6px;

      .btn {
        padding: 9px 18px;
        border-radius: var(--radius-md);
        font-weight: 600;
        font-size: 0.88rem;
        cursor: pointer;
      }

      @media (max-width: 600px) {
        flex-direction: column-reverse;
        gap: 10px;

        .btn {
          width: 100%;
          min-height: 48px;
          justify-content: center;
          font-size: 0.95rem;
        }
      }
    }

    @media (max-width: 600px) {
      .modal-card {
        border-radius: 24px 24px 0 0 !important;
        margin: 0 !important;
        max-height: 92vh !important;
        max-height: 92dvh !important;
      }

      .modal-form {
        padding: 16px;
        padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class AddEventModalComponent implements OnInit {
  i18n = inject(I18nService);

  @Input() initialDate?: string;
  @Output() save = new EventEmitter<{
    eventType: WeddingEventType;
    title: string;
    date: string;
    startTime?: string;
    location?: string;
    color?: string;
    priority?: TaskPriority;
    budgetLimit?: number;
  }>();

  @Output() cancel = new EventEmitter<void>();

  templateList = Object.values(EVENT_TEMPLATE_DEFINITIONS);
  selectedType: WeddingEventType = 'henna';

  title = '';
  date = '';
  startTime = '18:00';
  location = '';
  budgetLimit: number | null = null;
  priority: TaskPriority = 'essential';

  presetColors = ['#713848', '#C87862', '#718875', '#8C5B67', '#D48C46', '#3E5C76'];
  selectedColor = '#713848';

  ngOnInit(): void {
    if (this.initialDate) {
      this.date = this.initialDate;
    } else {
      this.date = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
    }
    this.onSelectTemplate('henna');
  }

  onSelectTemplate(type: WeddingEventType): void {
    this.selectedType = type;
    const def = EVENT_TEMPLATE_DEFINITIONS[type] || EVENT_TEMPLATE_DEFINITIONS.custom;
    const lang = this.i18n.currentLang();
    this.title = lang === 'ar' ? def.titleAr : def.titleFr;
    this.selectedColor = def.color;
  }

  onSubmit(): void {
    if (!this.title.trim() || !this.date) return;
    this.save.emit({
      eventType: this.selectedType,
      title: this.title.trim(),
      date: this.date,
      startTime: this.startTime || undefined,
      location: this.location.trim() || undefined,
      color: this.selectedColor,
      priority: this.priority,
      budgetLimit: this.budgetLimit ? Number(this.budgetLimit) : undefined
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
