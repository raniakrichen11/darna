import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Darna | دارنا — Accueil'
  },
  {
    path: 'catalog',
    loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent),
    title: 'Darna | دارنا — Catalogue Trousseau'
  },
  {
    path: 'catalog/:categoryId',
    loadComponent: () => import('./pages/category-detail/category-detail.component').then(m => m.CategoryDetailComponent),
    title: 'Darna | دارنا — Catégorie'
  },
  {
    path: 'my-list',
    loadComponent: () => import('./pages/my-list/my-list.component').then(m => m.MyListComponent),
    title: 'Darna | دارنا — Ma Liste de Trousseau'
  },
  {
    path: 'budget',
    loadComponent: () => import('./pages/budget/budget.component').then(m => m.BudgetComponent),
    title: 'Darna | دارنا — Budget & Finances'
  },
  {
    path: 'timeline',
    loadComponent: () => import('./pages/timeline/timeline.component').then(m => m.TimelineComponent),
    title: 'Darna | دارنا — Planning & Étapes'
  },
  {
    path: 'diary',
    loadComponent: () => import('./pages/wedding-diary/wedding-diary.component').then(m => m.WeddingDiaryComponent),
    title: 'Darna | دارنا — Mon Carnet de Mariage'
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    title: 'Darna | دارنا — Paramètres'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

