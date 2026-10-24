import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiaryNote, WeddingEvent } from '../../models/wedding-diary.model';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onCancel()" [attr.dir]="i18n.dir()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <div class="header-title-wrap">
            <span class="modal-eyebrow">
              {{ isEditing ? (i18n.currentLang() === 'ar' ? 'تعديل المذكرة' : 'MODIFICATION') : (i18n.currentLang() === 'ar' ? 'مذكرة جديدة' : 'NOUVELLE NOTE') }}
            </span>
            <h2 class="modal-title">
              {{ isEditing ? (i18n.currentLang() === 'ar' ? 'تعديل ملاحظة أو فكرة' : 'Modifier la note') : (i18n.currentLang() === 'ar' ? 'تدوين فكرة أو اتفاق' : 'Écrire dans mon carnet') }}
            </h2>
          </div>
          <button type="button" class="close-btn" (click)="onCancel()" aria-label="Fermer">✕</button>
        </header>

        <form (ngSubmit)="onSubmit()" class="modal-form">
          <div class="form-group">
            <label for="noteTitle">{{ i18n.currentLang() === 'ar' ? 'عنوان المذكرة :' : 'Titre de la note :' }}</label>
            <input
              id="noteTitle"
              type="text"
              required
              [(ngModel)]="title"
              name="title"
              [placeholder]="i18n.currentLang() === 'ar' ? 'مثال: أفكار وتنسيقات كسوة الوطية...' : 'Ex: Idées pour ma tenue d’Outia, questions photographe...'"
              class="form-control"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="noteCat">{{ i18n.currentLang() === 'ar' ? 'التصنيف :' : 'Catégorie :' }}</label>
              <select id="noteCat" [(ngModel)]="category" name="category" class="form-control">
                <option value="inspiration">💡 {{ i18n.currentLang() === 'ar' ? 'أفكار وإلهام' : 'Inspiration & Déco' }}</option>
                <option value="meeting">🤝 {{ i18n.currentLang() === 'ar' ? 'اتفاقيات ولقاءات' : 'Rendez-vous & Accords' }}</option>
                <option value="logistics">🚚 {{ i18n.currentLang() === 'ar' ? 'لوجستيك وتنظيم' : 'Logistique & Transport' }}</option>
                <option value="beauty">💄 {{ i18n.currentLang() === 'ar' ? 'تجميل وإطلالة' : 'Beauté & Coiffure' }}</option>
                <option value="reminders">⏰ {{ i18n.currentLang() === 'ar' ? 'تذكيرات هامة' : 'Rappels importants' }}</option>
                <option value="general">📝 {{ i18n.currentLang() === 'ar' ? 'عام' : 'Général' }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="noteDate">{{ i18n.currentLang() === 'ar' ? 'التاريخ المرتبط :' : 'Date associée :' }}</label>
              <input
                id="noteDate"
                type="date"
                [(ngModel)]="associatedDate"
                name="associatedDate"
                class="form-control"
              />
            </div>
          </div>

          @if (events.length > 0) {
            <div class="form-group">
              <label for="noteEvent">{{ i18n.currentLang() === 'ar' ? 'ربط بمناسبة محددة (اختياري) :' : 'Lier à un événement (optionnel) :' }}</label>
              <select id="noteEvent" [(ngModel)]="eventId" name="eventId" class="form-control">
                <option [ngValue]="undefined">{{ i18n.currentLang() === 'ar' ? '-- بدون ربط بمناسبة --' : '-- Aucun événement particulier --' }}</option>
                @for (ev of events; track ev.id) {
                  <option [value]="ev.id">
                    {{ ev.color ? '● ' : '' }}{{ i18n.currentLang() === 'ar' ? ev.titleAr : ev.titleFr }} ({{ ev.date }})
                  </option>
                }
              </select>
            </div>
          }

          <div class="form-group">
            <label for="noteContent">{{ i18n.currentLang() === 'ar' ? 'محتوى المذكرة :' : 'Contenu de la note :' }}</label>
            <textarea
              id="noteContent"
              required
              rows="6"
              [(ngModel)]="content"
              name="content"
              [placeholder]="i18n.currentLang() === 'ar' ? 'اكتبي كل التفاصيل، ما تم الاتفاق عليه، أسماء المحلات أو الأرقام...' : 'Notez vos pensées, ce qui a été convenu entre familles, numéros de téléphone utiles...'"
              class="form-control"
            ></textarea>
          </div>

          <div class="form-group-checkbox">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="isPinned" name="isPinned" />
              <span>📌 {{ i18n.t('diary.pin_note') }}</span>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline" (click)="onCancel()">
              {{ i18n.t('action.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="!title || !content">
              {{ i18n.t('diary.save_note') }}
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
      background: rgba(48, 42, 41, 0.55);
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
      max-width: 540px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }

    .modal-header {
      padding: 18px 22px;
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
      padding: 22px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
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
        padding: 10px 12px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 0.92rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;

        &:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(113, 56, 72, 0.1);
        }
      }

      textarea.form-control {
        resize: vertical;
        line-height: 1.5;
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

    .form-group-checkbox {
      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.88rem;
        cursor: pointer;
        user-select: none;
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

      .form-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class NoteModalComponent implements OnInit {
  i18n = inject(I18nService);

  @Input() existingNote?: DiaryNote;
  @Input() events: WeddingEvent[] = [];
  @Input() initialDate?: string;
  @Input() initialEventId?: string;

  @Output() save = new EventEmitter<{
    title: string;
    content: string;
    category?: 'inspiration' | 'meeting' | 'agreement' | 'logistics' | 'beauty' | 'reminders' | 'general';
    associatedDate?: string;
    eventId?: string;
    isPinned?: boolean;
  }>();

  @Output() cancel = new EventEmitter<void>();

  title = '';
  content = '';
  category: 'inspiration' | 'meeting' | 'agreement' | 'logistics' | 'beauty' | 'reminders' | 'general' = 'general';
  associatedDate = '';
  eventId?: string;
  isPinned = false;

  get isEditing(): boolean {
    return !!this.existingNote;
  }

  ngOnInit(): void {
    if (this.existingNote) {
      this.title = this.existingNote.title;
      this.content = this.existingNote.content;
      this.category = this.existingNote.category;
      this.associatedDate = this.existingNote.associatedDate || '';
      this.eventId = this.existingNote.eventId;
      this.isPinned = this.existingNote.isPinned;
    } else {
      if (this.initialDate) {
        this.associatedDate = this.initialDate;
      }
      if (this.initialEventId) {
        this.eventId = this.initialEventId;
      }
    }
  }

  onSubmit(): void {
    if (!this.title.trim() || !this.content.trim()) return;
    this.save.emit({
      title: this.title.trim(),
      content: this.content.trim(),
      category: this.category,
      associatedDate: this.associatedDate || undefined,
      eventId: this.eventId || undefined,
      isPinned: this.isPinned
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
