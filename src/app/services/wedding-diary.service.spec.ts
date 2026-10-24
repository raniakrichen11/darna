import { TestBed } from '@angular/core/testing';
import { WeddingDiaryService } from './wedding-diary.service';
import { ShoppingListService } from './shopping-list.service';
import { I18nService } from './i18n.service';
import {
  TUNISIAN_REGIONAL_TRADITIONS,
  EVENT_TEMPLATE_DEFINITIONS,
  WeddingEvent,
  WeddingTask,
  EventProvider,
  DiaryNote,
  WeddingEventType
} from '../models/wedding-diary.model';

describe('WeddingDiaryService & Traditions', () => {
  let service: WeddingDiaryService;
  let shoppingList: ShoppingListService;
  let i18n: I18nService;

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }

    TestBed.configureTestingModule({
      providers: [WeddingDiaryService, ShoppingListService, I18nService]
    });

    service = TestBed.inject(WeddingDiaryService);
    shoppingList = TestBed.inject(ShoppingListService);
    i18n = TestBed.inject(I18nService);
  });

  describe('Initialization & Default Traditions', () => {
    it('should initialize with default events and tasks', () => {
      const events = service.events();
      expect(events.length).toBeGreaterThanOrEqual(4);
      expect(events.some(e => e.eventType === 'hammam')).toBeTrue();
      expect(events.some(e => e.eventType === 'henna')).toBeTrue();
      expect(events.some(e => e.eventType === 'reception_3ers')).toBeTrue();

      const tasks = service.tasks();
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('should have 14 researched Tunisian regional traditions', () => {
      expect(TUNISIAN_REGIONAL_TRADITIONS.length).toBe(14);
      const regionIds = TUNISIAN_REGIONAL_TRADITIONS.map(r => r.regionId);
      expect(regionIds).toContain('tunis');
      expect(regionIds).toContain('sfax');
      expect(regionIds).toContain('sousse');
      expect(regionIds).toContain('monastir');
      expect(regionIds).toContain('mahdia');
      expect(regionIds).toContain('nabeul');
      expect(regionIds).toContain('bizerte');
      expect(regionIds).toContain('kairouan');
      expect(regionIds).toContain('djerba');
      expect(regionIds).toContain('gabes');
      expect(regionIds).toContain('tataouine');
      expect(regionIds).toContain('tozeur');
      expect(regionIds).toContain('gafsa');
      expect(regionIds).toContain('kef');

      // Verify that all 14 have documented outfits and verification status
      for (const reg of TUNISIAN_REGIONAL_TRADITIONS) {
        expect(reg.traditionalOutfitsFr.length).toBeGreaterThan(0);
        expect(['verified_ethnographic', 'documented_regional', 'to_confirm_locally']).toContain(reg.verificationStatus);
        expect(reg.sourceReference).toBeTruthy();
      }
    });

    it('should define all Tunisian event templates', () => {
      expect(EVENT_TEMPLATE_DEFINITIONS.khotba).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.ketben_sde9).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.saboun).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.hazzan_farch).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.hammam).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.henna).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.wassef).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.outia).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.jelwa).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.reception_3ers).toBeDefined();
      expect(EVENT_TEMPLATE_DEFINITIONS.morning_after).toBeDefined();
    });
  });

  describe('Events CRUD & Rescheduling', () => {
    it('should create a custom event and persist it', () => {
      const initialCount = service.events().length;
      const newEvent = service.createEvent({
        title: 'Séance d’essayage Keswa',
        eventType: 'custom',
        date: '2027-05-10',
        startTime: '14:00',
        endTime: '16:00',
        location: 'La Marsa',
        budgetLimit: 400
      });

      expect(service.events().length).toBe(initialCount + 1);
      expect(newEvent.id).toBeTruthy();
      expect(newEvent.budgetLimit).toBe(400);

      // Verify retrieval by date
      const eventsOnDate = service.events().filter(e => e.date === '2027-05-10');
      expect(eventsOnDate.some(e => e.id === newEvent.id)).toBeTrue();
    });

    it('should update and reschedule an event without duplicating data', () => {
      const event = service.events()[0];
      const newDate = '2027-08-20';
      service.updateEvent(event.id, {
        date: newDate,
        location: 'Sidi Bou Saïd'
      });

      const updated = service.events().find(e => e.id === event.id);
      expect(updated?.date).toBe(newDate);
      expect(updated?.location).toBe('Sidi Bou Saïd');
    });

    it('should delete an event and clean up associated tasks', () => {
      const created = service.createEvent({
        title: 'Visite Salle des Fêtes',
        eventType: 'custom',
        date: '2027-04-12'
      });

      // Add a task linked to this event
      const task = service.createTask({
        eventId: created.id,
        title: 'Demander le devis sonorisation'
      });

      expect(service.tasks().some(t => t.id === task.id)).toBeTrue();

      service.deleteEvent(created.id);
      expect(service.events().some(e => e.id === created.id)).toBeFalse();
      expect(service.tasks().some(t => t.id === task.id)).toBeFalse();
    });
  });

  describe('Tasks Management & Roles', () => {
    it('should toggle task completion state', () => {
      const task = service.tasks()[0];
      const initialStatus = task.status;
      service.toggleTask(task.id);

      const updated = service.tasks().find(t => t.id === task.id);
      expect(updated?.status).not.toBe(initialStatus);
      if (updated?.status === 'completed') {
        expect(updated.completedAt).toBeDefined();
      }
    });

    it('should assign tasks to specific family members or providers', () => {
      const task = service.createTask({
        title: 'Récupérer les coffrets de dragées',
        assigneeRole: 'mother',
        assigneeName: 'Maman',
        priority: 'essential'
      });

      expect(task.assigneeRole).toBe('mother');
      expect(task.assigneeName).toBe('Maman');
      expect(task.priority).toBe('essential');
    });

    it('should calculate task counts and overdue states', () => {
      // Create overdue task
      service.createTask({
        title: 'Tâche en retard',
        dueDate: '2020-01-01'
      });

      expect(service.tasksOverdue().length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Provider Financial Tracking & No Double Counting', () => {
    it('should calculate agreed total, deposit paid, and remaining balance correctly', () => {
      const event = service.events()[0];
      const provider1 = service.createProvider({
        eventId: event.id,
        providerName: 'Studio Photo Jasmin',
        serviceType: 'Photographe & Vidéaste',
        agreedPrice: 2200,
        depositPaid: 600
      });

      expect(provider1.remainingAmount).toBe(1600); // 2200 - 600

      const provider2 = service.createProvider({
        eventId: event.id,
        providerName: 'Troupe Musicale El Andalous',
        serviceType: 'Orchestre traditionnel',
        agreedPrice: 3500,
        depositPaid: 1000
      });

      expect(provider2.remainingAmount).toBe(2500);

      const summary = service.financialSummary();
      expect(summary.totalAgreedProviders).toBeGreaterThanOrEqual(5700);
      expect(summary.totalDepositsPaid).toBeGreaterThanOrEqual(1600);
      expect(summary.totalRemainingProviders).toBeGreaterThanOrEqual(4100);
      // Guarantee formula: agreed = deposit + remaining
      expect(summary.totalAgreedProviders).toBe(summary.totalDepositsPaid + summary.totalRemainingProviders);
    });

    it('should update provider deposit and recalculate remaining balance automatically', () => {
      const event = service.events()[0];
      const provider = service.createProvider({
        eventId: event.id,
        providerName: 'Ziyena / Negafa',
        serviceType: 'Habillage & Parures',
        agreedPrice: 1500,
        depositPaid: 500
      });

      expect(provider.remainingAmount).toBe(1000);

      service.updateProvider(provider.id, {
        depositPaid: 1200
      });

      const updated = service.providers().find(p => p.id === provider.id);
      expect(updated?.depositPaid).toBe(1200);
      expect(updated?.remainingAmount).toBe(300);
    });
  });

  describe('Shopping & Trousseau Integration', () => {
    it('should link existing catalog/trousseau items without duplicate list insertion', () => {
      const event = service.events()[0];
      const initialListCount = shoppingList.totalItemsCount();

      // Add one item to shopping list
      const customItem = shoppingList.addCustomItem({
        name: 'Fouta artisanale tissée main',
        categoryId: 'lin',
        quantity: 2,
        estimatedUnitPrice: 65,
        priority: 'essential'
      });

      expect(shoppingList.totalItemsCount()).toBe(initialListCount + 1);

      // Link this shopping item to event
      service.linkShoppingItemToEvent(event.id, customItem.id);

      // Verify that shopping list total didn't duplicate
      expect(shoppingList.totalItemsCount()).toBe(initialListCount + 1);

      // Verify event has linked item ID in its record
      const refreshedEvent = service.events().find(e => e.id === event.id);
      expect(refreshedEvent?.linkedShoppingItemIds).toContain(customItem.id);
    });
  });

  describe('Personal Diary Notes', () => {
    it('should create, edit, pin, and search diary notes', () => {
      const note = service.createNote({
        title: 'Idées coiffure Outia',
        content: 'Chignon bas avec parure d’ambre et jasmin naturel',
        category: 'beauty',
        associatedDate: '2027-06-12',
        isPinned: false
      });

      expect(note.id).toBeTruthy();
      expect(note.isPinned).toBeFalse();

      // Toggle pin
      service.togglePinNote(note.id);
      const pinned = service.notes().find(n => n.id === note.id);
      expect(pinned?.isPinned).toBeTrue();

      // Search notes
      const results = service.notes().filter(n => n.title.toLowerCase().includes('coiffure'));
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].title).toContain('coiffure');

      // Update content
      service.updateNote(note.id, {
        content: 'Chignon bas rehaussé d’une fibule argentée artisanale'
      });
      const updated = service.notes().find(n => n.id === note.id);
      expect(updated?.content).toContain('fibule argentée');

      // Delete note
      service.deleteNote(note.id);
      expect(service.notes().some(n => n.id === note.id)).toBeFalse();
    });
  });

  describe('Regional Tradition Template Application', () => {
    it('should apply Sfax traditions and generate regional celebrations', () => {
      const beforeEvents = service.events().length;
      const sfaxTypes: WeddingEventType[] = ['wassef', 'hazzan_farch', 'outia'];
      service.applyRegionalTradition('sfax', '2027-07-15', sfaxTypes);

      const afterEvents = service.events();
      expect(afterEvents.length).toBeGreaterThan(beforeEvents);

      // Sfaxian traditions include 'wassef'
      expect(afterEvents.some(e => e.eventType === 'wassef')).toBeTrue();
    });

    it('should apply Djerba traditions with distinct Island rituals', () => {
      const djerbaTypes: WeddingEventType[] = ['jelwa', 'hammam'];
      service.applyRegionalTradition('djerba', '2027-09-20', djerbaTypes);
      const events = service.events();
      expect(events.some(e => e.eventType === 'jelwa')).toBeTrue();
    });
  });
});
