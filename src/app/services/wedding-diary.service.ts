import { Injectable, signal, computed, effect, inject } from '@angular/core';
import {
  WeddingEvent,
  WeddingTask,
  DiaryNote,
  EventProvider,
  WeddingProfile,
  WeddingEventType,
  TaskPriority,
  TaskAssigneeRole,
  TaskStatus,
  EVENT_TEMPLATE_DEFINITIONS,
  TUNISIAN_REGIONAL_TRADITIONS,
  RegionalTraditionRecord
} from '../models/wedding-diary.model';
import { StorageService } from './storage.service';
import { ShoppingListService } from './shopping-list.service';
import { PreferencesService } from './preferences.service';
import { I18nService } from './i18n.service';

@Injectable({
  providedIn: 'root'
})
export class WeddingDiaryService {
  private readonly STORAGE_EVENTS_KEY = 'darna_diary_events';
  private readonly STORAGE_TASKS_KEY = 'darna_diary_tasks';
  private readonly STORAGE_NOTES_KEY = 'darna_diary_notes';
  private readonly STORAGE_PROVIDERS_KEY = 'darna_diary_providers';
  private readonly STORAGE_PROFILE_KEY = 'darna_diary_profile';

  private storage = inject(StorageService);
  private shoppingList = inject(ShoppingListService);
  private preferences = inject(PreferencesService);
  private i18n = inject(I18nService);

  readonly events = signal<WeddingEvent[]>(this.loadInitialEvents());
  readonly tasks = signal<WeddingTask[]>(this.loadInitialTasks());
  readonly notes = signal<DiaryNote[]>(this.loadInitialNotes());
  readonly providers = signal<EventProvider[]>(this.loadInitialProviders());
  readonly profile = signal<WeddingProfile>(this.loadInitialProfile());

  // Regional traditions catalog
  readonly regionalTraditions = signal<RegionalTraditionRecord[]>(TUNISIAN_REGIONAL_TRADITIONS);

  constructor() {
    // Persist automatically on signal updates
    effect(() => {
      this.storage.setItem(this.STORAGE_EVENTS_KEY, this.events());
    });
    effect(() => {
      this.storage.setItem(this.STORAGE_TASKS_KEY, this.tasks());
    });
    effect(() => {
      this.storage.setItem(this.STORAGE_NOTES_KEY, this.notes());
    });
    effect(() => {
      this.storage.setItem(this.STORAGE_PROVIDERS_KEY, this.providers());
    });
    effect(() => {
      this.storage.setItem(this.STORAGE_PROFILE_KEY, this.profile());
    });
  }

  // --- Initial Loaders with Authentic Starters ---
  private loadInitialEvents(): WeddingEvent[] {
    const saved = this.storage.getItem<WeddingEvent[]>(this.STORAGE_EVENTS_KEY, []);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return this.createDefaultEvents();
  }

  private loadInitialTasks(): WeddingTask[] {
    const saved = this.storage.getItem<WeddingTask[]>(this.STORAGE_TASKS_KEY, []);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return this.createDefaultTasks();
  }

  private loadInitialNotes(): DiaryNote[] {
    const saved = this.storage.getItem<DiaryNote[]>(this.STORAGE_NOTES_KEY, []);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    return this.createDefaultNotes();
  }

  private loadInitialProviders(): EventProvider[] {
    const saved = this.storage.getItem<EventProvider[]>(this.STORAGE_PROVIDERS_KEY, []);
    if (saved && Array.isArray(saved)) {
      return saved;
    }
    return [];
  }

  private loadInitialProfile(): WeddingProfile {
    const saved = this.storage.getItem<WeddingProfile>(this.STORAGE_PROFILE_KEY, {});
    const basePrefs = this.preferences.preferences();
    return {
      brideName: saved.brideName || basePrefs.brideName || '',
      groomName: saved.groomName || basePrefs.groomName || '',
      weddingDate: saved.weddingDate || basePrefs.weddingDate || '',
      selectedRegion: saved.selectedRegion || 'tunis',
      celebrationStyle: saved.celebrationStyle || 'traditional',
      durationDays: saved.durationDays || 3,
      overallEventBudget: saved.overallEventBudget || basePrefs.totalBudget || 15000,
      preferredLanguage: saved.preferredLanguage || basePrefs.language || 'fr'
    };
  }

  // Generate realistic default starter events based on user weddingDate (or approx 3 months out)
  private createDefaultEvents(): WeddingEvent[] {
    const baseDate = this.preferences.preferences().weddingDate || this.getFutureDateString(90);
    const dateObj = new Date(baseDate);

    const eventTypes: WeddingEventType[] = ['hammam', 'henna', 'outia', 'reception_3ers'];
    const result: WeddingEvent[] = [];

    for (const type of eventTypes) {
      const def = EVENT_TEMPLATE_DEFINITIONS[type];
      const evDate = new Date(dateObj);
      evDate.setDate(evDate.getDate() + def.defaultOffsetDays);
      const dateStr = evDate.toISOString().slice(0, 10);

      result.push({
        id: 'event_' + type + '_' + Date.now(),
        eventType: type,
        titleFr: def.titleFr,
        titleAr: def.titleAr,
        titleEn: def.titleEn,
        date: dateStr,
        startTime: type === 'reception_3ers' ? '19:00' : (type === 'hammam' ? '14:00' : '18:00'),
        endTime: type === 'reception_3ers' ? '02:00' : (type === 'hammam' ? '18:00' : '23:00'),
        location: type === 'reception_3ers' ? 'Salle des fêtes / Espace de réception' : 'Maison familiale / Hammam traditionnel',
        status: 'planned',
        priority: 'essential',
        color: def.color,
        budgetLimit: type === 'reception_3ers' ? 8000 : (type === 'outia' ? 2500 : 800),
        notes: '',
        linkedShoppingItemIds: [],
        createdAt: Date.now()
      });
    }
    return result;
  }

  private createDefaultTasks(): WeddingTask[] {
    const now = Date.now();
    return [
      {
        id: 'task_starter_1',
        titleFr: 'Confirmer la date définitive du mariage et des célébrations',
        titleAr: 'تأكيد الموعد النهائي للزفاف والاحتفالات التقليدية',
        titleEn: 'Confirm final date for wedding & celebrations',
        dueDate: this.getFutureDateString(7),
        priority: 'essential',
        status: 'completed',
        assigneeRole: 'bride',
        createdAt: now,
        completedAt: now
      },
      {
        id: 'task_starter_2',
        titleFr: 'Visiter et comparer 3 salles de réception ou espaces',
        titleAr: 'زيارة ومقارنة 3 قاعات أفراح أو فضاءات زفاف',
        titleEn: 'Visit and compare 3 wedding venues',
        dueDate: this.getFutureDateString(14),
        priority: 'essential',
        status: 'todo',
        assigneeRole: 'groom',
        createdAt: now
      },
      {
        id: 'task_starter_3',
        titleFr: 'Contacter la Ziyena / Machta pour les tenues traditionnelles d’Outia',
        titleAr: 'الاتصال بالزيانة أو الماشطة لحجز أزياء الوطية والجلوة',
        titleEn: 'Book Ziyena/Machta for traditional Outia outfits',
        dueDate: this.getFutureDateString(21),
        priority: 'essential',
        status: 'todo',
        assigneeRole: 'bride',
        createdAt: now
      },
      {
        id: 'task_starter_4',
        titleFr: 'Commander les dragées et coffrets de pâtisseries tunisiennes',
        titleAr: 'حجز علب الملبس والحلويات التونسية للضيافة',
        titleEn: 'Order dragées & traditional Tunisian sweets boxes',
        dueDate: this.getFutureDateString(35),
        priority: 'useful',
        status: 'todo',
        assigneeRole: 'mother',
        createdAt: now
      }
    ];
  }

  private createDefaultNotes(): DiaryNote[] {
    const now = Date.now();
    return [
      {
        id: 'note_1',
        title: 'Inspirations pour ma tenue d’Outia 👑',
        content: 'J’aimerais beaucoup porter une Fouta w Blouza en fil d’or écru avec des touches de bordeaux, ou une Keswa Mahdaouia royale avec le grand voile brodé. Demander à maman pour les parures d’ambre et d’or traditionnelles.',
        category: 'inspiration',
        isPinned: true,
        associatedDate: this.getFutureDateString(30),
        tags: ['Outia', 'Keswa', 'Tradition'],
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'note_2',
        title: 'Questions pour le photographe & caméraman 📸',
        content: '1. Nombre de photos retouchées incluses dans le forfait ?\n2. Teaser vidéo de 3 minutes pour Instagram/famille ?\n3. Présence dès la préparation de la mariée l’après-midi ?\n4. Modalités de paiement (acompte + solde le soir-même).',
        category: 'meeting',
        isPinned: false,
        associatedDate: this.getFutureDateString(15),
        tags: ['Photographe', 'Prestataire', 'Jour J'],
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  // --- Computed Analytics & Indicators ---

  readonly weddingDate = computed(() => {
    return this.profile().weddingDate || this.preferences.preferences().weddingDate || '';
  });

  readonly daysUntilWedding = computed(() => {
    const target = this.weddingDate();
    if (!target) return null;
    const diff = new Date(target).getTime() - new Date().setHours(0, 0, 0, 0);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  });

  // Sorted list of upcoming events
  readonly upcomingEvents = computed(() => {
    const list = [...this.events()];
    return list.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  });

  // Next imminent celebration
  readonly nextUpcomingEvent = computed<WeddingEvent | null>(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const upcoming = this.upcomingEvents().filter(e => e.date >= todayStr && e.status !== 'completed' && e.status !== 'cancelled');
    return upcoming.length > 0 ? upcoming[0] : null;
  });

  // Tasks due today
  readonly tasksToday = computed(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return this.tasks().filter(t => t.dueDate === todayStr && t.status === 'todo');
  });

  // Tasks due in the next 7 days (excluding today)
  readonly tasksDueSoon = computed(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().slice(0, 10);

    return this.tasks().filter(t =>
      t.dueDate &&
      t.dueDate > todayStr &&
      t.dueDate <= nextWeekStr &&
      t.status === 'todo'
    );
  });

  // Overdue tasks
  readonly tasksOverdue = computed(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return this.tasks().filter(t =>
      t.dueDate &&
      t.dueDate < todayStr &&
      t.status === 'todo'
    );
  });

  readonly completedTasksCount = computed(() => {
    return this.tasks().filter(t => t.status === 'completed').length;
  });

  readonly totalTasksCount = computed(() => {
    return this.tasks().length;
  });

  readonly taskCompletionPercentage = computed(() => {
    const total = this.totalTasksCount();
    if (total === 0) return 0;
    return Math.round((this.completedTasksCount() / total) * 100);
  });

  // Bookings pending confirmation
  readonly pendingBookingsCount = computed(() => {
    return this.providers().filter(p => p.bookingStatus === 'contacted' || p.bookingStatus === 'booked').length;
  });

  // Financial summary: combines event budget limits, provider contracts, and linked shopping list items
  readonly financialSummary = computed(() => {
    const providersList = this.providers();
    const shoppingItems = this.shoppingList.items();

    let totalAgreedProviders = 0;
    let totalDepositsPaid = 0;
    let totalRemainingProviders = 0;

    for (const p of providersList) {
      totalAgreedProviders += p.agreedPrice || 0;
      totalDepositsPaid += p.depositPaid || 0;
      totalRemainingProviders += Math.max(0, (p.agreedPrice || 0) - (p.depositPaid || 0));
    }

    // Linked shopping items costs
    const linkedItemIds = new Set<string>();
    for (const ev of this.events()) {
      if (ev.linkedShoppingItemIds) {
        for (const id of ev.linkedShoppingItemIds) {
          linkedItemIds.add(id);
        }
      }
    }

    let linkedShoppingEst = 0;
    let linkedShoppingAct = 0;

    for (const item of shoppingItems) {
      if (linkedItemIds.has(item.id)) {
        linkedShoppingEst += (item.estimatedUnitPrice || 0) * (item.quantity || 1);
        if (item.isPurchased && item.actualUnitPrice) {
          linkedShoppingAct += item.actualUnitPrice * (item.quantity || 1);
        }
      }
    }

    const totalEstimatedExpenses = totalAgreedProviders + linkedShoppingEst;
    const totalActualSpent = totalDepositsPaid + linkedShoppingAct;
    const overallBudget = this.profile().overallEventBudget || 15000;
    const remainingBudget = overallBudget - totalActualSpent;

    return {
      overallBudget,
      totalEstimatedExpenses,
      totalActualSpent,
      remainingBudget,
      totalAgreedProviders,
      totalDepositsPaid,
      totalRemainingProviders,
      linkedShoppingEst,
      linkedShoppingAct
    };
  });

  // --- Event CRUD Operations ---

  createEvent(params: {
    eventType: WeddingEventType;
    title: string;
    date: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    color?: string;
    priority?: TaskPriority;
    budgetLimit?: number;
    notes?: string;
    customTraditionName?: string;
  }): WeddingEvent {
    const lang = this.i18n.currentLang();
    const def = EVENT_TEMPLATE_DEFINITIONS[params.eventType] || EVENT_TEMPLATE_DEFINITIONS.custom;

    const newEvent: WeddingEvent = {
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      eventType: params.eventType,
      customTraditionName: params.customTraditionName,
      titleFr: lang === 'fr' ? params.title : def.titleFr,
      titleAr: lang === 'ar' ? params.title : def.titleAr,
      titleEn: lang === 'en' ? params.title : def.titleEn,
      date: params.date,
      startTime: params.startTime || '18:00',
      endTime: params.endTime || '23:00',
      location: params.location || '',
      status: 'planned',
      priority: params.priority || 'essential',
      color: params.color || def.color,
      budgetLimit: params.budgetLimit,
      notes: params.notes || '',
      linkedShoppingItemIds: [],
      createdAt: Date.now()
    };

    // Auto-generate suggested template tasks if available
    const templateTasks = lang === 'ar' ? def.defaultTasksAr : def.defaultTasksFr;
    const evDateObj = new Date(params.date);

    const generatedTasks: WeddingTask[] = templateTasks.map((t, idx) => {
      const taskDate = new Date(evDateObj);
      if (t.offsetDays !== undefined) {
        taskDate.setDate(taskDate.getDate() + t.offsetDays);
      }
      return {
        id: 'task_' + Date.now() + '_' + idx,
        eventId: newEvent.id,
        titleFr: t.title,
        titleAr: t.title,
        titleEn: t.title,
        dueDate: taskDate.toISOString().slice(0, 10),
        priority: t.priority,
        status: 'todo',
        assigneeRole: t.assigneeRole,
        isCustom: false,
        createdAt: Date.now()
      };
    });

    this.events.update(list => [...list, newEvent]);
    if (generatedTasks.length > 0) {
      this.tasks.update(taskList => [...taskList, ...generatedTasks]);
    }
    return newEvent;
  }

  updateEvent(eventId: string, updates: Partial<WeddingEvent>): void {
    this.events.update(list =>
      list.map(e => (e.id === eventId ? { ...e, ...updates, updatedAt: Date.now() } : e))
    );
  }

  deleteEvent(eventId: string): void {
    // Delete event and clean up tasks and providers assigned to it
    this.events.update(list => list.filter(e => e.id !== eventId));
    this.tasks.update(list => list.filter(t => t.eventId !== eventId));
    this.providers.update(list => list.filter(p => p.eventId !== eventId));
  }

  // --- Task CRUD Operations ---

  createTask(params: {
    eventId?: string;
    title: string;
    dueDate?: string;
    dueTime?: string;
    priority?: TaskPriority;
    assigneeRole?: TaskAssigneeRole;
    assigneeName?: string;
    linkedShoppingItemId?: string;
  }): WeddingTask {
    const lang = this.i18n.currentLang();
    const newTask: WeddingTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      eventId: params.eventId,
      titleFr: params.title,
      titleAr: params.title,
      titleEn: params.title,
      dueDate: params.dueDate,
      dueTime: params.dueTime,
      priority: params.priority || 'essential',
      status: 'todo',
      assigneeRole: params.assigneeRole || 'bride',
      assigneeName: params.assigneeName,
      linkedShoppingItemId: params.linkedShoppingItemId,
      isCustom: true,
      createdAt: Date.now()
    };
    this.tasks.update(list => [newTask, ...list]);
    return newTask;
  }

  updateTask(taskId: string, updates: Partial<WeddingTask>): void {
    this.tasks.update(list =>
      list.map(t => (t.id === taskId ? { ...t, ...updates, updatedAt: Date.now() } : t))
    );
  }

  toggleTask(taskId: string): void {
    this.tasks.update(list =>
      list.map(t => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? Date.now() : undefined,
            updatedAt: Date.now()
          };
        }
        return t;
      })
    );
  }

  deleteTask(taskId: string): void {
    this.tasks.update(list => list.filter(t => t.id !== taskId));
  }

  // --- Note CRUD Operations ---

  createNote(params: {
    title: string;
    content: string;
    category?: 'inspiration' | 'meeting' | 'agreement' | 'logistics' | 'beauty' | 'reminders' | 'general';
    associatedDate?: string;
    eventId?: string;
    isPinned?: boolean;
    tags?: string[];
  }): DiaryNote {
    const newNote: DiaryNote = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: params.title,
      content: params.content,
      category: params.category || 'general',
      associatedDate: params.associatedDate,
      eventId: params.eventId,
      isPinned: params.isPinned || false,
      tags: params.tags || [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.notes.update(list => [newNote, ...list]);
    return newNote;
  }

  updateNote(noteId: string, updates: Partial<DiaryNote>): void {
    this.notes.update(list =>
      list.map(n => (n.id === noteId ? { ...n, ...updates, updatedAt: Date.now() } : n))
    );
  }

  togglePinNote(noteId: string): void {
    this.notes.update(list =>
      list.map(n => (n.id === noteId ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() } : n))
    );
  }

  deleteNote(noteId: string): void {
    this.notes.update(list => list.filter(n => n.id !== noteId));
  }

  // --- Provider CRUD Operations ---

  createProvider(params: {
    eventId: string;
    providerName: string;
    serviceType: string;
    contactPerson?: string;
    phone?: string;
    agreedPrice: number;
    depositPaid?: number;
    dueDate?: string;
    notes?: string;
  }): EventProvider {
    const agreed = Number(params.agreedPrice) || 0;
    const deposit = Number(params.depositPaid) || 0;
    const newProvider: EventProvider = {
      id: 'prov_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      eventId: params.eventId,
      providerName: params.providerName,
      serviceTypeFr: params.serviceType,
      serviceTypeAr: params.serviceType,
      serviceTypeEn: params.serviceType,
      contactPerson: params.contactPerson,
      phone: params.phone,
      bookingStatus: deposit > 0 ? 'confirmed' : 'booked',
      agreedPrice: agreed,
      depositPaid: deposit,
      remainingAmount: Math.max(0, agreed - deposit),
      dueDate: params.dueDate,
      notes: params.notes,
      createdAt: Date.now()
    };
    this.providers.update(list => [...list, newProvider]);
    return newProvider;
  }

  updateProvider(providerId: string, updates: Partial<EventProvider>): void {
    this.providers.update(list =>
      list.map(p => {
        if (p.id === providerId) {
          const merged = { ...p, ...updates };
          merged.remainingAmount = Math.max(0, (merged.agreedPrice || 0) - (merged.depositPaid || 0));
          return merged;
        }
        return p;
      })
    );
  }

  deleteProvider(providerId: string): void {
    this.providers.update(list => list.filter(p => p.id !== providerId));
  }

  // --- Shopping List Integration ---

  linkShoppingItemToEvent(eventId: string, itemId: string): void {
    this.events.update(list =>
      list.map(e => {
        if (e.id === eventId) {
          const currentIds = e.linkedShoppingItemIds || [];
          if (!currentIds.includes(itemId)) {
            return { ...e, linkedShoppingItemIds: [...currentIds, itemId] };
          }
        }
        return e;
      })
    );
  }

  unlinkShoppingItemFromEvent(eventId: string, itemId: string): void {
    this.events.update(list =>
      list.map(e => {
        if (e.id === eventId && e.linkedShoppingItemIds) {
          return {
            ...e,
            linkedShoppingItemIds: e.linkedShoppingItemIds.filter(id => id !== itemId)
          };
        }
        return e;
      })
    );
  }

  getEventFinancialSummary(eventId: string) {
    const event = this.events().find(e => e.id === eventId);
    if (!event) {
      return { agreedTotal: 0, depositPaid: 0, remainingDue: 0, shoppingEst: 0, shoppingAct: 0, grandTotal: 0 };
    }

    const eventProviders = this.providers().filter(p => p.eventId === eventId);
    let agreedTotal = 0;
    let depositPaid = 0;

    for (const p of eventProviders) {
      agreedTotal += p.agreedPrice || 0;
      depositPaid += p.depositPaid || 0;
    }
    const remainingDue = Math.max(0, agreedTotal - depositPaid);

    // Shopping items
    let shoppingEst = 0;
    let shoppingAct = 0;
    const shoppingItems = this.shoppingList.items();

    if (event.linkedShoppingItemIds && event.linkedShoppingItemIds.length > 0) {
      for (const id of event.linkedShoppingItemIds) {
        const item = shoppingItems.find(it => it.id === id);
        if (item) {
          shoppingEst += (item.estimatedUnitPrice || 0) * (item.quantity || 1);
          if (item.isPurchased && item.actualUnitPrice) {
            shoppingAct += item.actualUnitPrice * (item.quantity || 1);
          }
        }
      }
    }

    return {
      agreedTotal,
      depositPaid,
      remainingDue,
      shoppingEst,
      shoppingAct,
      grandTotal: agreedTotal + shoppingEst,
      actualSpent: depositPaid + shoppingAct
    };
  }

  // --- Regional Traditions Application ---

  applyRegionalTradition(regionId: string, weddingDate: string, selectedTypes: WeddingEventType[]): void {
    const region = this.regionalTraditions().find(r => r.regionId === regionId);
    if (!region) return;

    this.profile.update(p => ({
      ...p,
      selectedRegion: regionId,
      weddingDate
    }));
    this.preferences.updatePreferences({ weddingDate });

    const dateObj = new Date(weddingDate);

    // Filter out existing events with same type to avoid clashing
    const existingTypes = new Set(this.events().map(e => e.eventType));
    const newEvents: WeddingEvent[] = [];

    for (const type of selectedTypes) {
      if (existingTypes.has(type)) {
        continue;
      }
      const def = EVENT_TEMPLATE_DEFINITIONS[type] || EVENT_TEMPLATE_DEFINITIONS.custom;
      const evDate = new Date(dateObj);
      evDate.setDate(evDate.getDate() + def.defaultOffsetDays);
      const dateStr = evDate.toISOString().slice(0, 10);

      newEvents.push({
        id: 'event_' + type + '_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
        eventType: type,
        titleFr: def.titleFr,
        titleAr: def.titleAr,
        titleEn: def.titleEn,
        date: dateStr,
        startTime: type === 'reception_3ers' ? '19:00' : (type === 'hammam' ? '14:00' : '18:00'),
        endTime: type === 'reception_3ers' ? '02:00' : (type === 'hammam' ? '18:00' : '23:00'),
        location: region.regionNameFr,
        status: 'planned',
        priority: 'essential',
        color: def.color,
        budgetLimit: type === 'reception_3ers' ? 8000 : (type === 'outia' ? 2500 : 800),
        notes: `Tradition de ${region.regionNameFr} (${region.localityFr})`,
        linkedShoppingItemIds: [],
        createdAt: Date.now()
      });
    }

    if (newEvents.length > 0) {
      this.events.update(list => [...list, ...newEvents]);
    }
  }

  updateProfile(updates: Partial<WeddingProfile>): void {
    this.profile.update(p => ({ ...p, ...updates }));
    if (updates.weddingDate) {
      this.preferences.updatePreferences({ weddingDate: updates.weddingDate });
    }
  }

  // --- Date Helpers ---
  private getFutureDateString(offsetDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  }

  getEventDisplayName(event: WeddingEvent): string {
    const lang = this.i18n.currentLang();
    if (event.customTraditionName) {
      return event.customTraditionName;
    }
    if (lang === 'ar') return event.titleAr || event.titleFr;
    if (lang === 'en') return event.titleEn || event.titleFr;
    return event.titleFr;
  }
}
