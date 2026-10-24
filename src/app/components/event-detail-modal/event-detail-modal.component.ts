import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  WeddingEvent,
  WeddingTask,
  EventProvider,
  DiaryNote,
  TaskPriority,
  EventStatus,
  TaskAssigneeRole,
  EVENT_TEMPLATE_DEFINITIONS
} from '../../models/wedding-diary.model';
import { WeddingDiaryService } from '../../services/wedding-diary.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { I18nService, TranslationKey } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-event-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()" [attr.dir]="i18n.dir()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <header class="modal-header" [style.border-inline-start-color]="event.color || '#713848'">
          <div class="header-main">
            <span class="event-icon-badge">{{ getEventIcon(event.eventType) }}</span>
            <div class="event-title-wrap">
              <span class="event-type-badge">{{ getEventTypeName(event.eventType) }}</span>
              <h2 class="event-title">{{ diaryService.getEventDisplayName(event) }}</h2>
              <span class="event-date-sub">
                📅 {{ event.date }}
                @if (event.startTime) { · ⏰ {{ event.startTime }} - {{ event.endTime || '' }} }
                @if (event.location) { · 📍 {{ event.location }} }
              </span>
            </div>
          </div>
          <button type="button" class="close-btn" (click)="onClose()" aria-label="Fermer">✕</button>
        </header>

        <!-- Navigation Tabs -->
        <nav class="modal-tabs">
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'overview'"
            (click)="activeTab = 'overview'"
          >
            📋 {{ i18n.currentLang() === 'ar' ? 'نظرة عامة' : 'Vue d’ensemble' }}
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'tasks'"
            (click)="activeTab = 'tasks'"
          >
            ✓ {{ i18n.currentLang() === 'ar' ? 'قائمة المهام' : 'Checklist' }}
            <span class="tab-count">({{ eventTasks.length }})</span>
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'shopping'"
            (click)="activeTab = 'shopping'"
          >
            🛍️ {{ i18n.currentLang() === 'ar' ? 'المشتريات والجهاز' : 'Achats & Trousseau' }}
            <span class="tab-count">({{ (event.linkedShoppingItemIds || []).length }})</span>
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'providers'"
            (click)="activeTab = 'providers'"
          >
            🤝 {{ i18n.currentLang() === 'ar' ? 'المزودون والميزانية' : 'Budget & Prestataires' }}
            <span class="tab-count">({{ eventProviders.length }})</span>
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'notes'"
            (click)="activeTab = 'notes'"
          >
            ✍️ {{ i18n.currentLang() === 'ar' ? 'المذكرات' : 'Mémorandum' }}
            <span class="tab-count">({{ eventNotes.length }})</span>
          </button>
        </nav>

        <!-- Tab Content -->
        <div class="modal-body">
          <!-- TAB 1: OVERVIEW & EDIT DETAILS -->
          @if (activeTab === 'overview') {
            <div class="overview-pane">
              <!-- KPI Row -->
              <div class="event-kpi-grid">
                <div class="kpi-card">
                  <span class="kpi-label">{{ i18n.currentLang() === 'ar' ? 'الحالة' : 'Statut' }}</span>
                  <select [(ngModel)]="event.status" (ngModelChange)="saveEventChanges()" class="select-clean">
                    <option value="planned">📅 {{ i18n.currentLang() === 'ar' ? 'مخطط' : 'Planifié' }}</option>
                    <option value="in_progress">⏳ {{ i18n.currentLang() === 'ar' ? 'قيد التحضير' : 'En cours' }}</option>
                    <option value="completed">✓ {{ i18n.currentLang() === 'ar' ? 'تم بنجاح' : 'Terminé' }}</option>
                    <option value="cancelled">✕ {{ i18n.currentLang() === 'ar' ? 'ملغى' : 'Annulé' }}</option>
                  </select>
                </div>
                <div class="kpi-card">
                  <span class="kpi-label">{{ i18n.currentLang() === 'ar' ? 'الأهمية' : 'Priorité' }}</span>
                  <select [(ngModel)]="event.priority" (ngModelChange)="saveEventChanges()" class="select-clean">
                    <option value="essential">💎 {{ i18n.t('priority.essential') }}</option>
                    <option value="useful">✨ {{ i18n.t('priority.useful') }}</option>
                    <option value="optional">🌸 {{ i18n.t('priority.optional') }}</option>
                  </select>
                </div>
                <div class="kpi-card">
                  <span class="kpi-label">{{ i18n.currentLang() === 'ar' ? 'سقف الميزانية' : 'Plafond Budget' }}</span>
                  <div class="budget-input-inline">
                    <input
                      type="number"
                      [(ngModel)]="event.budgetLimit"
                      (ngModelChange)="saveEventChanges()"
                      placeholder="0"
                      class="input-num-clean"
                    />
                    <small>{{ i18n.currency() }}</small>
                  </div>
                </div>
                <div class="kpi-card">
                  <span class="kpi-label">{{ i18n.currentLang() === 'ar' ? 'المدفوع الفعلي' : 'Dépensé réel' }}</span>
                  <strong class="text-sage">{{ financialSummary.actualSpent | number:'1.0-2' }} {{ i18n.currency() }}</strong>
                </div>
              </div>

              <!-- Editable Form Fields -->
              <div class="form-grid">
                <div class="form-group">
                  <label>{{ i18n.currentLang() === 'ar' ? 'تاريخ المناسبة :' : 'Date de la célébration :' }}</label>
                  <input type="date" [(ngModel)]="event.date" (ngModelChange)="saveEventChanges()" class="form-control" />
                </div>
                <div class="form-group">
                  <label>{{ i18n.currentLang() === 'ar' ? 'المكان أو القاعة :' : 'Lieu ou salle :' }}</label>
                  <input
                    type="text"
                    [(ngModel)]="event.location"
                    (ngModelChange)="saveEventChanges()"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'مثال: قاعة الأفراح، دار العائلة...' : 'Ex: Maison familiale, Salle des fêtes...'"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label>{{ i18n.currentLang() === 'ar' ? 'وقت البداية :' : 'Heure de début :' }}</label>
                  <input type="time" [(ngModel)]="event.startTime" (ngModelChange)="saveEventChanges()" class="form-control" />
                </div>
                <div class="form-group">
                  <label>{{ i18n.currentLang() === 'ar' ? 'وقت الانتهاء :' : 'Heure de fin :' }}</label>
                  <input type="time" [(ngModel)]="event.endTime" (ngModelChange)="saveEventChanges()" class="form-control" />
                </div>
                <div class="form-group full-width">
                  <label>{{ i18n.currentLang() === 'ar' ? 'ملاحظات وتوجيهات خاصة :' : 'Notes et consignes particulières :' }}</label>
                  <textarea
                    rows="3"
                    [(ngModel)]="event.notes"
                    (ngModelChange)="saveEventChanges()"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'سجلي أي تفاصيل هامة تخص هذه المناسبة...' : 'Précisions d’organisation, dress code, musique...'"
                    class="form-control"
                  ></textarea>
                </div>
              </div>

              <!-- Danger Zone: Delete Event -->
              <div class="danger-zone">
                <button type="button" class="btn btn-outline-danger" (click)="confirmDeleteEvent()">
                  🗑️ {{ i18n.currentLang() === 'ar' ? 'حذف هذه المناسبة من دفتري' : 'Supprimer cet événement du carnet' }}
                </button>
              </div>
            </div>
          }

          <!-- TAB 2: CHECKLIST & TASKS -->
          @if (activeTab === 'tasks') {
            <div class="tasks-pane">
              <!-- Add Task Quick Form -->
              <div class="quick-add-task-box">
                <input
                  type="text"
                  [(ngModel)]="newTaskTitle"
                  (keyup.enter)="addTask()"
                  [placeholder]="i18n.currentLang() === 'ar' ? '+ إضافة مهمة جديدة لهذه المناسبة...' : '+ Ajouter une tâche pour cette célébration...'"
                  class="add-task-input"
                />
                <select [(ngModel)]="newTaskAssignee" class="select-assignee">
                  <option value="bride">👰 {{ i18n.t('diary.role_bride') }}</option>
                  <option value="groom">🤵 {{ i18n.t('diary.role_groom') }}</option>
                  <option value="mother">👩 {{ i18n.t('diary.role_mother') }}</option>
                  <option value="sister">👧 {{ i18n.t('diary.role_sister') }}</option>
                  <option value="father">👨 {{ i18n.t('diary.role_father') }}</option>
                  <option value="brother">👦 {{ i18n.t('diary.role_brother') }}</option>
                  <option value="family">🏡 {{ i18n.t('diary.role_family') }}</option>
                  <option value="helper">💐 {{ i18n.t('diary.role_helper') }}</option>
                  <option value="provider">🤝 {{ i18n.t('diary.role_provider') }}</option>
                </select>
                <input type="date" [(ngModel)]="newTaskDueDate" class="add-task-date" />
                <button type="button" class="btn btn-primary btn-sm" [disabled]="!newTaskTitle.trim()" (click)="addTask()">
                  {{ i18n.t('action.add') }}
                </button>
              </div>

              <!-- Task List -->
              @if (eventTasks.length === 0) {
                <div class="empty-sub-state">
                  <span class="empty-icon">🕊️</span>
                  <p>{{ i18n.currentLang() === 'ar' ? 'لا توجد مهام مسجلة لهذه المناسبة بعد.' : 'Aucune tâche spécifique pour cet événement.' }}</p>
                </div>
              } @else {
                <div class="tasks-list">
                  @for (t of eventTasks; track t.id) {
                    <div class="task-row" [class.completed]="t.status === 'completed'">
                      <button
                        type="button"
                        class="task-check"
                        [class.checked]="t.status === 'completed'"
                        (click)="diaryService.toggleTask(t.id)"
                      >
                        {{ t.status === 'completed' ? '✓' : '' }}
                      </button>

                      <div class="task-info">
                        <span class="task-title-text">{{ i18n.currentLang() === 'ar' ? t.titleAr : t.titleFr }}</span>
                        <div class="task-tags">
                          <span class="assignee-tag">👤 {{ getAssigneeLabel(t.assigneeRole) }}</span>
                          @if (t.dueDate) {
                            <span class="date-tag">📅 {{ t.dueDate }}</span>
                          }
                          <span class="priority-tag" [class]="'prio-' + t.priority">
                            {{ getPriorityLabel(t.priority) }}
                          </span>
                        </div>
                      </div>

                      <button type="button" class="btn-icon-del" (click)="diaryService.deleteTask(t.id)" title="Supprimer">
                        ✕
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- TAB 3: LINKED SHOPPING & TROUSSEAU -->
          @if (activeTab === 'shopping') {
            <div class="shopping-pane">
              <div class="shopping-top-bar">
                <span class="pane-sub">
                  {{ i18n.currentLang() === 'ar'
                    ? 'اربطي مشتريات جهازك التونسي بهذه المناسبة لتفادي ازدواجية الحسابات.'
                    : 'Associez des articles de votre trousseau Darna à cette célébration (aucun doublon de budget).' }}
                </span>
                <button type="button" class="btn btn-outline btn-sm" (click)="showLinkItemPicker = !showLinkItemPicker">
                  {{ showLinkItemPicker ? '✕ ' + i18n.t('action.cancel') : '+ ' + (i18n.currentLang() === 'ar' ? 'ربط مستلزم من القائمة' : 'Associer un article existant') }}
                </button>
              </div>

              <!-- Item Selector dropdown if opened -->
              @if (showLinkItemPicker) {
                <div class="link-item-picker-box">
                  <label>{{ i18n.currentLang() === 'ar' ? 'اختاري عنصراً من قائمة جهازي :' : 'Sélectionnez dans votre liste de trousseau :' }}</label>
                  <select [(ngModel)]="selectedShoppingItemIdToLink" class="form-control">
                    <option [ngValue]="null">-- Choisir un article --</option>
                    @for (item of availableShoppingItems; track item.id) {
                      <option [value]="item.id">
                        {{ shoppingList.getItemDisplayName(item) }} ({{ item.quantity }} × {{ (item.actualUnitPrice ?? item.estimatedUnitPrice ?? 0) | number:'1.0-2' }} {{ i18n.currency() }})
                      </option>
                    }
                  </select>
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    [disabled]="!selectedShoppingItemIdToLink"
                    (click)="confirmLinkShoppingItem()"
                  >
                    {{ i18n.t('action.add') }}
                  </button>
                </div>
              }

              <!-- Linked Items Table -->
              @if (linkedShoppingItems.length === 0) {
                <div class="empty-sub-state">
                  <span class="empty-icon">🛍️</span>
                  <p>{{ i18n.currentLang() === 'ar' ? 'لم يتم ربط أي مستلزمات بهذه المناسبة بعد.' : 'Aucun article du trousseau lié à cette célébration.' }}</p>
                </div>
              } @else {
                <div class="linked-items-table-wrap">
                  <table class="linked-table">
                    <thead>
                      <tr>
                        <th>{{ i18n.t('pdf.th_item') }}</th>
                        <th>{{ i18n.t('pdf.th_qty') }}</th>
                        <th>{{ i18n.t('pdf.th_est') }}</th>
                        <th>{{ i18n.t('pdf.th_act') }}</th>
                        <th>{{ i18n.t('pdf.th_status') }}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (item of linkedShoppingItems; track item.id) {
                        <tr>
                          <td><strong>{{ shoppingList.getItemDisplayName(item) }}</strong></td>
                          <td>{{ item.quantity }}</td>
                          <td>{{ (item.estimatedUnitPrice || 0) * item.quantity | number:'1.0-2' }} {{ i18n.currency() }}</td>
                          <td>
                            @if (item.isPurchased && item.actualUnitPrice) {
                              <span class="text-sage font-bold">{{ item.actualUnitPrice * item.quantity | number:'1.0-2' }} {{ i18n.currency() }}</span>
                            } @else {
                              <span class="text-muted">--</span>
                            }
                          </td>
                          <td>
                            <span class="status-pill" [class.is-done]="item.isPurchased">
                              {{ item.isPurchased ? '✓ ' + i18n.t('pdf.status_done') : i18n.t('pdf.status_todo') }}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              class="btn-icon-del"
                              (click)="diaryService.unlinkShoppingItemFromEvent(event.id, item.id)"
                              title="Délier"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>

                <div class="table-subtotal-bar">
                  <span>{{ i18n.currentLang() === 'ar' ? 'المجموع التقديري للمشتريات المرتبطة :' : 'Total estimé des achats associés :' }}</span>
                  <strong>{{ financialSummary.shoppingEst | number:'1.0-2' }} {{ i18n.currency() }}</strong>
                </div>
              }
            </div>
          }

          <!-- TAB 4: PROVIDERS & BUDGET -->
          @if (activeTab === 'providers') {
            <div class="providers-pane">
              <!-- Financial Header Banner -->
              <div class="prov-finance-banner">
                <div class="finance-metric">
                  <span class="lbl">{{ i18n.t('diary.financial_agreed') }}</span>
                  <span class="val">{{ financialSummary.agreedTotal | number:'1.0-2' }} {{ i18n.currency() }}</span>
                </div>
                <div class="finance-metric">
                  <span class="lbl">{{ i18n.t('diary.financial_deposit') }}</span>
                  <span class="val text-sage">{{ financialSummary.depositPaid | number:'1.0-2' }} {{ i18n.currency() }}</span>
                </div>
                <div class="finance-metric">
                  <span class="lbl">{{ i18n.t('diary.financial_remaining') }}</span>
                  <span class="val text-danger">{{ financialSummary.remainingDue | number:'1.0-2' }} {{ i18n.currency() }}</span>
                </div>
                <div class="finance-metric">
                  <span class="lbl">{{ i18n.currentLang() === 'ar' ? 'التكلفة الإجمالية' : 'Coût global' }}</span>
                  <span class="val text-primary font-bold">{{ financialSummary.grandTotal | number:'1.0-2' }} {{ i18n.currency() }}</span>
                </div>
              </div>

              <!-- Add Provider Box -->
              <div class="add-provider-form-box">
                <h4 class="box-title">+ {{ i18n.t('diary.add_provider') }}</h4>
                <div class="form-row-prov">
                  <input
                    type="text"
                    [(ngModel)]="newProvName"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'اسم المزود أو الشركة...' : 'Nom du prestataire / enseigne...'"
                    class="form-control"
                  />
                  <input
                    type="text"
                    [(ngModel)]="newProvService"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'الخدمة (مصور، فرقة، قاعة، ماشطة...)' : 'Service (Photographe, Troupe, Salle...)'"
                    class="form-control"
                  />
                  <input
                    type="number"
                    min="0"
                    [(ngModel)]="newProvPrice"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'السعر المتفق عليه (د.ت)' : 'Prix convenu (DT)'"
                    class="form-control"
                  />
                  <input
                    type="number"
                    min="0"
                    [(ngModel)]="newProvDeposit"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'العربون المدفوع (د.ت)' : 'Acompte versé (DT)'"
                    class="form-control"
                  />
                  <input
                    type="text"
                    [(ngModel)]="newProvPhone"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'الهاتف' : 'Tél.'"
                    class="form-control"
                  />
                  <button
                    type="button"
                    class="btn btn-primary"
                    [disabled]="!newProvName.trim() || !newProvService.trim()"
                    (click)="addProvider()"
                  >
                    {{ i18n.t('action.add') }}
                  </button>
                </div>
              </div>

              <!-- Providers List -->
              @if (eventProviders.length === 0) {
                <div class="empty-sub-state">
                  <span class="empty-icon">🤝</span>
                  <p>{{ i18n.currentLang() === 'ar' ? 'لم يتم تسجيل مزودي خدمات لهذه المناسبة بعد.' : 'Aucun prestataire enregistré pour cette célébration.' }}</p>
                </div>
              } @else {
                <div class="providers-list">
                  @for (p of eventProviders; track p.id) {
                    <div class="provider-card">
                      <div class="prov-main">
                        <div class="prov-title-wrap">
                          <strong class="prov-name">{{ p.providerName }}</strong>
                          <span class="prov-service-badge">{{ p.serviceTypeFr }}</span>
                          @if (p.phone) {
                            <a [href]="'tel:' + p.phone" class="prov-phone">📞 {{ p.phone }}</a>
                          }
                        </div>
                        <div class="prov-status-tag" [class]="'status-' + p.bookingStatus">
                          {{ p.bookingStatus }}
                        </div>
                      </div>

                      <div class="prov-finance-row">
                        <div class="fin-col">
                          <small>{{ i18n.t('diary.financial_agreed') }} :</small>
                          <span>{{ p.agreedPrice | number:'1.0-2' }} {{ i18n.currency() }}</span>
                        </div>
                        <div class="fin-col">
                          <small>{{ i18n.t('diary.financial_deposit') }} :</small>
                          <span class="text-sage">{{ p.depositPaid | number:'1.0-2' }} {{ i18n.currency() }}</span>
                        </div>
                        <div class="fin-col">
                          <small>{{ i18n.t('diary.financial_remaining') }} :</small>
                          <strong class="text-danger">{{ (p.agreedPrice - p.depositPaid) | number:'1.0-2' }} {{ i18n.currency() }}</strong>
                        </div>
                        <button type="button" class="btn-icon-del" (click)="diaryService.deleteProvider(p.id)" title="Supprimer">
                          ✕
                        </button>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- TAB 5: EVENT NOTES -->
          @if (activeTab === 'notes') {
            <div class="notes-pane">
              <div class="notes-top-bar">
                <span class="pane-sub">
                  {{ i18n.currentLang() === 'ar' ? 'ملاحظات وأفكار مدونة خصيصاً لهذه المناسبة.' : 'Notes et mémos spécifiques à cette célébration.' }}
                </span>
                <button type="button" class="btn btn-outline btn-sm" (click)="openNewNote()">
                  + {{ i18n.t('diary.add_note') }}
                </button>
              </div>

              @if (eventNotes.length === 0) {
                <div class="empty-sub-state">
                  <span class="empty-icon">✍️</span>
                  <p>{{ i18n.currentLang() === 'ar' ? 'لا توجد مذكرات مرتبطة بهذه المناسبة.' : 'Aucune note spécifique à cet événement.' }}</p>
                </div>
              } @else {
                <div class="notes-grid">
                  @for (n of eventNotes; track n.id) {
                    <div class="note-mini-card">
                      <div class="note-mini-header">
                        <strong>{{ n.title }}</strong>
                        <button type="button" class="btn-icon-del" (click)="diaryService.deleteNote(n.id)">✕</button>
                      </div>
                      <p class="note-mini-content">{{ n.content }}</p>
                      @if (n.associatedDate) {
                        <span class="note-mini-date">📅 {{ n.associatedDate }}</span>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
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
      max-width: 820px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }

    .modal-header {
      padding: 16px 22px;
      background: var(--color-surface-subtle);
      border-bottom: 1px solid var(--color-border);
      border-inline-start-width: 6px;
      border-inline-start-style: solid;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-main {
        display: flex;
        align-items: center;
        gap: 14px;

        .event-icon-badge {
          font-size: 1.8rem;
        }

        .event-title-wrap {
          display: flex;
          flex-direction: column;

          .event-type-badge {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--color-primary);
            font-weight: 700;
          }

          .event-title {
            font-family: var(--font-serif);
            font-size: 1.35rem;
            color: var(--color-text-main);
            margin: 0;
          }

          .event-date-sub {
            font-size: 0.8rem;
            color: var(--color-text-muted);
            margin-top: 2px;
          }
        }
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

    .modal-tabs {
      display: flex;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      padding: 0 12px;
      gap: 4px;
      overflow-x: auto;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: none;
      }

      .tab-btn {
        padding: 11px 14px;
        background: none;
        border: none;
        border-bottom: 2.5px solid transparent;
        font-size: 0.86rem;
        font-weight: 600;
        color: var(--color-text-muted);
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.15s;

        &:hover {
          color: var(--color-text-main);
        }

        &.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
          background: #FFFFFF;
        }

        .tab-count {
          font-size: 0.74rem;
          opacity: 0.8;
        }
      }
    }

    .modal-body {
      padding: 20px 22px;
      overflow-y: auto;
      flex: 1;

      @media (max-width: 600px) {
        padding: 16px 14px;
        padding-bottom: max(20px, env(safe-area-inset-bottom, 20px));
      }
    }

    @media (max-width: 640px) {
      .modal-card {
        border-radius: 24px 24px 0 0 !important;
        margin: 0 !important;
        max-height: 92vh !important;
        max-height: 92dvh !important;
      }

      .modal-header {
        padding: 14px 16px;

        .header-main {
          gap: 10px;

          .event-icon-badge {
            font-size: 1.5rem;
          }

          .event-title-wrap {
            .event-title {
              font-size: 1.15rem;
            }
          }
        }
      }

      .quick-add-task-box {
        flex-direction: column;

        .add-task-input,
        .select-assignee,
        .add-task-date,
        .btn {
          width: 100% !important;
          min-height: 42px;
        }
      }
    }

    /* TAB 1: OVERVIEW */
    .event-kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;

      @media (max-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .kpi-card {
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 10px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .kpi-label {
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .select-clean {
          background: transparent;
          border: none;
          font-size: 0.86rem;
          font-weight: 700;
          color: var(--color-text-main);
          outline: none;
          cursor: pointer;
        }

        .budget-input-inline {
          display: flex;
          align-items: center;
          gap: 4px;

          .input-num-clean {
            width: 70px;
            border: 1px solid var(--color-border);
            border-radius: var(--radius-sm);
            padding: 2px 6px;
            font-size: 0.88rem;
            font-weight: 700;
          }
        }
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        &.full-width {
          grid-column: span 2;
          @media (max-width: 600px) {
            grid-column: span 1;
          }
        }

        label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .form-control {
          padding: 8px 12px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          outline: none;
          font-family: inherit;

          &:focus {
            border-color: var(--color-primary);
          }
        }
      }
    }

    .danger-zone {
      margin-top: 24px;
      padding-top: 14px;
      border-top: 1px solid var(--color-border-subtle);
      display: flex;
      justify-content: flex-end;

      .btn-outline-danger {
        border: 1px solid #FFCDD2;
        background: #FFEBEE;
        color: #C62828;
        padding: 7px 14px;
        border-radius: var(--radius-md);
        font-size: 0.82rem;
        cursor: pointer;
        font-weight: 600;

        &:hover {
          background: #FFCDD2;
        }
      }
    }

    /* TAB 2: TASKS */
    .quick-add-task-box {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      flex-wrap: wrap;

      .add-task-input {
        flex: 1;
        min-width: 200px;
        padding: 8px 12px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 0.88rem;
        outline: none;

        &:focus {
          border-color: var(--color-primary);
        }
      }

      .select-assignee,
      .add-task-date {
        padding: 8px 10px;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 0.82rem;
        background: #FFFFFF;
      }
    }

    .tasks-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .task-row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 14px;
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        transition: background-color 0.15s;

        &.completed {
          background: #FAFCFA;
          opacity: 0.75;

          .task-title-text {
            text-decoration: line-through;
            color: var(--color-text-muted);
          }
        }

        .task-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.8px solid var(--color-border-strong);
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #FFFFFF;
          font-weight: bold;
          font-size: 0.76rem;
          flex-shrink: 0;

          &.checked {
            background: var(--color-success);
            border-color: var(--color-success);
          }
        }

        .task-info {
          flex: 1;

          .task-title-text {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--color-text-main);
          }

          .task-tags {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 4px;
            flex-wrap: wrap;

            .assignee-tag,
            .date-tag {
              font-size: 0.72rem;
              background: #FFFFFF;
              border: 1px solid var(--color-border-subtle);
              padding: 1px 6px;
              border-radius: var(--radius-sm);
              color: var(--color-text-muted);
            }

            .priority-tag {
              font-size: 0.68rem;
              font-weight: 700;
              padding: 1px 6px;
              border-radius: var(--radius-full);

              &.prio-essential {
                background: #FFEBEE;
                color: #C62828;
              }
              &.prio-useful {
                background: #E8F5E9;
                color: #2E7D32;
              }
              &.prio-optional {
                background: #FFF3E0;
                color: #EF6C00;
              }
            }
          }
        }
      }
    }

    /* TAB 3: SHOPPING */
    .shopping-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      gap: 12px;

      .pane-sub {
        font-size: 0.84rem;
        color: var(--color-text-muted);
      }
    }

    .link-item-picker-box {
      background: var(--color-surface-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      flex-wrap: wrap;

      label {
        font-size: 0.82rem;
        font-weight: 600;
      }
    }

    .linked-items-table-wrap {
      overflow-x: auto;

      .linked-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.86rem;

        th {
          text-align: start;
          padding: 8px 10px;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text-muted);
          font-size: 0.76rem;
          text-transform: uppercase;
        }

        td {
          padding: 10px;
          border-bottom: 1px solid var(--color-border-subtle);
        }

        .status-pill {
          font-size: 0.72rem;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          background: #FFF3E0;
          color: #EF6C00;
          font-weight: 600;

          &.is-done {
            background: #E8F5E9;
            color: #2E7D32;
          }
        }
      }
    }

    .table-subtotal-bar {
      display: flex;
      justify-content: space-between;
      padding: 12px 14px;
      background: var(--color-surface-subtle);
      border-radius: var(--radius-md);
      margin-top: 12px;
      font-size: 0.9rem;
    }

    /* TAB 4: PROVIDERS */
    .prov-finance-banner {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: var(--color-sand);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 12px 16px;
      margin-bottom: 16px;

      @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .finance-metric {
        display: flex;
        flex-direction: column;

        .lbl {
          font-size: 0.7rem;
          text-transform: uppercase;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .val {
          font-size: 1.1rem;
          font-weight: 700;
        }
      }
    }

    .add-provider-form-box {
      background: var(--color-surface-subtle);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 12px 14px;
      margin-bottom: 16px;

      .box-title {
        font-size: 0.84rem;
        margin: 0 0 8px 0;
        color: var(--color-primary);
      }

      .form-row-prov {
        display: grid;
        grid-template-columns: 1.2fr 1.2fr 1fr 1fr 1fr auto;
        gap: 8px;

        @media (max-width: 768px) {
          grid-template-columns: 1fr 1fr;
        }
      }
    }

    .providers-list {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .provider-card {
        background: #FFFFFF;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .prov-main {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .prov-title-wrap {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;

            .prov-name {
              font-size: 0.95rem;
              color: var(--color-text-main);
            }

            .prov-service-badge {
              font-size: 0.72rem;
              background: var(--color-surface-subtle);
              padding: 1px 7px;
              border-radius: var(--radius-sm);
              border: 1px solid var(--color-border);
            }

            .prov-phone {
              font-size: 0.78rem;
              color: var(--color-primary);
              text-decoration: underline;
            }
          }

          .prov-status-tag {
            font-size: 0.72rem;
            text-transform: uppercase;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: var(--radius-full);
            background: #E8F5E9;
            color: #2E7D32;
          }
        }

        .prov-finance-row {
          display: flex;
          align-items: center;
          gap: 16px;
          border-top: 1px dashed var(--color-border-subtle);
          padding-top: 6px;
          font-size: 0.82rem;

          .fin-col {
            display: flex;
            gap: 4px;
            align-items: baseline;

            small {
              color: var(--color-text-muted);
            }
          }
        }
      }
    }

    /* TAB 5: NOTES */
    .notes-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;

      .pane-sub {
        font-size: 0.84rem;
        color: var(--color-text-muted);
      }
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;

      .note-mini-card {
        background: var(--color-sand);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;

        .note-mini-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          color: var(--color-primary);
        }

        .note-mini-content {
          font-size: 0.8rem;
          color: var(--color-text-main);
          line-height: 1.45;
          margin: 0;
        }

        .note-mini-date {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          margin-top: auto;
        }
      }
    }

    .empty-sub-state {
      padding: 30px;
      text-align: center;
      color: var(--color-text-muted);

      .empty-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 6px;
      }
    }

    .btn-icon-del {
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 4px;
      border-radius: var(--radius-sm);
      margin-inline-start: auto;

      &:hover {
        color: #C62828;
      }
    }

    .text-sage { color: #2E7D32; }
    .text-danger { color: #C62828; }
    .text-primary { color: var(--color-primary); }
    .font-bold { font-weight: 700; }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class EventDetailModalComponent implements OnInit {
  diaryService = inject(WeddingDiaryService);
  shoppingList = inject(ShoppingListService);
  i18n = inject(I18nService);
  toast = inject(ToastService);

  @Input() event!: WeddingEvent;
  @Output() close = new EventEmitter<void>();
  @Output() addNoteRequested = new EventEmitter<{ eventId: string; date?: string }>();

  activeTab: 'overview' | 'tasks' | 'shopping' | 'providers' | 'notes' = 'overview';

  // Task form state
  newTaskTitle = '';
  newTaskAssignee: TaskAssigneeRole = 'bride';
  newTaskDueDate = '';

  // Shopping linking state
  showLinkItemPicker = false;
  selectedShoppingItemIdToLink: string | null = null;

  // Provider form state
  newProvName = '';
  newProvService = '';
  newProvPrice: number | null = null;
  newProvDeposit: number | null = null;
  newProvPhone = '';

  ngOnInit(): void {
    if (this.event) {
      this.newTaskDueDate = this.event.date;
    }
  }

  get eventTasks(): WeddingTask[] {
    return this.diaryService.tasks().filter(t => t.eventId === this.event.id);
  }

  get eventProviders(): EventProvider[] {
    return this.diaryService.providers().filter(p => p.eventId === this.event.id);
  }

  get eventNotes(): DiaryNote[] {
    return this.diaryService.notes().filter(n => n.eventId === this.event.id);
  }

  get linkedShoppingItems() {
    const ids = new Set(this.event.linkedShoppingItemIds || []);
    return this.shoppingList.items().filter(item => ids.has(item.id));
  }

  get availableShoppingItems() {
    const ids = new Set(this.event.linkedShoppingItemIds || []);
    return this.shoppingList.items().filter(item => !ids.has(item.id));
  }

  get financialSummary() {
    return this.diaryService.getEventFinancialSummary(this.event.id);
  }

  getEventIcon(type: string): string {
    const def = EVENT_TEMPLATE_DEFINITIONS[type as keyof typeof EVENT_TEMPLATE_DEFINITIONS];
    return def ? def.icon : '📌';
  }

  getEventTypeName(type: string): string {
    const def = EVENT_TEMPLATE_DEFINITIONS[type as keyof typeof EVENT_TEMPLATE_DEFINITIONS];
    if (!def) return type;
    const lang = this.i18n.currentLang();
    return lang === 'ar' ? def.titleAr : def.titleFr;
  }

  getPriorityLabel(priority: TaskPriority): string {
    const keyMap: Record<TaskPriority, TranslationKey> = {
      essential: 'priority.essential',
      useful: 'priority.useful',
      optional: 'priority.optional'
    };
    return this.i18n.t(keyMap[priority] || 'priority.useful');
  }

  getAssigneeLabel(role: TaskAssigneeRole): string {
    const roleMap: Record<TaskAssigneeRole, TranslationKey> = {
      bride: 'diary.role_bride',
      groom: 'diary.role_groom',
      mother: 'diary.role_mother',
      father: 'diary.role_father',
      sister: 'diary.role_sister',
      brother: 'diary.role_brother',
      family: 'diary.role_family',
      helper: 'diary.role_helper',
      provider: 'diary.role_provider',
      other: 'diary.role_other'
    };
    return this.i18n.t(roleMap[role] || 'diary.role_other');
  }

  saveEventChanges(): void {
    this.diaryService.updateEvent(this.event.id, {
      date: this.event.date,
      startTime: this.event.startTime,
      endTime: this.event.endTime,
      location: this.event.location,
      status: this.event.status,
      priority: this.event.priority,
      budgetLimit: this.event.budgetLimit,
      notes: this.event.notes
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return;
    this.diaryService.createTask({
      eventId: this.event.id,
      title: this.newTaskTitle.trim(),
      dueDate: this.newTaskDueDate || this.event.date,
      assigneeRole: this.newTaskAssignee,
      priority: 'essential'
    });
    this.newTaskTitle = '';
    this.toast.show(this.i18n.currentLang() === 'ar' ? 'تمت إضافة المهمة ✓' : 'Tâche ajoutée avec succès ✓');
  }

  confirmLinkShoppingItem(): void {
    if (!this.selectedShoppingItemIdToLink) return;
    this.diaryService.linkShoppingItemToEvent(this.event.id, this.selectedShoppingItemIdToLink);
    this.selectedShoppingItemIdToLink = null;
    this.showLinkItemPicker = false;
    this.toast.show(this.i18n.currentLang() === 'ar' ? 'تم ربط الغرض بالمناسبة ✓' : 'Article lié à la célébration ✓');
  }

  addProvider(): void {
    if (!this.newProvName.trim() || !this.newProvService.trim()) return;
    this.diaryService.createProvider({
      eventId: this.event.id,
      providerName: this.newProvName.trim(),
      serviceType: this.newProvService.trim(),
      agreedPrice: Number(this.newProvPrice) || 0,
      depositPaid: Number(this.newProvDeposit) || 0,
      phone: this.newProvPhone.trim()
    });
    this.newProvName = '';
    this.newProvService = '';
    this.newProvPrice = null;
    this.newProvDeposit = null;
    this.newProvPhone = '';
    this.toast.show(this.i18n.currentLang() === 'ar' ? 'تم تسجيل المزود والعقد بنجاح ✓' : 'Prestataire et contrat enregistrés ✓');
  }

  openNewNote(): void {
    this.addNoteRequested.emit({ eventId: this.event.id, date: this.event.date });
  }

  confirmDeleteEvent(): void {
    const lang = this.i18n.currentLang();
    const prompt = lang === 'ar'
      ? 'هل أنت متأكدة من حذف هذه المناسبة من دفترك؟ سيتم حذف المهام المرتبطة بها.'
      : 'Êtes-vous sûre de vouloir supprimer cet événement et ses tâches associées ?';
    if (confirm(prompt)) {
      this.diaryService.deleteEvent(this.event.id);
      this.toast.show(lang === 'ar' ? 'تم حذف المناسبة' : 'Événement supprimé');
      this.close.emit();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
