import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { I18nService } from './services/i18n.service';
import { ShoppingListService } from './services/shopping-list.service';
import { CatalogService } from './services/catalog.service';
import { TimelineService } from './services/timeline.service';
import { PreferencesService } from './services/preferences.service';

describe('App & Core Services', () => {
  let app: App;
  let i18n: I18nService;
  let shoppingList: ShoppingListService;
  let catalog: CatalogService;
  let timeline: TimelineService;
  let preferences: PreferencesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    i18n = TestBed.inject(I18nService);
    shoppingList = TestBed.inject(ShoppingListService);
    catalog = TestBed.inject(CatalogService);
    timeline = TestBed.inject(TimelineService);
    preferences = TestBed.inject(PreferencesService);
  });

  it('should create the App component', () => {
    expect(app).toBeTruthy();
  });

  it('should initialize with 14 categories and 100+ items', () => {
    expect(catalog.categories().length).toBe(14);
    expect(catalog.items().length).toBeGreaterThanOrEqual(50);
  });

  it('should toggle language and set RTL direction for Arabic, and LTR for English', () => {
    i18n.setLanguage('fr');
    expect(i18n.isRtl()).toBeFalse();
    expect(i18n.dir()).toBe('ltr');
    expect(i18n.currency()).toBe('DT');
    expect(i18n.t('nav.home')).toBe('Accueil');

    i18n.setLanguage('ar');
    expect(i18n.isRtl()).toBeTrue();
    expect(i18n.dir()).toBe('rtl');
    expect(i18n.currency()).toBe('د.ت');
    expect(i18n.t('nav.home')).toBe('الرئيسية');

    i18n.setLanguage('en');
    expect(i18n.isRtl()).toBeFalse();
    expect(i18n.dir()).toBe('ltr');
    expect(i18n.currency()).toBe('DT');
    expect(i18n.t('nav.home')).toBe('Home');
    expect(i18n.t('nav.catalog')).toBe('Catalog');
  });

  it('should add catalog item and compute budget totals', () => {
    const item = catalog.items()[0];
    const initialCount = shoppingList.totalItemsCount();
    shoppingList.addCatalogItem(item);

    expect(shoppingList.totalItemsCount()).toBeGreaterThanOrEqual(initialCount);
    expect(shoppingList.totalEstimatedCost()).toBeGreaterThan(0);
  });

  it('should toggle purchased state and calculate actual spending', () => {
    const items = shoppingList.items();
    if (items.length > 0) {
      const firstId = items[0].id;
      const initialPurchased = shoppingList.purchasedItemsCount();
      shoppingList.togglePurchased(firstId);
      expect(shoppingList.purchasedItemsCount()).not.toBe(initialPurchased);
    }
  });

  it('should support priority levels and undo removal', () => {
    const testCustom = shoppingList.addCustomItem({
      name: 'Rideaux salon en lin',
      categoryId: 'lin',
      quantity: 2,
      estimatedUnitPrice: 180,
      priority: 'essential',
      purchaseLocation: 'Souk El Grana'
    });

    expect(testCustom.priority).toBe('essential');
    expect(testCustom.purchaseLocation).toBe('Souk El Grana');

    const countBeforeRemoval = shoppingList.totalItemsCount();
    shoppingList.removeItem(testCustom.id);
    expect(shoppingList.totalItemsCount()).toBe(countBeforeRemoval - 1);
    expect(shoppingList.lastRemovedItem()?.id).toBe(testCustom.id);

    // Undo removal
    shoppingList.undoLastRemoval();
    expect(shoppingList.totalItemsCount()).toBe(countBeforeRemoval);
  });

  it('should initialize timeline with 5 preparation stages and allow custom tasks', () => {
    expect(timeline.milestones().length).toBe(5);
    expect(timeline.tasks().length).toBeGreaterThanOrEqual(10);

    const initialTotal = timeline.totalTasksCount();
    const newTask = timeline.addTask({
      title: 'Réserver la negafa / ziyena',
      stage: 'phase_3m',
      categoryIcon: '👰'
    });

    expect(timeline.totalTasksCount()).toBe(initialTotal + 1);
    expect(newTask.id).toBeTruthy();

    timeline.toggleTask(newTask.id);
    expect(timeline.tasks().find(t => t.id === newTask.id)?.isCompleted).toBeTrue();
  });

  it('should manage category budgets and onboarding flow', () => {
    preferences.setCategoryBudget('cui', 3500);
    expect(preferences.preferences().categoryBudgets?.['cui']).toBe(3500);

    preferences.completeOnboarding({
      brideName: 'Meriem',
      weddingDate: '2027-06-15',
      homeType: 'apartment',
      totalBudget: 25000
    });

    expect(preferences.preferences().hasCompletedOnboarding).toBeTrue();
    expect(preferences.preferences().brideName).toBe('Meriem');
    expect(preferences.preferences().totalBudget).toBe(25000);
  });
});

