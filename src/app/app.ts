import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from './services/i18n.service';
import { PreferencesService } from './services/preferences.service';
import { ShoppingListService } from './services/shopping-list.service';
import { PwaService } from './services/pwa.service';
import { ToastService } from './services/toast.service';
import { PrintViewComponent } from './components/print-view/print-view.component';
import { AppLanguage } from './models/user-preferences.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, PrintViewComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  i18n = inject(I18nService);
  preferences = inject(PreferencesService);
  shoppingList = inject(ShoppingListService);
  pwa = inject(PwaService);
  toast = inject(ToastService);

  toggleLanguage(): void {
    const current = this.i18n.currentLang();
    const nextLang: AppLanguage = current === 'fr' ? 'ar' : (current === 'ar' ? 'en' : 'fr');
    this.setLanguage(nextLang);
  }

  setLanguage(lang: AppLanguage): void {
    this.preferences.setLanguage(lang);
    const msg = lang === 'ar'
      ? 'تم تفعيل اللغة العربية (RTL)'
      : (lang === 'en' ? 'English activated (LTR)' : 'Langue française activée (LTR)');
    this.toast.show(msg);
  }

  setInitialLanguage(lang: AppLanguage): void {
    this.preferences.setLanguage(lang);
    const msg = lang === 'ar'
      ? 'مرحباً بكِ في دارنا 🕊️'
      : (lang === 'en' ? 'Welcome to Darna 🕊️' : 'Bienvenue sur Darna 🕊️');
    this.toast.show(msg);
  }

  async onInstallClick(): Promise<void> {
    const success = await this.pwa.promptInstall();
    if (success) {
      this.toast.show(
        this.i18n.currentLang() === 'ar'
          ? 'تم تثبيت تطبيق دارنا بنجاح 📱'
          : 'Application Darna installée avec succès 📱'
      );
    }
  }
}
