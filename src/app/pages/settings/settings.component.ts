import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferencesService } from '../../services/preferences.service';
import { ShoppingListService } from '../../services/shopping-list.service';
import { StorageService } from '../../services/storage.service';
import { I18nService } from '../../services/i18n.service';
import { PwaService } from '../../services/pwa.service';
import { ToastService } from '../../services/toast.service';
import { AppLanguage } from '../../models/user-preferences.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page" [attr.dir]="i18n.dir()">
      <!-- Page Header -->
      <header class="page-header">
        <span class="page-eyebrow">{{ i18n.currentLang() === 'ar' ? 'الإعدادات والتفضيلات' : 'PARAMÈTRES & PRÉFÉRENCES' }}</span>
        <h1 class="page-title">{{ i18n.t('settings.title') }}</h1>
        <p class="page-subtitle">{{ i18n.t('settings.subtitle') }}</p>
      </header>

      <!-- Language Switcher Card -->
      <section class="settings-card">
        <div class="card-header">
          <div class="header-icon-pill">🌍</div>
          <div class="header-text">
            <span class="section-eyebrow">{{ i18n.currentLang() === 'ar' ? 'اللغة والاتجاه' : 'LANGUE & DIRECTION' }}</span>
            <h2 class="section-title">{{ i18n.t('settings.language_section') }}</h2>
            <p class="section-desc">{{ i18n.currentLang() === 'ar' ? 'اختاري اللغة المناسبة لكِ مع تغيير فوري للاتجاه (RTL / LTR).' : 'Basculez entre le Français et l’Arabe avec inversion dynamique de la mise en page.' }}</p>
          </div>
        </div>

        <div class="language-choices">
          <button
            type="button"
            class="lang-box"
            [class.active]="i18n.currentLang() === 'fr'"
            (click)="selectLanguage('fr')"
          >
            <span class="flag">🇫🇷</span>
            <div class="lang-meta">
              <strong>Français</strong>
              <small>De gauche à droite (LTR)</small>
            </div>
            @if (i18n.currentLang() === 'fr') {
              <span class="check-mark">✓</span>
            }
          </button>

          <button
            type="button"
            class="lang-box"
            [class.active]="i18n.currentLang() === 'ar'"
            (click)="selectLanguage('ar')"
          >
            <span class="flag">🇹🇳</span>
            <div class="lang-meta">
              <strong>العربية</strong>
              <small>من اليمين إلى اليسار (RTL)</small>
            </div>
            @if (i18n.currentLang() === 'ar') {
              <span class="check-mark">✓</span>
            }
          </button>

          <button
            type="button"
            class="lang-box"
            [class.active]="i18n.currentLang() === 'en'"
            (click)="selectLanguage('en')"
          >
            <span class="flag">🇬🇧</span>
            <div class="lang-meta">
              <strong>English</strong>
              <small>Left to Right (LTR)</small>
            </div>
            @if (i18n.currentLang() === 'en') {
              <span class="check-mark">✓</span>
            }
          </button>
        </div>
      </section>

      <!-- Personal Info Card -->
      <section class="settings-card">
        <div class="card-header">
          <div class="header-icon-pill">👰</div>
          <div class="header-text">
            <span class="section-eyebrow">{{ i18n.currentLang() === 'ar' ? 'الملف الشخصي' : 'PROFIL MARIÉE' }}</span>
            <h2 class="section-title">{{ i18n.t('settings.personal_section') }}</h2>
            <p class="section-desc">{{ i18n.currentLang() === 'ar' ? 'لتخصيص ترويسة ملف PDF وقائمة جهازك.' : 'Pour personnaliser vos exports PDF et votre accueil.' }}</p>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="brideName">{{ i18n.t('settings.bride_name') }}</label>
            <input
              id="brideName"
              type="text"
              [(ngModel)]="brideName"
              (ngModelChange)="onBrideNameChange($event)"
              [placeholder]="i18n.currentLang() === 'ar' ? 'مثال: ياسمين' : 'Ex: Yasmine'"
            />
          </div>

          <div class="form-group">
            <label for="groomName">{{ i18n.t('settings.groom_name') }}</label>
            <input
              id="groomName"
              type="text"
              [(ngModel)]="groomName"
              (ngModelChange)="onGroomNameChange($event)"
              [placeholder]="i18n.currentLang() === 'ar' ? 'مثال: محمد' : 'Ex: Mohamed'"
            />
          </div>

          <div class="form-group full-width">
            <label for="weddingDate">{{ i18n.t('settings.wedding_date') }}</label>
            <input
              id="weddingDate"
              type="date"
              [(ngModel)]="weddingDate"
              (ngModelChange)="onWeddingDateChange($event)"
            />
          </div>
        </div>
      </section>

      <!-- PWA Installation Card -->
      <section class="settings-card pwa-card">
        <div class="card-header">
          <div class="header-icon-pill">📱</div>
          <div class="header-text">
            <span class="section-eyebrow">{{ i18n.currentLang() === 'ar' ? 'تطبيق الهاتف' : 'APPLICATION PWA' }}</span>
            <h2 class="section-title">{{ i18n.t('settings.pwa_section') }}</h2>
            <p class="section-desc">
              {{ i18n.currentLang() === 'ar'
                ? 'دارنا يعمل كتطبيق هاتف حقيقي (PWA) حتى عند انقطاع الإنترنت أو أثناء التسوق في الأسواق والمحلات.'
                : 'Darna fonctionne comme une vraie application mobile (PWA), consultable hors-ligne dans les magasins et marchés.' }}
            </p>
          </div>
        </div>

        <div class="pwa-actions-row">
          @if (pwa.isInstalled()) {
            <div class="pwa-badge installed">
              ✓ {{ i18n.t('settings.pwa_installed') }}
            </div>
          } @else if (pwa.canInstall()) {
            <button type="button" class="btn btn-primary" (click)="installPwa()">
              📲 {{ i18n.t('settings.pwa_install_btn') }}
            </button>
          } @else {
            <div class="pwa-hint-box">
              {{ i18n.currentLang() === 'ar'
                ? '💡 يمكنك إضافة دارنا إلى شاشتك الرئيسية عبر خيار «Ajouter à l’écran d’accueil» من متصفحك.'
                : '💡 Pour installer l’application, utilisez l’option « Ajouter à l’écran d’accueil » de votre navigateur.' }}
            </div>
          }
        </div>
      </section>

      <!-- Data Backup & Reset Card -->
      <section class="settings-card">
        <div class="card-header">
          <div class="header-icon-pill">💾</div>
          <div class="header-text">
            <span class="section-eyebrow">{{ i18n.currentLang() === 'ar' ? 'البيانات والأمان' : 'DONNÉES & SAUVEGARDE' }}</span>
            <h2 class="section-title">{{ i18n.t('settings.data_section') }}</h2>
            <p class="section-desc">{{ i18n.t('settings.data_desc') }}</p>
          </div>
        </div>

        <div class="backup-actions">
          <button type="button" class="btn btn-outline" (click)="onExportBackup()">
            📤 {{ i18n.t('settings.export_backup') }}
          </button>

          <label class="btn btn-outline file-btn">
            📥 {{ i18n.t('settings.import_backup') }}
            <input type="file" accept=".json" (change)="onImportFile($event)" style="display: none;" />
          </label>

          <button type="button" class="btn btn-outline" (click)="relaunchOnboarding()">
            ✨ {{ i18n.currentLang() === 'ar' ? 'إعادة تشغيل دليل البداية' : 'Relancer le guide d’accueil' }}
          </button>

          <button type="button" class="btn btn-subtle reset-btn" (click)="onResetStarter()">
            🔄 {{ i18n.t('settings.reset_starter') }}
          </button>
        </div>
      </section>

      <!-- About Darna Section -->
      <section class="about-card">
        <div class="about-brand">Darna | دارنا</div>
        <h3 class="about-title">{{ i18n.t('settings.about_title') }}</h3>
        <p class="about-desc">{{ i18n.t('settings.about_text') }}</p>
        <div class="culture-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="culture-symbol">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
          <span>{{ i18n.currentLang() === 'ar' ? 'دارنا · طبعة فاخرة مصممة خصيصاً لعرائس تونس' : 'Darna Editorial Luxury Edition · Conçu pour les mariées de Tunisie' }}</span>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .settings-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .page-header {
      margin-bottom: var(--space-xs);

      .page-eyebrow {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        font-weight: 600;
        color: var(--color-terracotta);
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
        font-size: 0.95rem;
      }
    }

    .settings-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);

      .card-header {
        display: flex;
        gap: 16px;
        align-items: flex-start;

        .header-icon-pill {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          background: var(--color-sand);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
          flex-shrink: 0;
        }

        .header-text {
          flex: 1;

          .section-eyebrow {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 600;
            color: var(--color-terracotta);
            display: block;
          }

          .section-title {
            font-family: var(--font-serif);
            font-size: 1.35rem;
            color: var(--color-burgundy);
            margin: 2px 0 4px 0;
          }

          .section-desc {
            font-size: 0.88rem;
            color: var(--color-text-muted);
            line-height: 1.5;
            margin: 0;
          }
        }
      }
    }

    /* Language choices */
    .language-choices {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;

      @media (min-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .lang-box {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 20px;
      background: var(--color-ivory);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      text-align: start;
      transition: all 0.25s ease;

      .flag {
        font-size: 2.2rem;
      }

      .lang-meta {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;

        strong {
          font-family: var(--font-serif);
          font-size: 1.15rem;
          color: var(--color-charcoal);
        }

        small {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }
      }

      .check-mark {
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--color-burgundy);
      }

      &.active {
        background: var(--color-surface);
        border-color: var(--color-burgundy);
        box-shadow: 0 4px 16px rgba(113, 59, 72, 0.1);
      }

      &:hover:not(.active) {
        border-color: var(--color-border-strong);
        background: #fff;
      }
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      .full-width {
        @media (min-width: 640px) {
          grid-column: span 2;
        }
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;

        label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        input {
          padding: 10px 14px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-charcoal);
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s ease;

          &:focus {
            outline: none;
            border-color: var(--color-burgundy);
            box-shadow: 0 0 0 3px rgba(113, 59, 72, 0.12);
          }
        }
      }
    }

    /* PWA */
    .pwa-card {
      background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-sand) 100%);
    }

    .pwa-actions-row {
      display: flex;
      align-items: center;

      .pwa-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: var(--radius-full);
        font-size: 0.85rem;
        font-weight: 600;

        &.installed {
          background: rgba(113, 136, 117, 0.15);
          color: var(--color-sage);
          border: 1px solid var(--color-sage);
        }
      }

      .pwa-hint-box {
        font-size: 0.88rem;
        color: var(--color-text-muted);
        background: var(--color-surface);
        padding: 10px 16px;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
      }
    }

    /* Backup */
    .backup-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .file-btn {
        margin: 0;
        cursor: pointer;
      }

      .reset-btn {
        margin-inline-start: auto;

        @media (max-width: 600px) {
          margin-inline-start: 0;
          width: 100%;
        }
      }
    }

    .about-card {
      background: var(--color-sand);
      border: 1px dashed var(--color-border-strong);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: center;
      align-items: center;

      .about-brand {
        font-family: var(--font-serif);
        font-size: 1.3rem;
        color: var(--color-burgundy);
        letter-spacing: 0.05em;
      }

      .about-title {
        font-family: var(--font-serif);
        font-size: 1.15rem;
        color: var(--color-charcoal);
        margin: 0;
      }

      .about-desc {
        font-size: 0.9rem;
        line-height: 1.6;
        color: var(--color-text-muted);
        max-width: 600px;
        margin: 0;
      }

      .culture-footer {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.78rem;
        color: var(--color-text-muted);
        margin-top: 14px;
        font-weight: 500;

        .culture-symbol {
          color: var(--color-text-muted);
          flex-shrink: 0;
        }
      }
    }

    /* Mobile Responsive Settings */
    @media (max-width: 600px) {
      .settings-page {
        gap: 14px;
      }

      .settings-card {
        padding: 14px 12px;
        gap: 12px;

        .card-header {
          gap: 10px;

          .header-icon-pill {
            width: 34px;
            height: 34px;
            font-size: 1.05rem;
          }

          .section-title {
            font-size: 1.15rem;
          }
        }
      }

      .backup-actions {
        flex-direction: column;

        .btn, .file-btn {
          width: 100%;
          justify-content: center;
        }
      }

      .about-card {
        padding: 18px 14px;
      }
    }
  `]
})
export class SettingsComponent {
  preferences = inject(PreferencesService);
  shoppingList = inject(ShoppingListService);
  storage = inject(StorageService);
  i18n = inject(I18nService);
  pwa = inject(PwaService);
  toast = inject(ToastService);

  brideName = this.preferences.preferences().brideName || '';
  groomName = this.preferences.preferences().groomName || '';
  weddingDate = this.preferences.preferences().weddingDate || '';

  selectLanguage(lang: AppLanguage): void {
    this.preferences.setLanguage(lang);
    const msg = lang === 'ar'
      ? 'تم تفعيل اللغة العربية (RTL) ✨'
      : (lang === 'en' ? 'English language activated (LTR) ✨' : 'Langue française activée (LTR) ✨');
    this.toast.show(msg);
  }

  onBrideNameChange(val: string): void {
    this.preferences.setBrideName(val);
  }

  onGroomNameChange(val: string): void {
    this.preferences.updatePreferences({ groomName: val.trim() });
  }

  onWeddingDateChange(val: string): void {
    this.preferences.setWeddingDate(val);
  }

  async installPwa(): Promise<void> {
    const installed = await this.pwa.promptInstall();
    if (installed) {
      this.toast.show(
        this.i18n.currentLang() === 'ar'
          ? 'شكراً لكِ! تم تثبيت تطبيق دارنا 📱'
          : 'Merci ! Application Darna installée 📱'
      );
    }
  }

  onExportBackup(): void {
    const jsonStr = this.storage.exportAllData([
      'darna_shopping_list',
      'darna_user_preferences',
      'darna_lang_pref',
      'darna_timeline_tasks',
      'darna_diary_events',
      'darna_diary_tasks',
      'darna_diary_notes',
      'darna_diary_providers',
      'darna_diary_profile'
    ]);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `darna_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast.show(
      this.i18n.currentLang() === 'ar' ? 'تم تحميل ملف النسخ الاحتياطي' : 'Sauvegarde exportée avec succès'
    );
  }

  relaunchOnboarding(): void {
    this.preferences.updatePreferences({ hasCompletedOnboarding: false });
    this.toast.show(
      this.i18n.currentLang() === 'ar' ? 'تمت إعادة تشغيل دليل الاستقبال' : 'Guide d’accueil réactivé'
    );
  }

  onImportFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        if (content) {
          const success = this.storage.importData(content);
          if (success) {
            // Reload page to rehydrate states cleanly
            window.location.reload();
          } else {
            alert('Fichier de sauvegarde invalide.');
          }
        }
      };
      reader.readAsText(file);
    }
  }

  onResetStarter(): void {
    const msg =
      this.i18n.currentLang() === 'ar'
        ? 'هل ترغبين في استعادة القائمة المقترحة لجهاز العروس التونسية؟'
        : 'Voulez-vous réinitialiser votre liste avec la sélection recommandée tunisienne ?';

    if (confirm(msg)) {
      this.shoppingList.resetToRecommended();
      this.toast.show(
        this.i18n.currentLang() === 'ar' ? 'تمت استعادة القائمة المقترحة' : 'Sélection recommandée chargée'
      );
    }
  }
}
