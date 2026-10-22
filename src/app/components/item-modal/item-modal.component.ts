import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShoppingListItem } from '../../models/shopping-list.model';
import { CatalogService } from '../../services/catalog.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'app-item-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onBackdropClick($event)">
      <div class="modal-card" [attr.dir]="i18n.dir()">
        <div class="modal-header">
          <div class="header-titles">
            <span class="modal-eyebrow">{{ isEditing ? i18n.t('action.edit') : i18n.t('action.add') }}</span>
            <h2 class="modal-title">{{ isEditing ? i18n.t('modal.edit_title') : i18n.t('modal.custom_title') }}</h2>
          </div>
          <button type="button" class="close-btn" (click)="close.emit()" [attr.aria-label]="i18n.t('action.close')">
            ✕
          </button>
        </div>

        <form [formGroup]="itemForm" (ngSubmit)="onSubmit()">
          <!-- Name -->
          <div class="form-group">
            <label for="itemName">{{ i18n.t('modal.name_label') }} <span class="required">*</span></label>
            <input
              id="itemName"
              type="text"
              formControlName="name"
              [placeholder]="i18n.t('modal.name_placeholder')"
              autofocus
            />
            @if (itemForm.get('name')?.invalid && itemForm.get('name')?.touched) {
              <small class="error-msg">
                {{ i18n.currentLang() === 'ar' ? 'الرجاء إدخال اسم العنصر' : 'Le nom de l’article est obligatoire.' }}
              </small>
            }
          </div>

          <!-- Category -->
          <div class="form-group">
            <label for="itemCategory">{{ i18n.t('modal.category_label') }} <span class="required">*</span></label>
            <div class="select-wrapper">
              <select id="itemCategory" formControlName="categoryId">
                @for (cat of catalogService.categories(); track cat.id) {
                  <option [value]="cat.id">
                    {{ cat.icon }} {{ i18n.currentLang() === 'ar' ? cat.nameAr : cat.nameFr }}
                  </option>
                }
              </select>
            </div>
          </div>

          <!-- Quantity and Estimated Price (side-by-side) -->
          <div class="form-row">
            <div class="form-group col-qty">
              <label for="itemQty">{{ i18n.t('modal.qty_label') }}</label>
              <input id="itemQty" type="number" min="1" step="1" formControlName="quantity" />
            </div>

            <div class="form-group col-price">
              <label for="itemEstPrice">{{ i18n.t('modal.est_price_label') }}</label>
              <div class="input-with-currency">
                <input id="itemEstPrice" type="number" min="0" step="0.5" formControlName="estimatedUnitPrice" placeholder="0.00" />
                <span class="currency-tag">{{ i18n.currency() }}</span>
              </div>
            </div>
          </div>

          <!-- Actual Price (if purchased or known) -->
          <div class="form-group">
            <label for="itemActPrice">{{ i18n.t('modal.act_price_label') }}</label>
            <div class="input-with-currency">
              <input id="itemActPrice" type="number" min="0" step="0.5" formControlName="actualUnitPrice" placeholder="0.00" />
              <span class="currency-tag">{{ i18n.currency() }}</span>
            </div>
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label for="itemNotes">{{ i18n.t('modal.notes_label') }}</label>
            <textarea
              id="itemNotes"
              rows="3"
              formControlName="notes"
              [placeholder]="i18n.t('list.notes_placeholder')"
            ></textarea>
          </div>

          <!-- Modal Actions -->
          <div class="modal-actions">
            <button type="button" class="btn btn-outline" (click)="close.emit()">
              {{ i18n.t('action.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="itemForm.invalid">
              {{ i18n.t('action.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--color-border);

      .header-titles {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .modal-eyebrow {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 600;
        color: var(--color-terracotta);
      }

      .modal-title {
        font-family: var(--font-serif);
        font-size: 1.45rem;
        margin: 0;
        color: var(--color-burgundy);
        line-height: 1.25;
      }

      .close-btn {
        font-size: 1.1rem;
        color: var(--color-text-muted);
        width: 36px;
        height: 36px;
        border-radius: var(--radius-full);
        border: 1px solid var(--color-border);
        background: var(--color-surface);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background-color: var(--color-sand);
          color: var(--color-charcoal);
          border-color: var(--color-border-strong);
        }
      }
    }

    .form-group {
      margin-bottom: var(--space-md);

      label {
        display: block;
        font-size: 0.78rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-muted);
        margin-bottom: 6px;

        .required {
          color: var(--color-burgundy);
        }
      }

      input[type="text"],
      input[type="number"],
      select,
      textarea {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-surface);
        color: var(--color-charcoal);
        font-family: inherit;
        font-size: 0.95rem;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: var(--color-burgundy);
          box-shadow: 0 0 0 3px rgba(113, 59, 72, 0.12);
        }

        &::placeholder {
          color: var(--color-text-light);
        }
      }

      textarea {
        resize: vertical;
        min-height: 70px;
      }
    }

    .form-row {
      display: flex;
      gap: 14px;

      .col-qty {
        flex: 0 0 100px;
      }

      .col-price {
        flex: 1;
      }
    }

    .input-with-currency {
      position: relative;
      display: flex;
      align-items: center;

      input {
        padding-inline-end: 48px !important;
      }

      .currency-tag {
        position: absolute;
        inset-inline-end: 12px;
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--color-text-muted);
        pointer-events: none;
      }
    }

    .select-wrapper {
      position: relative;
    }

    .error-msg {
      color: #b33939;
      font-size: 0.78rem;
      margin-top: 4px;
      display: block;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: var(--space-xl);
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);

      .btn {
        padding: 10px 20px;
      }
    }

    @media (max-width: 540px) {
      .modal-header {
        margin-bottom: var(--space-md);
        padding-bottom: var(--space-sm);
      }

      .modal-actions {
        flex-direction: column-reverse;
        gap: 8px;
        margin-top: var(--space-lg);

        .btn {
          width: 100%;
          justify-content: center;
        }
      }
    }
  `]
})
export class ItemModalComponent implements OnInit {
  @Input() existingItem?: ShoppingListItem;
  @Input() defaultCategoryId?: string;
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  catalogService = inject(CatalogService);
  i18n = inject(I18nService);

  itemForm!: FormGroup;

  get isEditing(): boolean {
    return !!this.existingItem;
  }

  ngOnInit(): void {
    const isAr = this.i18n.currentLang() === 'ar';
    let initialName = '';
    if (this.existingItem) {
      if (this.existingItem.catalogItemId) {
        const cat = this.catalogService.getItemById(this.existingItem.catalogItemId);
        initialName = isAr ? (cat?.nameAr || '') : (cat?.nameFr || '');
      } else {
        initialName = isAr
          ? (this.existingItem.customNameAr || this.existingItem.customNameFr || '')
          : (this.existingItem.customNameFr || this.existingItem.customNameAr || '');
      }
    }

    this.itemForm = this.fb.group({
      name: [initialName, [Validators.required, Validators.minLength(2)]],
      categoryId: [
        this.existingItem?.categoryId || this.defaultCategoryId || 'cuisine-ustensiles',
        Validators.required
      ],
      quantity: [this.existingItem?.quantity || 1, [Validators.required, Validators.min(1)]],
      estimatedUnitPrice: [this.existingItem?.estimatedUnitPrice ?? null],
      actualUnitPrice: [this.existingItem?.actualUnitPrice ?? null],
      notes: [this.existingItem?.notes || '']
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const val = this.itemForm.value;
      this.save.emit({
        id: this.existingItem?.id,
        name: val.name.trim(),
        categoryId: val.categoryId,
        quantity: Number(val.quantity),
        estimatedUnitPrice: val.estimatedUnitPrice !== null && val.estimatedUnitPrice !== '' ? Number(val.estimatedUnitPrice) : undefined,
        actualUnitPrice: val.actualUnitPrice !== null && val.actualUnitPrice !== '' ? Number(val.actualUnitPrice) : undefined,
        notes: val.notes?.trim() || ''
      });
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}
