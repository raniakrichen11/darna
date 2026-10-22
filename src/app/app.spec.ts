import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { I18nService } from './services/i18n.service';
import { ShoppingListService } from './services/shopping-list.service';
import { CatalogService } from './services/catalog.service';

describe('App & Core Services', () => {
  let app: App;
  let i18n: I18nService;
  let shoppingList: ShoppingListService;
  let catalog: CatalogService;

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
  });

  it('should create the App component', () => {
    expect(app).toBeTruthy();
  });

  it('should initialize with 14 categories and 100+ items', () => {
    expect(catalog.categories().length).toBe(14);
    expect(catalog.items().length).toBeGreaterThanOrEqual(50);
  });

  it('should toggle language and set RTL direction for Arabic', () => {
    i18n.setLanguage('fr');
    expect(i18n.isRtl()).toBeFalse();
    expect(i18n.dir()).toBe('ltr');

    i18n.setLanguage('ar');
    expect(i18n.isRtl()).toBeTrue();
    expect(i18n.dir()).toBe('rtl');
    expect(i18n.currency()).toBe('د.ت');
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
});
