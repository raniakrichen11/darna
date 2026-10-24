import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WeddingDiaryService } from '../../services/wedding-diary.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import {
  WeddingEvent,
  WeddingTask,
  DiaryNote,
  EventProvider,
  WeddingEventType,
  EVENT_TEMPLATE_DEFINITIONS
} from '../../models/wedding-diary.model';
import { EventDetailModalComponent } from '../../components/event-detail-modal/event-detail-modal.component';
import { AddEventModalComponent } from '../../components/add-event-modal/add-event-modal.component';
import { NoteModalComponent } from '../../components/note-modal/note-modal.component';
import { TraditionsModalComponent } from '../../components/traditions-modal/traditions-modal.component';

export interface CalendarDayCell {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: WeddingEvent[];
  tasks: WeddingTask[];
}

@Component({
  selector: 'app-wedding-diary',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    EventDetailModalComponent,
    AddEventModalComponent,
    NoteModalComponent,
    TraditionsModalComponent
  ],
  template: `
    <div class="diary-page" [attr.dir]="i18n.dir()">
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-main-text">
          <span class="page-eyebrow">{{ i18n.currentLang() === 'ar' ? 'دفتر العرس والروزنامة التونسية' : 'DARNA WEDDING DIARY & CALENDAR' }}</span>
          <h1 class="page-title">{{ i18n.t('diary.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('diary.subtitle') }}</p>
        </div>

        <div class="header-actions">
          <button type="button" class="btn btn-outline" (click)="openTraditionsModal()">
            🏛️ {{ i18n.t('diary.tab_traditions') }}
          </button>
          <button type="button" class="btn btn-primary" (click)="openAddEventModal()">
            + {{ i18n.t('diary.add_event') }}
          </button>
        </div>
      </header>

      <!-- Countdown & KPI Hero Strip -->
      <section class="hero-kpi-strip card">
        <!-- Countdown Widget -->
        <div class="kpi-countdown-box">
          @if (diaryService.weddingDate(); as wDate) {
            <div class="countdown-inner">
              <span class="countdown-badge">💍 {{ i18n.currentLang() === 'ar' ? 'موعد الزفاف المبارك' : 'Jour J du Mariage' }}</span>
              @if (diaryService.daysUntilWedding()! > 0) {
                <div class="countdown-number">
                  <span class="digits">{{ diaryService.daysUntilWedding() }}</span>
                  <small>{{ i18n.t('diary.countdown_days') }}</small>
                </div>
                <span class="countdown-target-date">📅 {{ wDate }}</span>
              } @else if (diaryService.daysUntilWedding() === 0) {
                <div class="countdown-today-banner">
                  🎉 {{ i18n.t('diary.countdown_today') }}
                </div>
              } @else {
                <div class="countdown-past">
                  🕊️ {{ i18n.currentLang() === 'ar' ? 'ألف مبروك زواجكما السعيد' : 'Tous nos vœux de bonheur' }}
                </div>
              }
            </div>
          } @else {
            <div class="countdown-setup-prompt">
              <span class="prompt-icon">💍</span>
              <div>
                <strong>{{ i18n.t('diary.setup_prompt') }}</strong>
                <p>{{ i18n.currentLang() === 'ar' ? 'أدخلي موعد زفافك في الإعدادات لمتابعة العد التنازلي التلقائي.' : 'Renseignez la date dans les paramètres pour activer le décompte.' }}</p>
              </div>
              <a routerLink="/settings" class="btn btn-outline btn-sm">
                ⚙️ {{ i18n.t('nav.settings') }}
              </a>
            </div>
          }
        </div>

        <!-- Next Imminent Celebration -->
        <div class="kpi-next-celebration">
          <span class="kpi-sub-title">🕊️ {{ i18n.currentLang() === 'ar' ? 'المناسبة القادمة' : 'Prochaine célébration' }}</span>
          @if (diaryService.nextUpcomingEvent(); as nextEv) {
            <div class="next-ev-content" (click)="openEventDetail(nextEv)">
              <span class="next-ev-icon">{{ getEventIcon(nextEv.eventType) }}</span>
              <div class="next-ev-meta">
                <strong class="next-ev-title">{{ diaryService.getEventDisplayName(nextEv) }}</strong>
                <span class="next-ev-date">📅 {{ nextEv.date }} @if (nextEv.location) { · 📍 {{ nextEv.location }} }</span>
              </div>
              <span class="arrow-indicator">➔</span>
            </div>
          } @else {
            <div class="next-ev-empty">
              <span>{{ i18n.currentLang() === 'ar' ? 'لا توجد مناسبات قادمة محددة.' : 'Aucun événement à venir.' }}</span>
              <button type="button" class="btn-text" (click)="openAddEventModal()">+ {{ i18n.t('diary.add_event') }}</button>
            </div>
          }
        </div>

        <!-- Progress & Urgent Tasks -->
        <div class="kpi-tasks-progress">
          <div class="progress-header">
            <span class="kpi-sub-title">✓ {{ i18n.currentLang() === 'ar' ? 'تقدم الإنجاز العام' : 'Avancement des préparatifs' }}</span>
            <span class="progress-pct">{{ diaryService.taskCompletionPercentage() }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" [style.width]="diaryService.taskCompletionPercentage() + '%'"></div>
          </div>
          <div class="tasks-mini-stats">
            <span>{{ diaryService.completedTasksCount() }}/{{ diaryService.totalTasksCount() }} {{ i18n.currentLang() === 'ar' ? 'مهام منجزة' : 'tâches faites' }}</span>
            @if (diaryService.tasksOverdue().length > 0) {
              <span class="badge-overdue">⚠️ {{ diaryService.tasksOverdue().length }} {{ i18n.t('diary.tasks_overdue') }}</span>
            }
          </div>
        </div>

        <!-- Financial Overview Snapshot -->
        <div class="kpi-finance-box">
          <span class="kpi-sub-title">💰 {{ i18n.currentLang() === 'ar' ? 'الملخص المالي للعرس' : 'Budget global carnet' }}</span>
          <div class="finance-vals">
            <div class="fin-item">
              <small>{{ i18n.t('diary.financial_deposit') }} :</small>
              <strong class="text-sage">{{ diaryService.financialSummary().totalActualSpent | number:'1.0-2' }} {{ i18n.currency() }}</strong>
            </div>
            <div class="fin-item">
              <small>{{ i18n.t('diary.financial_remaining') }} :</small>
              <span class="text-danger font-bold">{{ diaryService.financialSummary().totalRemainingProviders | number:'1.0-2' }} {{ i18n.currency() }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Navigation Tabs of the Wedding Diary -->
      <nav class="diary-nav-tabs">
        <button
          type="button"
          class="nav-tab-btn"
          [class.active]="mainTab === 'calendar'"
          (click)="mainTab = 'calendar'"
        >
          📅 {{ i18n.t('diary.tab_calendar') }}
        </button>
        <button
          type="button"
          class="nav-tab-btn"
          [class.active]="mainTab === 'overview'"
          (click)="mainTab = 'overview'"
        >
          📋 {{ i18n.t('diary.tab_overview') }}
        </button>
        <button
          type="button"
          class="nav-tab-btn"
          [class.active]="mainTab === 'traditions'"
          (click)="mainTab = 'traditions'"
        >
          🏛️ {{ i18n.t('diary.tab_traditions') }}
        </button>
        <button
          type="button"
          class="nav-tab-btn"
          [class.active]="mainTab === 'notes'"
          (click)="mainTab = 'notes'"
        >
          ✍️ {{ i18n.t('diary.tab_notes') }}
          <span class="badge-count">{{ diaryService.notes().length }}</span>
        </button>
        <button
          type="button"
          class="nav-tab-btn"
          [class.active]="mainTab === 'providers'"
          (click)="mainTab = 'providers'"
        >
          🤝 {{ i18n.t('diary.tab_providers') }}
          <span class="badge-count">{{ diaryService.providers().length }}</span>
        </button>
      </nav>

      <!-- ========================================== -->
      <!-- TAB 1: INTERACTIVE CALENDAR & AGENDA       -->
      <!-- ========================================== -->
      @if (mainTab === 'calendar') {
        <section class="calendar-section card">
          <!-- Calendar Controls Bar -->
          <div class="calendar-toolbar">
            <div class="calendar-nav-group">
              <button type="button" class="btn btn-outline btn-sm nav-arrow-btn" (click)="prevMonth()" aria-label="Mois précédent">
                {{ i18n.isRtl() ? '➔' : '←' }}
              </button>
              <h2 class="current-month-heading">{{ currentMonthLabel }}</h2>
              <button type="button" class="btn btn-outline btn-sm nav-arrow-btn" (click)="nextMonth()" aria-label="Mois suivant">
                {{ i18n.isRtl() ? '←' : '➔' }}
              </button>
              <button type="button" class="btn btn-subtle btn-sm today-btn" (click)="goToToday()">
                {{ i18n.t('diary.today_btn') }}
              </button>
            </div>

            <!-- View Switcher (Month / Agenda) -->
            <div class="calendar-view-switcher">
              <button
                type="button"
                class="view-pill"
                [class.active]="calendarViewMode === 'month'"
                (click)="calendarViewMode = 'month'"
              >
                {{ i18n.t('diary.calendar_month') }}
              </button>
              <button
                type="button"
                class="view-pill"
                [class.active]="calendarViewMode === 'agenda'"
                (click)="calendarViewMode = 'agenda'"
              >
                {{ i18n.t('diary.calendar_agenda') }}
              </button>
            </div>
          </div>

          <!-- MONTH VIEW GRID -->
          @if (calendarViewMode === 'month') {
            <div class="calendar-month-grid">
              <!-- Weekday Header -->
              <div class="weekdays-row">
                @for (dayName of weekdayNames; track dayName) {
                  <span class="weekday-header-cell">{{ dayName }}</span>
                }
              </div>

              <!-- Days Grid (42 cells) -->
              <div class="days-cells-grid">
                @for (cell of calendarDays(); track cell.dateString) {
                  <div
                    class="day-cell"
                    [class.not-current-month]="!cell.isCurrentMonth"
                    [class.is-today]="cell.isToday"
                    [class.is-selected]="selectedDateString === cell.dateString"
                    (click)="onSelectDate(cell)"
                  >
                    <div class="day-cell-top">
                      <span class="day-number">{{ cell.dayNumber }}</span>
                      @if (cell.events.length > 0) {
                        <span class="ev-counter-dot" [style.background]="cell.events[0].color || '#713848'"></span>
                      }
                    </div>

                    <!-- Event Badges inside Cell -->
                    <div class="day-cell-events">
                      @for (ev of cell.events.slice(0, 2); track ev.id) {
                        <div
                          class="cal-event-pill"
                          [style.background]="ev.color || '#713848'"
                          (click)="$event.stopPropagation(); openEventDetail(ev)"
                          [title]="diaryService.getEventDisplayName(ev)"
                        >
                          <span class="pill-text">{{ diaryService.getEventDisplayName(ev) }}</span>
                        </div>
                      }
                      @if (cell.events.length > 2) {
                        <span class="more-events-tag">+{{ cell.events.length - 2 }}</span>
                      }
                      @if (cell.tasks.length > 0) {
                        <span class="tasks-due-dot" title="Tâches dues ce jour">✓ {{ cell.tasks.length }}</span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- AGENDA / LIST VIEW -->
          @if (calendarViewMode === 'agenda') {
            <div class="agenda-view-list">
              @if (diaryService.upcomingEvents().length === 0) {
                <div class="empty-state">
                  <span class="empty-icon">🕊️</span>
                  <p>{{ i18n.t('diary.empty_events') }}</p>
                  <button type="button" class="btn btn-primary" (click)="openAddEventModal()">
                    + {{ i18n.t('diary.add_event') }}
                  </button>
                </div>
              } @else {
                @for (ev of diaryService.upcomingEvents(); track ev.id) {
                  <div class="agenda-item-card" [style.border-inline-start-color]="ev.color || '#713848'" (click)="openEventDetail(ev)">
                    <div class="agenda-date-box">
                      <span class="ag-day">{{ ev.date | slice:8:10 }}</span>
                      <span class="ag-month">{{ ev.date | slice:5:7 }}</span>
                    </div>

                    <div class="agenda-info">
                      <div class="ag-header-row">
                        <span class="ag-icon">{{ getEventIcon(ev.eventType) }}</span>
                        <h4 class="ag-title">{{ diaryService.getEventDisplayName(ev) }}</h4>
                        <span class="ag-status" [class]="'status-' + ev.status">{{ ev.status }}</span>
                      </div>
                      <div class="ag-meta-row">
                        @if (ev.startTime) { <span>⏰ {{ ev.startTime }} - {{ ev.endTime || '' }}</span> }
                        @if (ev.location) { <span>📍 {{ ev.location }}</span> }
                        @if (ev.budgetLimit) { <span>💰 {{ ev.budgetLimit | number:'1.0-2' }} {{ i18n.currency() }}</span> }
                      </div>
                    </div>

                    <button type="button" class="btn btn-outline btn-sm ag-open-btn">
                      {{ i18n.currentLang() === 'ar' ? 'التفاصيل' : 'Ouvrir' }}
                    </button>
                  </div>
                }
              }
            </div>
          }

          <!-- Selected Day Drawer / Quick Inspector -->
          @if (selectedDateCell) {
            <div class="selected-day-drawer">
              <div class="drawer-header">
                <h3>📅 {{ i18n.currentLang() === 'ar' ? 'مواعيد ومهام يوم :' : 'Planning du :' }} {{ selectedDateCell.dateString }}</h3>
                <button type="button" class="btn btn-sm btn-outline" (click)="openAddEventOnDate(selectedDateCell.dateString)">
                  + {{ i18n.t('diary.add_event') }}
                </button>
              </div>

              @if (selectedDateCell.events.length === 0 && selectedDateCell.tasks.length === 0) {
                <p class="drawer-empty">{{ i18n.currentLang() === 'ar' ? 'لا توجد مناسبات أو مهام مجدولة لهذا اليوم.' : 'Aucun événement ou tâche planifié pour cette date.' }}</p>
              } @else {
                <div class="drawer-items-list">
                  @for (ev of selectedDateCell.events; track ev.id) {
                    <div class="drawer-event-pill" (click)="openEventDetail(ev)">
                      <span>{{ getEventIcon(ev.eventType) }}</span>
                      <strong>{{ diaryService.getEventDisplayName(ev) }}</strong>
                      <small>@if (ev.startTime) { ({{ ev.startTime }}) }</small>
                    </div>
                  }
                  @for (t of selectedDateCell.tasks; track t.id) {
                    <div class="drawer-task-row">
                      <span class="task-tick" [class.done]="t.status === 'completed'">{{ t.status === 'completed' ? '✓' : '□' }}</span>
                      <span>{{ i18n.currentLang() === 'ar' ? t.titleAr : t.titleFr }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </section>
      }

      <!-- ========================================== -->
      <!-- TAB 2: OVERVIEW & TASK BOARDS              -->
      <!-- ========================================== -->
      @if (mainTab === 'overview') {
        <section class="overview-section">
          <div class="tasks-columns-grid">
            <!-- Col 1: Tasks Today -->
            <div class="task-col card">
              <div class="col-header">
                <span class="col-icon">⚡</span>
                <h3>{{ i18n.t('diary.tasks_today') }}</h3>
                <span class="col-tally">{{ diaryService.tasksToday().length }}</span>
              </div>
              @if (diaryService.tasksToday().length === 0) {
                <div class="col-empty">
                  <p>{{ i18n.t('diary.no_tasks_today') }}</p>
                </div>
              } @else {
                <div class="tasks-mini-list">
                  @for (t of diaryService.tasksToday(); track t.id) {
                    <div class="mini-task-card">
                      <button type="button" class="mini-tick" (click)="diaryService.toggleTask(t.id)">✓</button>
                      <div class="mini-task-info">
                        <strong>{{ i18n.currentLang() === 'ar' ? t.titleAr : t.titleFr }}</strong>
                        <small>👤 {{ t.assigneeRole }}</small>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Col 2: Tasks Due Soon (This Week) -->
            <div class="task-col card">
              <div class="col-header">
                <span class="col-icon">📅</span>
                <h3>{{ i18n.t('diary.tasks_upcoming') }}</h3>
                <span class="col-tally">{{ diaryService.tasksDueSoon().length }}</span>
              </div>
              @if (diaryService.tasksDueSoon().length === 0) {
                <div class="col-empty">
                  <p>{{ i18n.t('diary.no_tasks_upcoming') }}</p>
                </div>
              } @else {
                <div class="tasks-mini-list">
                  @for (t of diaryService.tasksDueSoon(); track t.id) {
                    <div class="mini-task-card">
                      <button type="button" class="mini-tick" (click)="diaryService.toggleTask(t.id)">✓</button>
                      <div class="mini-task-info">
                        <strong>{{ i18n.currentLang() === 'ar' ? t.titleAr : t.titleFr }}</strong>
                        <small>📅 {{ t.dueDate }} · 👤 {{ t.assigneeRole }}</small>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Col 3: Overdue Tasks -->
            <div class="task-col card" [class.has-overdue]="diaryService.tasksOverdue().length > 0">
              <div class="col-header">
                <span class="col-icon">⚠️</span>
                <h3 class="text-danger">{{ i18n.t('diary.tasks_overdue') }}</h3>
                <span class="col-tally tally-danger">{{ diaryService.tasksOverdue().length }}</span>
              </div>
              @if (diaryService.tasksOverdue().length === 0) {
                <div class="col-empty">
                  <p>{{ i18n.currentLang() === 'ar' ? 'لا توجد مهام متأخرة ✨' : 'Aucun retard constaté ✨' }}</p>
                </div>
              } @else {
                <div class="tasks-mini-list">
                  @for (t of diaryService.tasksOverdue(); track t.id) {
                    <div class="mini-task-card is-overdue">
                      <button type="button" class="mini-tick" (click)="diaryService.toggleTask(t.id)">✓</button>
                      <div class="mini-task-info">
                        <strong>{{ i18n.currentLang() === 'ar' ? t.titleAr : t.titleFr }}</strong>
                        <small class="text-danger">Échéance dépassée : {{ t.dueDate }}</small>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </section>
      }

      <!-- ========================================== -->
      <!-- TAB 3: REGIONAL TRADITIONS EXPLORER        -->
      <!-- ========================================== -->
      @if (mainTab === 'traditions') {
        <section class="traditions-view-section">
          <div class="traditions-header-banner card">
            <div>
              <span class="banner-eyebrow">{{ i18n.currentLang() === 'ar' ? 'أصالة 14 ولاية وجهة تونسية' : '14 GOUVERNORATS & RÉGIONS DE TUNISIE' }}</span>
              <h2>{{ i18n.t('diary.traditions_title') }}</h2>
              <p>{{ i18n.t('diary.traditions_desc') }}</p>
            </div>
            <button type="button" class="btn btn-primary" (click)="openTraditionsModal()">
              ✨ {{ i18n.currentLang() === 'ar' ? 'تخصيص برنامجي حسب الجهة' : 'Personnaliser selon ma région' }}
            </button>
          </div>

          <div class="regions-cards-grid">
            @for (reg of diaryService.regionalTraditions(); track reg.regionId) {
              <div class="region-card card">
                <div class="reg-card-top">
                  <span class="reg-pin">📍</span>
                  <div class="reg-titles">
                    <h4>{{ i18n.currentLang() === 'ar' ? reg.regionNameAr : reg.regionNameFr }}</h4>
                    <small>{{ i18n.currentLang() === 'ar' ? reg.localityAr : reg.localityFr }}</small>
                  </div>
                  <span
                    class="badge-status"
                    [class.verified]="reg.verificationStatus === 'verified_ethnographic'"
                  >
                    {{ reg.verificationStatus === 'verified_ethnographic' ? i18n.t('diary.verified_badge') : i18n.t('diary.confirm_local_badge') }}
                  </span>
                </div>

                <p class="reg-summary-text">
                  {{ i18n.currentLang() === 'ar' ? reg.summaryAr : reg.summaryFr }}
                </p>

                <div class="reg-outfits-row">
                  @for (outfit of (i18n.currentLang() === 'ar' ? reg.traditionalOutfitsAr : reg.traditionalOutfitsFr).slice(0, 2); track outfit) {
                    <span class="mini-outfit-tag">👗 {{ outfit }}</span>
                  }
                </div>

                <button type="button" class="btn btn-outline btn-sm apply-reg-btn" (click)="openTraditionsModal()">
                  {{ i18n.t('diary.apply_tradition') }} ➔
                </button>
              </div>
            }
          </div>
        </section>
      }

      <!-- ========================================== -->
      <!-- TAB 4: PRIVATE NOTES & DIARY               -->
      <!-- ========================================== -->
      @if (mainTab === 'notes') {
        <section class="notes-section">
          <div class="notes-toolbar">
            <div class="search-wrap">
              <input
                type="text"
                [(ngModel)]="notesSearchQuery"
                [placeholder]="i18n.currentLang() === 'ar' ? 'بحث في المذكرات...' : 'Rechercher dans mes notes...'"
                class="notes-search-input"
              />
            </div>
            <button type="button" class="btn btn-primary" (click)="openCreateNote()">
              + {{ i18n.t('diary.add_note') }}
            </button>
          </div>

          @if (filteredNotes().length === 0) {
            <div class="empty-state card">
              <span class="empty-icon">✍️</span>
              <p>{{ i18n.t('diary.empty_notes') }}</p>
              <button type="button" class="btn btn-primary" (click)="openCreateNote()">
                + {{ i18n.t('diary.add_note') }}
              </button>
            </div>
          } @else {
            <div class="notes-cards-grid">
              @for (n of filteredNotes(); track n.id) {
                <div class="note-card card" [class.pinned]="n.isPinned">
                  <div class="note-header">
                    <span class="note-cat-tag">{{ n.category }}</span>
                    <button
                      type="button"
                      class="pin-btn"
                      [class.pinned]="n.isPinned"
                      (click)="diaryService.togglePinNote(n.id)"
                      [title]="n.isPinned ? i18n.t('diary.unpin_note') : i18n.t('diary.pin_note')"
                    >
                      📌
                    </button>
                  </div>

                  <h3 class="note-title">{{ n.title }}</h3>
                  <p class="note-content-text">{{ n.content }}</p>

                  <div class="note-footer">
                    @if (n.associatedDate) {
                      <span class="note-date">📅 {{ n.associatedDate }}</span>
                    }
                    <div class="note-card-actions">
                      <button type="button" class="btn-text-edit" (click)="openEditNote(n)">
                        {{ i18n.t('action.edit') }}
                      </button>
                      <button type="button" class="btn-text-del" (click)="diaryService.deleteNote(n.id)">
                        {{ i18n.t('action.delete') }}
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </section>
      }

      <!-- ========================================== -->
      <!-- TAB 5: VENDORS & CONTRACTS                 -->
      <!-- ========================================== -->
      @if (mainTab === 'providers') {
        <section class="providers-view-section card">
          <div class="prov-section-header">
            <div>
              <h3>{{ i18n.t('diary.tab_providers') }}</h3>
              <p>{{ i18n.currentLang() === 'ar' ? 'سجل عقودك، أسعار الخدمات، العرابين المدفوعة والأرصدة المتبقية لكل مزود.' : 'Tous vos prestataires, acomptes versés et soldes restants.' }}</p>
            </div>
            <button type="button" class="btn btn-primary btn-sm" (click)="openAddEventModal()">
              + {{ i18n.t('diary.add_event') }}
            </button>
          </div>

          @if (diaryService.providers().length === 0) {
            <div class="empty-state">
              <span class="empty-icon">🤝</span>
              <p>{{ i18n.currentLang() === 'ar' ? 'لم تقومي بتسجيل عقود مزودين بعد. يمكنك إضافتها من داخل تفاصيل كل مناسبة.' : 'Aucun contrat de prestataire enregistré. Vous pouvez en ajouter depuis chaque célébration.' }}</p>
            </div>
          } @else {
            <div class="prov-table-wrap">
              <table class="prov-master-table">
                <thead>
                  <tr>
                    <th>{{ i18n.currentLang() === 'ar' ? 'المزود' : 'Prestataire' }}</th>
                    <th>{{ i18n.currentLang() === 'ar' ? 'الخدمة' : 'Service' }}</th>
                    <th>{{ i18n.currentLang() === 'ar' ? 'المناسبة' : 'Événement' }}</th>
                    <th>{{ i18n.t('diary.financial_agreed') }}</th>
                    <th>{{ i18n.t('diary.financial_deposit') }}</th>
                    <th>{{ i18n.t('diary.financial_remaining') }}</th>
                    <th>{{ i18n.currentLang() === 'ar' ? 'الهاتف' : 'Contact' }}</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of diaryService.providers(); track p.id) {
                    <tr>
                      <td><strong>{{ p.providerName }}</strong></td>
                      <td><span class="prov-svc-badge">{{ p.serviceTypeFr }}</span></td>
                      <td><span class="prov-ev-name">{{ getEventTitleForProvider(p.eventId) }}</span></td>
                      <td>{{ p.agreedPrice | number:'1.0-2' }} {{ i18n.currency() }}</td>
                      <td><span class="text-sage font-bold">{{ p.depositPaid | number:'1.0-2' }} {{ i18n.currency() }}</span></td>
                      <td><strong class="text-danger">{{ (p.agreedPrice - p.depositPaid) | number:'1.0-2' }} {{ i18n.currency() }}</strong></td>
                      <td>
                        @if (p.phone) {
                          <a [href]="'tel:' + p.phone" class="phone-link">📞 {{ p.phone }}</a>
                        } @else {
                          <span class="text-muted">--</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      }

      <!-- MODALS -->
      @if (activeEventForModal) {
        <app-event-detail-modal
          [event]="activeEventForModal"
          (close)="activeEventForModal = null"
          (addNoteRequested)="onAddNoteRequestedFromEvent($event)"
        ></app-event-detail-modal>
      }

      @if (showAddEventModal) {
        <app-add-event-modal
          [initialDate]="modalInitialDate"
          (save)="onSaveNewEvent($event)"
          (cancel)="showAddEventModal = false"
        ></app-add-event-modal>
      }

      @if (showNoteModal) {
        <app-note-modal
          [existingNote]="editingNote"
          [events]="diaryService.events()"
          [initialDate]="modalInitialDate"
          [initialEventId]="modalInitialEventId"
          (save)="onSaveNote($event)"
          (cancel)="showNoteModal = false; editingNote = undefined"
        ></app-note-modal>
      }

      @if (showTraditionsModal) {
        <app-traditions-modal
          (close)="showTraditionsModal = false"
          (applied)="onTraditionsApplied()"
        ></app-traditions-modal>
      }
    </div>
  `,
  styles: [`
    .diary-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;

      .page-eyebrow {
        font-size: 0.72rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--color-primary);
        font-weight: 700;
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
        font-size: 0.96rem;
      }

      .header-actions {
        display: flex;
        gap: 10px;
      }
    }

    /* Hero KPI Strip */
    .hero-kpi-strip {
      display: grid;
      grid-template-columns: 1.4fr 1.3fr 1.2fr 1fr;
      gap: 16px;
      padding: 18px 22px;
      background: linear-gradient(135deg, #FFFFFF 0%, var(--color-sand) 100%);

      @media (max-width: 1024px) {
        grid-template-columns: 1fr 1fr;
      }
      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .kpi-countdown-box {
      border-inline-end: 1px solid var(--color-border);
      padding-inline-end: 16px;

      @media (max-width: 640px) {
        border-inline-end: none;
        border-bottom: 1px solid var(--color-border);
        padding-bottom: 14px;
      }

      .countdown-inner {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .countdown-badge {
          font-size: 0.72rem;
          text-transform: uppercase;
          color: var(--color-primary);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .countdown-number {
          display: flex;
          align-items: baseline;
          gap: 6px;

          .digits {
            font-size: 2.4rem;
            font-weight: 800;
            color: var(--color-primary);
            font-family: var(--font-serif);
            line-height: 1;
          }

          small {
            font-size: 0.84rem;
            color: var(--color-text-muted);
            font-weight: 600;
          }
        }

        .countdown-target-date {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }
      }

      .countdown-setup-prompt {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 0.84rem;

        .prompt-icon { font-size: 1.8rem; }
        p { margin: 2px 0 0 0; color: var(--color-text-muted); font-size: 0.78rem; }
      }
    }

    .kpi-next-celebration {
      display: flex;
      flex-direction: column;
      gap: 6px;
      cursor: pointer;

      .kpi-sub-title {
        font-size: 0.72rem;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--color-text-muted);
        letter-spacing: 0.05em;
      }

      .next-ev-content {
        display: flex;
        align-items: center;
        gap: 10px;
        background: #FFFFFF;
        padding: 8px 12px;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        transition: transform 0.15s ease, box-shadow 0.15s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-xs);
        }

        .next-ev-icon { font-size: 1.6rem; }
        .next-ev-meta {
          flex: 1;
          display: flex;
          flex-direction: column;

          .next-ev-title { font-size: 0.95rem; color: var(--color-primary); }
          .next-ev-date { font-size: 0.76rem; color: var(--color-text-muted); }
        }
      }

      .next-ev-empty {
        font-size: 0.84rem;
        color: var(--color-text-muted);
        display: flex;
        align-items: center;
        gap: 8px;

        .btn-text {
          background: none;
          border: none;
          color: var(--color-primary);
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }

    .kpi-tasks-progress {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .kpi-sub-title {
          font-size: 0.72rem;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--color-text-muted);
        }
        .progress-pct {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--color-primary);
        }
      }

      .progress-track {
        height: 8px;
        background: #FFFFFF;
        border-radius: var(--radius-full);
        overflow: hidden;
        border: 1px solid var(--color-border-subtle);

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--color-terracotta), var(--color-primary));
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }
      }

      .tasks-mini-stats {
        display: flex;
        justify-content: space-between;
        font-size: 0.76rem;
        color: var(--color-text-muted);

        .badge-overdue {
          color: #C62828;
          font-weight: 700;
          background: #FFEBEE;
          padding: 1px 6px;
          border-radius: var(--radius-sm);
        }
      }
    }

    .kpi-finance-box {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .kpi-sub-title {
        font-size: 0.72rem;
        text-transform: uppercase;
        font-weight: 700;
        color: var(--color-text-muted);
      }

      .finance-vals {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.84rem;

        .fin-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          small { color: var(--color-text-muted); }
        }
      }
    }

    /* Sub Navigation Tabs */
    .diary-nav-tabs {
      display: flex;
      gap: 6px;
      border-bottom: 2px solid var(--color-border);
      overflow-x: auto;
      padding-bottom: 2px;

      .nav-tab-btn {
        padding: 10px 18px;
        background: none;
        border: none;
        border-bottom: 3px solid transparent;
        font-size: 0.92rem;
        font-weight: 700;
        color: var(--color-text-muted);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        white-space: nowrap;
        transition: all 0.15s ease;

        &:hover {
          color: var(--color-text-main);
        }

        &.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .badge-count {
          font-size: 0.72rem;
          background: var(--color-surface-subtle);
          padding: 1px 7px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
        }
      }
    }

    /* CALENDAR TOOLBAR */
    .calendar-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;

      .calendar-nav-group {
        display: flex;
        align-items: center;
        gap: 12px;

        .current-month-heading {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          margin: 0;
          color: var(--color-primary);
          min-width: 170px;
          text-align: center;
        }

        .today-btn {
          font-size: 0.8rem;
          font-weight: 700;
        }
      }

      .calendar-view-switcher {
        display: flex;
        background: var(--color-surface-subtle);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        padding: 3px;

        .view-pill {
          padding: 5px 14px;
          font-size: 0.82rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;

          &.active {
            background: #FFFFFF;
            color: var(--color-primary);
            box-shadow: var(--shadow-xs);
          }
        }
      }
    }

    /* MONTH GRID */
    .calendar-month-grid {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      overflow: hidden;

      .weekdays-row {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        background: var(--color-surface-subtle);
        border-bottom: 1px solid var(--color-border);

        .weekday-header-cell {
          padding: 10px 4px;
          text-align: center;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }
      }

      .days-cells-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);

        .day-cell {
          min-height: 90px;
          padding: 6px 8px;
          border-inline-end: 1px solid var(--color-border-subtle);
          border-bottom: 1px solid var(--color-border-subtle);
          background: #FFFFFF;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: background-color 0.15s;

          &:nth-child(7n) {
            border-inline-end: none;
          }

          &:hover {
            background: var(--color-surface-subtle);
          }

          &.not-current-month {
            background: #FAFAFA;
            opacity: 0.45;
          }

          &.is-today {
            background: rgba(113, 56, 72, 0.04);
            .day-number {
              background: var(--color-primary);
              color: #FFFFFF;
              border-radius: 50%;
              width: 22px;
              height: 22px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          &.is-selected {
            box-shadow: inset 0 0 0 2px var(--color-terracotta);
          }

          .day-cell-top {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .day-number {
              font-size: 0.84rem;
              font-weight: 700;
              color: var(--color-text-main);
            }

            .ev-counter-dot {
              width: 7px;
              height: 7px;
              border-radius: 50%;
            }
          }

          .day-cell-events {
            display: flex;
            flex-direction: column;
            gap: 3px;
            overflow: hidden;

            .cal-event-pill {
              font-size: 0.68rem;
              font-weight: 700;
              color: #FFFFFF;
              padding: 2px 6px;
              border-radius: 3px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              cursor: pointer;
            }

            .more-events-tag {
              font-size: 0.66rem;
              color: var(--color-text-muted);
              font-weight: 700;
            }

            .tasks-due-dot {
              font-size: 0.68rem;
              color: var(--color-success);
              font-weight: 700;
            }
          }
        }
      }
    }

    /* AGENDA VIEW */
    .agenda-view-list {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .agenda-item-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 16px;
        background: #FFFFFF;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        border-inline-start-width: 6px;
        border-inline-start-style: solid;
        cursor: pointer;
        transition: transform 0.15s, box-shadow 0.15s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .agenda-date-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 44px;
          background: var(--color-surface-subtle);
          padding: 6px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);

          .ag-day { font-size: 1.2rem; font-weight: 800; color: var(--color-primary); line-height: 1; }
          .ag-month { font-size: 0.72rem; color: var(--color-text-muted); }
        }

        .agenda-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;

          .ag-header-row {
            display: flex;
            align-items: center;
            gap: 8px;

            .ag-icon { font-size: 1.2rem; }
            .ag-title { font-size: 1rem; color: var(--color-text-main); margin: 0; }
            .ag-status {
              font-size: 0.68rem;
              text-transform: uppercase;
              padding: 1px 6px;
              border-radius: var(--radius-full);
              background: #E8F5E9;
              color: #2E7D32;
              font-weight: 700;
            }
          }

          .ag-meta-row {
            display: flex;
            gap: 12px;
            font-size: 0.78rem;
            color: var(--color-text-muted);
            flex-wrap: wrap;
          }
        }
      }
    }

    /* SELECTED DAY DRAWER */
    .selected-day-drawer {
      margin-top: 18px;
      padding: 16px;
      background: var(--color-sand);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);

      .drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        h3 { margin: 0; font-size: 1rem; color: var(--color-primary); font-family: var(--font-serif); }
      }

      .drawer-empty { font-size: 0.84rem; color: var(--color-text-muted); margin: 0; }

      .drawer-items-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .drawer-event-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 6px 10px;
          font-size: 0.84rem;
          cursor: pointer;
        }

        .drawer-task-row {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-sm);
          padding: 6px 10px;
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }
      }
    }

    /* TAB 2: OVERVIEW TASK COLUMNS */
    .tasks-columns-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;

      @media (max-width: 800px) {
        grid-template-columns: 1fr;
      }

      .task-col {
        display: flex;
        flex-direction: column;
        gap: 12px;

        &.has-overdue {
          border-color: #FFCDD2;
        }

        .col-header {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 10px;

          h3 { margin: 0; font-size: 1.05rem; flex: 1; }
          .col-tally {
            font-size: 0.76rem;
            font-weight: 700;
            background: var(--color-surface-subtle);
            padding: 2px 8px;
            border-radius: var(--radius-full);

            &.tally-danger {
              background: #FFEBEE;
              color: #C62828;
            }
          }
        }

        .col-empty {
          font-size: 0.84rem;
          color: var(--color-text-muted);
          text-align: center;
          padding: 20px 0;
        }

        .tasks-mini-list {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .mini-task-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            background: var(--color-surface-subtle);
            border: 1px solid var(--color-border-subtle);
            border-radius: var(--radius-md);

            &.is-overdue {
              background: #FFF8F8;
              border-color: #FFCDD2;
            }

            .mini-tick {
              width: 22px;
              height: 22px;
              border-radius: 50%;
              border: 1.5px solid var(--color-border);
              background: #FFFFFF;
              cursor: pointer;
              font-size: 0.76rem;
              color: transparent;

              &:hover {
                color: var(--color-success);
                border-color: var(--color-success);
              }
            }

            .mini-task-info {
              display: flex;
              flex-direction: column;
              font-size: 0.84rem;
              small { color: var(--color-text-muted); font-size: 0.72rem; }
            }
          }
        }
      }
    }

    /* TAB 3: TRADITIONS VIEW */
    .traditions-view-section {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .traditions-header-banner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-sand) 100%);
        padding: 20px 24px;
        flex-wrap: wrap;
        gap: 16px;

        .banner-eyebrow {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-primary);
          font-weight: 700;
        }

        h2 { margin: 4px 0; font-family: var(--font-serif); color: var(--color-burgundy); }
        p { margin: 0; color: var(--color-text-muted); font-size: 0.92rem; max-width: 600px; }
      }

      .regions-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;

        .region-card {
          display: flex;
          flex-direction: column;
          gap: 10px;

          .reg-card-top {
            display: flex;
            align-items: flex-start;
            gap: 10px;

            .reg-pin { font-size: 1.3rem; }
            .reg-titles {
              flex: 1;
              h4 { margin: 0; font-size: 1.05rem; color: var(--color-primary); }
              small { font-size: 0.74rem; color: var(--color-text-muted); }
            }
            .badge-status {
              font-size: 0.68rem;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: var(--radius-full);
              background: var(--color-surface-subtle);
              color: var(--color-text-muted);

              &.verified {
                background: #E8F5E9;
                color: #2E7D32;
              }
            }
          }

          .reg-summary-text {
            font-size: 0.84rem;
            color: var(--color-text-main);
            line-height: 1.5;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .reg-outfits-row {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;

            .mini-outfit-tag {
              font-size: 0.72rem;
              background: var(--color-surface-subtle);
              border: 1px solid var(--color-border-subtle);
              padding: 2px 7px;
              border-radius: var(--radius-sm);
              color: var(--color-text-muted);
            }
          }

          .apply-reg-btn {
            margin-top: auto;
            align-self: flex-start;
          }
        }
      }
    }

    /* TAB 4: NOTES */
    .notes-section {
      display: flex;
      flex-direction: column;
      gap: 16px;

      .notes-toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;

        .notes-search-input {
          padding: 8px 14px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          width: 280px;
          outline: none;
        }
      }

      .notes-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;

        .note-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: transform 0.15s;

          &.pinned {
            border-color: var(--color-primary);
            background: linear-gradient(135deg, #FFFFFF 0%, #FFF8F8 100%);
          }

          .note-header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .note-cat-tag {
              font-size: 0.72rem;
              text-transform: uppercase;
              font-weight: 700;
              color: var(--color-primary);
            }

            .pin-btn {
              background: none;
              border: none;
              cursor: pointer;
              font-size: 0.9rem;
              opacity: 0.5;

              &.pinned {
                opacity: 1;
              }
            }
          }

          .note-title {
            font-size: 1.05rem;
            color: var(--color-text-main);
            margin: 0;
            font-family: var(--font-serif);
          }

          .note-content-text {
            font-size: 0.86rem;
            color: var(--color-text-muted);
            line-height: 1.5;
            margin: 0;
            white-space: pre-line;
          }

          .note-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--color-border-subtle);
            padding-top: 8px;
            margin-top: auto;

            .note-date { font-size: 0.72rem; color: var(--color-text-muted); }

            .note-card-actions {
              display: flex;
              gap: 8px;

              .btn-text-edit {
                background: none; border: none; color: var(--color-primary); cursor: pointer; font-size: 0.76rem; font-weight: 600;
              }
              .btn-text-del {
                background: none; border: none; color: #C62828; cursor: pointer; font-size: 0.76rem;
              }
            }
          }
        }
      }
    }

    /* TAB 5: PROVIDERS VIEW */
    .providers-view-section {
      padding: 20px 24px;

      .prov-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 { margin: 0; font-family: var(--font-serif); color: var(--color-primary); }
        p { margin: 2px 0 0 0; color: var(--color-text-muted); font-size: 0.88rem; }
      }

      .prov-table-wrap {
        overflow-x: auto;

        .prov-master-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.88rem;

          th {
            text-align: start;
            padding: 10px 12px;
            background: var(--color-surface-subtle);
            border-bottom: 1px solid var(--color-border);
            font-size: 0.76rem;
            text-transform: uppercase;
            color: var(--color-text-muted);
          }

          td {
            padding: 12px;
            border-bottom: 1px solid var(--color-border-subtle);
          }

          .prov-svc-badge {
            background: var(--color-sand);
            padding: 2px 8px;
            border-radius: var(--radius-sm);
            font-size: 0.76rem;
          }

          .phone-link {
            color: var(--color-primary);
            text-decoration: underline;
          }
        }
      }
    }

    .empty-state {
      padding: 40px 20px;
      text-align: center;
      color: var(--color-text-muted);

      .empty-icon { font-size: 2.5rem; display: block; margin-bottom: 8px; }
      p { margin-bottom: 14px; }
    }

    .text-sage { color: #2E7D32; }
    .text-danger { color: #C62828; }
    .font-bold { font-weight: 700; }
  `]
})
export class WeddingDiaryComponent {
  diaryService = inject(WeddingDiaryService);
  i18n = inject(I18nService);
  toast = inject(ToastService);

  mainTab: 'calendar' | 'overview' | 'traditions' | 'notes' | 'providers' = 'calendar';
  calendarViewMode: 'month' | 'agenda' = 'month';

  // Calendar Date State
  currentCalendarDate = new Date();
  selectedDateString: string | null = null;
  selectedDateCell: CalendarDayCell | null = null;

  // Modals state
  activeEventForModal: WeddingEvent | null = null;
  showAddEventModal = false;
  modalInitialDate?: string;
  modalInitialEventId?: string;
  showNoteModal = false;
  editingNote?: DiaryNote;
  showTraditionsModal = false;

  // Notes Search Filter
  notesSearchQuery = '';

  // Weekday names
  get weekdayNames(): string[] {
    const lang = this.i18n.currentLang();
    if (lang === 'ar') {
      return ['الإثنين', 'الثلاثاء', 'الأربعاب', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
    }
    if (lang === 'en') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
    return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  }

  // Localized current month & year title
  get currentMonthLabel(): string {
    const locale = this.i18n.currentLang() === 'ar' ? 'ar-TN' : (this.i18n.currentLang() === 'en' ? 'en-US' : 'fr-FR');
    return this.currentCalendarDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }

  // Generate 42 calendar grid cells (6 weeks) with accurate leap year and month boundaries
  readonly calendarDays = computed<CalendarDayCell[]>(() => {
    const target = this.currentCalendarDate;
    const year = target.getFullYear();
    const month = target.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Weekday index of the 1st (0 = Sun, 1 = Mon, ..., 6 = Sat).
    // Convert to Monday-start (0 = Mon, 6 = Sun)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const cells: CalendarDayCell[] = [];
    const todayStr = new Date().toISOString().slice(0, 10);

    const allEvents = this.diaryService.events();
    const allTasks = this.diaryService.tasks();

    // 1. Fill leading days from previous month
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthLastDate - i);
      const dStr = this.formatDateIso(d);
      cells.push({
        date: d,
        dateString: dStr,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        events: allEvents.filter(e => e.date === dStr),
        tasks: allTasks.filter(t => t.dueDate === dStr)
      });
    }

    // 2. Fill current month days
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const d = new Date(year, month, day);
      const dStr = this.formatDateIso(d);
      cells.push({
        date: d,
        dateString: dStr,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
        events: allEvents.filter(e => e.date === dStr),
        tasks: allTasks.filter(t => t.dueDate === dStr)
      });
    }

    // 3. Fill trailing days up to 42 cells (6 full rows)
    let nextMonthDay = 1;
    while (cells.length < 42) {
      const d = new Date(year, month + 1, nextMonthDay++);
      const dStr = this.formatDateIso(d);
      cells.push({
        date: d,
        dateString: dStr,
        dayNumber: d.getDate(),
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        events: allEvents.filter(e => e.date === dStr),
        tasks: allTasks.filter(t => t.dueDate === dStr)
      });
    }

    return cells;
  });

  // Filtered notes by search query
  readonly filteredNotes = computed(() => {
    const q = this.notesSearchQuery.trim().toLowerCase();
    const notes = [...this.diaryService.notes()];
    return notes
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
      .filter(n => {
        if (!q) return true;
        return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
      });
  });

  // Calendar Navigation
  prevMonth(): void {
    const d = new Date(this.currentCalendarDate);
    d.setMonth(d.getMonth() - 1);
    this.currentCalendarDate = d;
  }

  nextMonth(): void {
    const d = new Date(this.currentCalendarDate);
    d.setMonth(d.getMonth() + 1);
    this.currentCalendarDate = d;
  }

  goToToday(): void {
    this.currentCalendarDate = new Date();
    const todayStr = new Date().toISOString().slice(0, 10);
    this.selectedDateString = todayStr;
    this.selectedDateCell = this.calendarDays().find(c => c.dateString === todayStr) || null;
  }

  onSelectDate(cell: CalendarDayCell): void {
    this.selectedDateString = cell.dateString;
    this.selectedDateCell = cell;
  }

  openEventDetail(ev: WeddingEvent): void {
    this.activeEventForModal = ev;
  }

  openAddEventModal(): void {
    this.modalInitialDate = this.selectedDateString || new Date().toISOString().slice(0, 10);
    this.showAddEventModal = true;
  }

  openAddEventOnDate(dateStr: string): void {
    this.modalInitialDate = dateStr;
    this.showAddEventModal = true;
  }

  onSaveNewEvent(eventData: any): void {
    this.diaryService.createEvent(eventData);
    this.showAddEventModal = false;
    this.toast.show(this.i18n.currentLang() === 'ar' ? 'تمت إضافة المناسبة بنجاح 🕊️' : 'Événement ajouté avec succès 🕊️');
  }

  openCreateNote(): void {
    this.editingNote = undefined;
    this.modalInitialDate = this.selectedDateString || undefined;
    this.modalInitialEventId = undefined;
    this.showNoteModal = true;
  }

  openEditNote(note: DiaryNote): void {
    this.editingNote = note;
    this.showNoteModal = true;
  }

  onAddNoteRequestedFromEvent(data: { eventId: string; date?: string }): void {
    this.editingNote = undefined;
    this.modalInitialEventId = data.eventId;
    this.modalInitialDate = data.date;
    this.showNoteModal = true;
  }

  onSaveNote(noteData: any): void {
    if (this.editingNote) {
      this.diaryService.updateNote(this.editingNote.id, noteData);
      this.toast.show(this.i18n.currentLang() === 'ar' ? 'تم تحديث المذكرة' : 'Note mise à jour');
    } else {
      this.diaryService.createNote(noteData);
      this.toast.show(this.i18n.currentLang() === 'ar' ? 'تم حفظ المذكرة ✍️' : 'Note enregistrée ✍️');
    }
    this.showNoteModal = false;
    this.editingNote = undefined;
  }

  openTraditionsModal(): void {
    this.showTraditionsModal = true;
  }

  onTraditionsApplied(): void {
    this.showTraditionsModal = false;
    this.mainTab = 'calendar';
  }

  getEventIcon(type: string): string {
    const def = EVENT_TEMPLATE_DEFINITIONS[type as WeddingEventType];
    return def ? def.icon : '📌';
  }

  getEventTitleForProvider(eventId: string): string {
    const ev = this.diaryService.events().find(e => e.id === eventId);
    return ev ? this.diaryService.getEventDisplayName(ev) : '--';
  }

  private formatDateIso(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
