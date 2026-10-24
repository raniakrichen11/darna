import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { TimelineTask, TimelineMilestone, TIMELINE_MILESTONES, INITIAL_TIMELINE_TASKS, TimelineStage } from '../models/timeline.model';
import { StorageService } from './storage.service';
import { PreferencesService } from './preferences.service';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  private readonly STORAGE_KEY = 'darna_timeline_tasks';
  private storage = inject(StorageService);
  private preferences = inject(PreferencesService);
  private i18n = inject(I18nService);

  readonly tasks = signal<TimelineTask[]>(this.loadTasks());
  readonly milestones = signal<TimelineMilestone[]>(TIMELINE_MILESTONES);

  constructor() {
    effect(() => {
      this.storage.setItem(this.STORAGE_KEY, this.tasks());
    });
  }

  private loadTasks(): TimelineTask[] {
    const saved = this.storage.getItem<TimelineTask[]>(this.STORAGE_KEY, []);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return INITIAL_TIMELINE_TASKS;
  }

  // Toggle task completed
  toggleTask(taskId: string): void {
    this.tasks.update(list =>
      list.map(t => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  }

  // Add custom task
  addTask(params: {
    stage: TimelineStage;
    title: string;
    description?: string;
    categoryIcon?: string;
    dueDate?: string;
  }): TimelineTask {
    const lang = this.i18n.currentLang();
    const newTask: TimelineTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      stage: params.stage,
      titleFr: lang === 'fr' ? params.title : params.title,
      titleAr: lang === 'ar' ? params.title : params.title,
      titleEn: lang === 'en' ? params.title : params.title,
      descriptionFr: params.description || '',
      descriptionAr: params.description || '',
      descriptionEn: params.description || '',
      categoryIcon: params.categoryIcon || '📌',
      isCompleted: false,
      dueDate: params.dueDate,
      isCustom: true
    };
    this.tasks.update(list => [...list, newTask]);
    return newTask;
  }

  // Delete task
  deleteTask(taskId: string): void {
    this.tasks.update(list => list.filter(t => t.id !== taskId));
  }

  // Reset to default roadmap
  resetToDefault(): void {
    this.tasks.set(INITIAL_TIMELINE_TASKS);
  }

  // Filter tasks by stage
  getTasksByStage(stage: TimelineStage): TimelineTask[] {
    return this.tasks().filter(t => t.stage === stage);
  }

  // Computed signals
  readonly totalTasksCount = computed(() => this.tasks().length);
  readonly completedTasksCount = computed(() => this.tasks().filter(t => t.isCompleted).length);
  readonly progressPercentage = computed(() => {
    const total = this.totalTasksCount();
    if (total === 0) return 0;
    return Math.round((this.completedTasksCount() / total) * 100);
  });

  // Countdown computation based on wedding / move-in date
  readonly countdownDays = computed<number | null>(() => {
    const dateStr = this.preferences.preferences().weddingDate;
    if (!dateStr) return null;
    const target = new Date(dateStr).getTime();
    if (isNaN(target)) return null;
    const now = new Date().setHours(0, 0, 0, 0);
    const diffTime = target - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });

  getMilestoneTitle(m: TimelineMilestone): string {
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return m.titleAr;
    if (lang === 'en') return m.titleEn || m.titleFr;
    return m.titleFr;
  }

  getMilestoneTimeframe(m: TimelineMilestone): string {
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return m.timeframeAr;
    if (lang === 'en') return m.timeframeEn || m.timeframeFr;
    return m.timeframeFr;
  }

  getTaskTitle(t: TimelineTask): string {
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return t.titleAr || t.titleFr;
    if (lang === 'en') return t.titleEn || t.titleFr;
    return t.titleFr;
  }

  getTaskDesc(t: TimelineTask): string {
    const lang = this.i18n.currentLang();
    if (lang === 'ar') return t.descriptionAr || t.descriptionFr;
    if (lang === 'en') return t.descriptionEn || t.descriptionFr;
    return t.descriptionFr;
  }
}
