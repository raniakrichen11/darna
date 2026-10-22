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
          <h2>{{ isEditing ? i18n.t('modal.edit_title') : i18n.t('modal.custom_title') }}</h2>
          <button type="button" class="close-btn" (click)="close.emit()" [attr.aria-label]="i18n.t('action.close')">✕</button>
        </div>

        <form [formGroup]="itemForm" (ngSubmit)="onSubmit()">
          <!-- Name -->
          <div class="form-group">
            <label for="itemName">{{ i18n.t('modal.name_label') }} *</label>
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
            <label for="itemCategory">{{ i18n.t('modal.category_label') }} *</label>
            <select id="itemCategory" formControlName="categoryId">
              @for (cat of catalogService.categories(); track cat.id) {
                <option [value]="cat.id">
                  {{ cat.icon }} {{ i18n.currentLang() === 'ar' ? cat.nameAr : cat.nameFr }}
                </option>
              }
            </select>
          </div>

          <!-- Quantity and Estimated Price (side-by-side) -->
          <div class="form-row">
            <div class="form-group col">
              <label for="itemQty">{{ i18n.t('modal.qty_label') }}</label>
              <input id="itemQty" type="number" min="1" step="1" formControlName="quantity" />
            </div>

            <div class="form-group col">
              <label for="itemEstPrice">{{ i18n.t('modal.est_price_label') }}</label>
              <input id="itemEstPrice" type="number" min="0" step="0.5" formControlName="estimatedUnitPrice" placeholder="0.00" />
            </div>
          </div>

          <!-- Actual Price (if purchased or known) -->
          <div class="form-group">
            <label for="itemActPrice">{{ i18n.t('modal.act_price_label') }}</label>
            <input id="itemActPrice" type="number" min="0" step="0.5" formControlName="actualUnitPrice" placeholder="0.00" />
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label for="itemNotes">{{ i18n.t('modal.notes_label') }}</label>
            <textarea
              id="itemNotes"
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
      align-items: center;
      margin-bottom: 20px;

      h2 {
        font-size: 1.3rem;
        margin: 0;
        color: var(--color-primary);
      }

      .close-btn {
        font-size: 1.25rem;
        color: var(--color-text-muted);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;

        &:hover {
          background-color: var(--color-surface-hover);
          color: var(--color-text-main);
        }
      }
    }

    .form-row {
      display: flex;
      gap: 12px;

      .col {
        flex: 1;
      }
    }

    .error-msg {
      color: var(--color-danger);
      font-size: 0.8rem;
      margin-top: 4px;
      display: block;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--color-border-subtle);
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
