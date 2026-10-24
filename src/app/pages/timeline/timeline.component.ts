import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TimelineService } from '../../services/timeline.service';
import { PreferencesService } from '../../services/preferences.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { TimelineStage, TimelineTask } from '../../models/timeline.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="timeline-page" [attr.dir]="i18n.dir()">
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-intro">
          <div class="timeline-eyebrow">
            <span>{{ i18n.currentLang() === 'ar' ? 'الجدول الزمني والتحضيرات' : 'PLANNING & ÉTAPES CLÉS' }}</span>
          </div>
          <h1 class="page-title">{{ i18n.currentLang() === 'ar' ? 'الجدول الزمني لجهاز العروس' : 'Rétro-planning du Trousseau' }}</h1>
          <p class="page-subtitle">
            {{ i18n.currentLang() === 'ar'
              ? 'مراحل مدروسة لتجهيز بيتكِ الجديد بكل هدوء خطوة بخطوة وتفادي ضغط اللحظات الأخيرة.'
              : 'Des étapes claires et bien pensées pour préparer votre futur foyer en toute sérénité, sans précipitation.' }}
          </p>
        </div>

        <div class="header-action-group">
          <button type="button" class="btn btn-secondary btn-sm" (click)="openAddTaskModal()">
            <span>+</span>
            <span>{{ i18n.currentLang() === 'ar' ? 'إضافة مهمة خاصة' : 'Ajouter une tâche' }}</span>
          </button>
        </div>
      </header>

      <!-- Countdown & Global Milestone Card -->
      <section class="countdown-hero-card card">
        <div class="countdown-info-side">
          <div class="countdown-badge">
            <span class="badge-dot"></span>
            <span>{{ i18n.t('app.culture_badge') }}</span>
          </div>

          <div class="countdown-main-text">
            @if (timelineService.countdownDays() !== null) {
              @if ((timelineService.countdownDays() ?? 0) > 0) {
                <div class="countdown-big-number">
                  <span class="num">{{ timelineService.countdownDays() }}</span>
                  <span class="unit">{{ i18n.currentLang() === 'ar' ? 'يوماً متبقياً' : 'jours restants' }}</span>
                </div>
                <p class="countdown-sub">
                  {{ i18n.currentLang() === 'ar'
                    ? 'حتى موعد الزفاف المبارك إن شاء الله (' + preferences.preferences().weddingDate + ')'
                    : 'Jusqu’au grand jour prévu le ' + preferences.preferences().weddingDate }}
                </p>
              } @else if ((timelineService.countdownDays() ?? 0) === 0) {
                <div class="countdown-big-number">
                  <span class="celebration-emblem">🕊️💍✨</span>
                  <span class="unit">{{ i18n.currentLang() === 'ar' ? 'اليوم الموعود ! ألف مبروك' : 'C’est le grand jour ! Félicitations' }}</span>
                </div>
              } @else {
                <div class="countdown-big-number">
                  <span class="num">🏡</span>
                  <span class="unit">{{ i18n.currentLang() === 'ar' ? 'مرحلة ما بعد الانتقال والترتيب' : 'Nouvelle vie installée' }}</span>
                </div>
              }
            } @else {
              <div class="countdown-big-number">
                <span class="unit">{{ i18n.currentLang() === 'ar' ? 'حددي تاريخ الزفاف' : 'Définissez votre date' }}</span>
              </div>
              <p class="countdown-sub">
                <a routerLink="/settings" class="text-link">
                  {{ i18n.currentLang() === 'ar' ? 'اضغطي هنا لإضافة موعد الزفاف لتفعيل العد التنازلي ←' : 'Ajoutez votre date dans les paramètres pour activer le décompte →' }}
                </a>
              </p>
            }
          </div>
        </div>

        <div class="countdown-progress-side">
          <div class="progress-arc-box">
            <div class="pct-val">{{ timelineService.progressPercentage() }}%</div>
            <div class="pct-label">{{ i18n.currentLang() === 'ar' ? 'المراحل المكتملة' : 'Étapes validées' }}</div>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" [style.width]="timelineService.progressPercentage() + '%'"></div>
          </div>
          <div class="progress-metrics-text">
            <span>{{ timelineService.completedTasksCount() }} / {{ timelineService.totalTasksCount() }} {{ i18n.currentLang() === 'ar' ? 'خطوة منجزة' : 'tâches complétées' }}</span>
          </div>
        </div>
      </section>

      <!-- Stage Filter Navigation Strip -->
      <section class="stage-nav-strip">
        <button
          type="button"
          class="stage-nav-pill"
          [class.active]="selectedStage() === 'all'"
          (click)="selectedStage.set('all')"
        >
          <span>{{ i18n.currentLang() === 'ar' ? 'كل المراحل' : 'Toutes les étapes' }}</span>
          <span class="stage-tally">({{ timelineService.totalTasksCount() }})</span>
        </button>

        @for (m of timelineService.milestones(); track m.stage) {
          <button
            type="button"
            class="stage-nav-pill"
            [class.active]="selectedStage() === m.stage"
            (click)="selectedStage.set(m.stage)"
          >
            <span class="stage-icon">{{ m.icon }}</span>
            <span>{{ timelineService.getMilestoneTimeframe(m) }}</span>
          </button>
        }
      </section>

      <!-- Milestones & Tasks Sections -->
      <section class="milestone-blocks-list">
        @for (milestone of filteredMilestones(); track milestone.stage) {
          <div class="milestone-card card">
            <header class="milestone-header">
              <div class="milestone-header-icon">{{ milestone.icon }}</div>
              <div class="milestone-header-titles">
                <span class="milestone-timeframe">{{ timelineService.getMilestoneTimeframe(milestone) }}</span>
                <h2 class="milestone-title">{{ timelineService.getMilestoneTitle(milestone) }}</h2>
              </div>
              <div class="milestone-status-badge">
                {{ getCompletedCountForStage(milestone.stage) }} / {{ getTasksForStage(milestone.stage).length }}
              </div>
            </header>

            <div class="tasks-checklist">
              @for (task of getTasksForStage(milestone.stage); track task.id) {
                <div class="task-row" [class.is-done]="task.isCompleted">
                  <button
                    type="button"
                    class="task-check-btn"
                    [class.checked]="task.isCompleted"
                    (click)="timelineService.toggleTask(task.id)"
                    [title]="task.isCompleted ? i18n.t('action.mark_unpurchased') : i18n.t('action.mark_purchased')"
                  >
                    @if (task.isCompleted) {
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    }
                  </button>

                  <div class="task-info-col" (click)="timelineService.toggleTask(task.id)">
                    <div class="task-title-line">
                      <span class="task-icon-inline">{{ task.categoryIcon }}</span>
                      <strong class="task-title">{{ timelineService.getTaskTitle(task) }}</strong>
                    </div>
                    @if (task.descriptionFr || task.descriptionAr) {
                      <p class="task-desc">{{ timelineService.getTaskDesc(task) }}</p>
                    }
                    @if (task.dueDate) {
                      <span class="task-due-date">📅 {{ task.dueDate }}</span>
                    }
                  </div>

                  @if (task.isCustom) {
                    <button
                      type="button"
                      class="delete-task-btn"
                      (click)="timelineService.deleteTask(task.id)"
                      [title]="i18n.t('action.delete')"
                    >
                      ✕
                    </button>
                  }
                </div>
              }
            </div>
          </div>
        }
      </section>

      <!-- Add Custom Task Modal -->
      @if (showAddModal()) {
        <div class="modal-overlay" (click)="closeAddModal()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ i18n.currentLang() === 'ar' ? 'إضافة مهمة في الجدول الزمني' : 'Ajouter une étape au planning' }}</h2>
              <button type="button" class="close-btn" (click)="closeAddModal()">✕</button>
            </div>

            <div class="modal-body-form">
              <div class="form-group mb-3">
                <label>{{ i18n.currentLang() === 'ar' ? 'المرحلة الزمنية' : 'Étape du rétro-planning' }}</label>
                <select [(ngModel)]="newTaskStage" class="input-custom">
                  @for (m of timelineService.milestones(); track m.stage) {
                    <option [value]="m.stage">
                      {{ m.icon }} {{ timelineService.getMilestoneTimeframe(m) }} — {{ timelineService.getMilestoneTitle(m) }}
                    </option>
                  }
                </select>
              </div>

              <div class="form-group mb-3">
                <label>{{ i18n.currentLang() === 'ar' ? 'عنوان المهمة' : 'Titre de la tâche' }} *</label>
                <input
                  type="text"
                  [(ngModel)]="newTaskTitle"
                  [placeholder]="i18n.currentLang() === 'ar' ? 'مثال: حجز مفرش الصالون، شراء الإضاءة...' : 'Ex: Commander les rideaux, comparer les réfrigérateurs...'"
                  class="input-custom"
                />
              </div>

              <div class="form-group mb-3">
                <label>{{ i18n.currentLang() === 'ar' ? 'ملاحظة أو تفاصيل' : 'Détails ou conseils' }}</label>
                <textarea
                  rows="2"
                  [(ngModel)]="newTaskDesc"
                  [placeholder]="i18n.currentLang() === 'ar' ? 'أي تفاصيل تودين تذكرها...' : 'Notes complémentaires...'"
                  class="input-custom"
                ></textarea>
              </div>

              <div class="form-group mb-4">
                <label>{{ i18n.currentLang() === 'ar' ? 'التاريخ المستهدف (اختياري)' : 'Date cible souhaitée (optionnelle)' }}</label>
                <input type="date" [(ngModel)]="newTaskDueDate" class="input-custom" />
              </div>

              <div class="modal-actions-row">
                <button type="button" class="btn btn-outline" (click)="closeAddModal()">
                  {{ i18n.t('action.cancel') }}
                </button>
                <button type="button" class="btn btn-primary" [disabled]="!newTaskTitle.trim()" (click)="saveCustomTask()">
                  {{ i18n.t('action.save') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .timeline-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .page-header {
      display: flex;
      flex-direction: column;
      gap: 16px;

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
      }
    }

    .timeline-eyebrow {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
      color: var(--color-primary);
      margin-bottom: 6px;
    }

    .page-title {
      font-family: var(--font-serif);
      font-size: 1.85rem;
      color: var(--color-text-main);
      margin-bottom: 6px;
    }

    .page-subtitle {
      font-size: 0.95rem;
      color: var(--color-text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    /* Countdown Hero Card */
    .countdown-hero-card {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-lg);
      padding: var(--space-lg) var(--space-xl);
      background: linear-gradient(135deg, #FFFFFF 0%, var(--color-bg-sand) 100%);
      border: 1px solid var(--color-border);

      @media (min-width: 820px) {
        grid-template-columns: 1.3fr 0.9fr;
        align-items: center;
      }
    }

    .countdown-info-side {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .countdown-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--color-primary);
        letter-spacing: 0.04em;

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-primary);
        }
      }

      .countdown-big-number {
        display: flex;
        align-items: baseline;
        gap: 12px;

        .num {
          font-family: var(--font-serif);
          font-size: 3rem;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1;
        }

        .unit {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-main);
        }

        .celebration-emblem {
          font-size: 2.2rem;
        }
      }

      .countdown-sub {
        font-size: 0.88rem;
        color: var(--color-text-muted);

        .text-link {
          color: var(--color-secondary);
          text-decoration: underline;
        }
      }
    }

    .countdown-progress-side {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: var(--radius-md);
      border: 1px solid rgba(232, 224, 216, 0.7);

      .progress-arc-box {
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .pct-val {
          font-family: var(--font-serif);
          font-size: 1.7rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .pct-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
      }

      .progress-bar-track {
        width: 100%;
        height: 8px;
        background: var(--color-bg-sand);
        border-radius: var(--radius-full);
        overflow: hidden;

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-secondary), var(--color-primary));
          border-radius: var(--radius-full);
          transition: width 0.4s ease;
        }
      }

      .progress-metrics-text {
        font-size: 0.78rem;
        color: var(--color-text-muted);
        text-align: end;
      }
    }

    /* Stage Navigation Strip */
    .stage-nav-strip {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .stage-nav-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-text-muted);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--color-primary);
        color: var(--color-text-main);
      }

      &.active {
        background: var(--color-primary);
        color: #FFFFFF;
        border-color: var(--color-primary);

        .stage-tally {
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .stage-tally {
        font-size: 0.75rem;
        color: var(--color-text-light);
      }
    }

    /* Milestone Cards List */
    .milestone-blocks-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .milestone-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .milestone-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 20px;
      background: var(--color-surface-subtle);
      border-bottom: 1px solid var(--color-border-subtle);

      .milestone-header-icon {
        font-size: 1.6rem;
      }

      .milestone-header-titles {
        flex: 1;

        .milestone-timeframe {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-primary);
        }

        .milestone-title {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--color-text-main);
          margin: 0;
        }
      }

      .milestone-status-badge {
        font-size: 0.78rem;
        font-weight: 700;
        background: var(--color-surface);
        padding: 4px 10px;
        border-radius: var(--radius-full);
        border: 1px solid var(--color-border);
        color: var(--color-text-muted);
      }
    }

    .tasks-checklist {
      display: flex;
      flex-direction: column;
    }

    .task-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border-subtle);
      transition: background 0.2s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: var(--color-surface-hover);
      }

      &.is-done {
        .task-title {
          text-decoration: line-through;
          color: var(--color-text-light);
        }

        .task-desc {
          opacity: 0.6;
        }
      }
    }

    .task-check-btn {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid var(--color-border-strong);
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      cursor: pointer;
      flex-shrink: 0;
      margin-top: 2px;
      transition: all 0.2s ease;

      &.checked {
        background: var(--color-success);
        border-color: var(--color-success);
      }

      &:hover:not(.checked) {
        border-color: var(--color-primary);
        background: var(--color-primary-light);
      }
    }

    .task-info-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      cursor: pointer;

      .task-title-line {
        display: flex;
        align-items: center;
        gap: 8px;

        .task-icon-inline {
          font-size: 1rem;
        }

        .task-title {
          font-size: 0.98rem;
          color: var(--color-text-main);
        }
      }

      .task-desc {
        font-size: 0.85rem;
        color: var(--color-text-muted);
        line-height: 1.5;
        margin: 0;
      }

      .task-due-date {
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-secondary);
        margin-top: 2px;
      }
    }

    .delete-task-btn {
      background: none;
      border: none;
      color: var(--color-text-light);
      font-size: 1rem;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: var(--radius-sm);

      &:hover {
        color: var(--color-danger);
        background: var(--color-danger-bg);
      }
    }

    /* Modal Styling */
    .input-custom {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      font-family: inherit;
      font-size: 0.95rem;
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(113, 59, 72, 0.12);
      }
    }

    .modal-actions-row {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }
  `]
})
export class TimelineComponent {
  timelineService = inject(TimelineService);
  preferences = inject(PreferencesService);
  i18n = inject(I18nService);
  toast = inject(ToastService);

  selectedStage = signal<'all' | TimelineStage>('all');
  showAddModal = signal(false);

  newTaskStage: TimelineStage = 'phase_6m';
  newTaskTitle = '';
  newTaskDesc = '';
  newTaskDueDate = '';

  filteredMilestones = computed(() => {
    const stage = this.selectedStage();
    const all = this.timelineService.milestones();
    if (stage === 'all') return all;
    return all.filter(m => m.stage === stage);
  });

  getTasksForStage(stage: TimelineStage): TimelineTask[] {
    return this.timelineService.getTasksByStage(stage);
  }

  getCompletedCountForStage(stage: TimelineStage): number {
    return this.getTasksForStage(stage).filter(t => t.isCompleted).length;
  }

  openAddTaskModal(): void {
    this.newTaskStage = this.selectedStage() === 'all' ? 'phase_6m' : this.selectedStage() as TimelineStage;
    this.newTaskTitle = '';
    this.newTaskDesc = '';
    this.newTaskDueDate = '';
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  saveCustomTask(): void {
    if (this.newTaskTitle.trim()) {
      this.timelineService.addTask({
        stage: this.newTaskStage,
        title: this.newTaskTitle.trim(),
        description: this.newTaskDesc.trim(),
        dueDate: this.newTaskDueDate || undefined
      });
      this.toast.show(
        this.i18n.currentLang() === 'ar' ? 'تمت إضافة المهمة إلى الجدول بنجاح 📌' : 'Étape ajoutée avec succès au planning 📌'
      );
      this.closeAddModal();
    }
  }
}
