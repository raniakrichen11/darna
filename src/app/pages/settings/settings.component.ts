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
      <div class="page-header">
        <h1>{{ i18n.t('settings.title') }}</h1>
        <p>{{ i18n.t('settings.subtitle') }}</p>
      </div>

      <!-- Language Switcher Card -->
      <section class="settings-card card">
        <div class="card-header">
          <div class="header-icon">🌍</div>
          <div>
            <h2>{{ i18n.t('settings.language_section') }}</h2>
            <p>{{ i18n.currentLang() === 'ar' ? 'اختاري اللغة المناسبة لكِ مع تغيير فوري للاتجاه (RTL / LTR).' : 'Basculez entre le Français et l’Arabe avec inversion dynamique de la mise en page.' }}</p>
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
        </div>
      </section>

      <!-- Personal Info Card -->
      <section class="settings-card card">
        <div class="card-header">
          <div class="header-icon">👰</div>
          <div>
            <h2>{{ i18n.t('settings.personal_section') }}</h2>
            <p>{{ i18n.currentLang() === 'ar' ? 'لتخصيص ترويسة ملف PDF وقائمة جهازك.' : 'Pour personnaliser vos exports PDF et votre accueil.' }}</p>
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
              placeholder="Ex: Yasmine / ياسمين"
            />
          </div>

          <div class="form-group">
            <label for="groomName">{{ i18n.t('settings.groom_name') }}</label>
            <input
              id="groomName"
              type="text"
              [(ngModel)]="groomName"
              (ngModelChange)="onGroomNameChange($event)"
              placeholder="Ex: Mohamed / محمد"
            />
          </div>

          <div class="form-group">
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
      <section class="settings-card card">
        <div class="card-header">
          <div class="header-icon">📱</div>
          <div>
            <h2>{{ i18n.t('settings.pwa_section') }}</h2>
            <p>
              {{ i18n.currentLang() === 'ar'
                ? 'دارنا يعمل كتطبيق هاتف حقيقي (PWA) حتى عند انقطاع الإنترنت أو أثناء التسوق في الأسواق والمحلات.'
                : 'Darna fonctionne comme une vraie application mobile (PWA), consultable hors-ligne dans les magasins et marchés.' }}
            </p>
          </div>
        </div>

        <div class="pwa-actions-row">
          @if (pwa.isInstalled()) {
            <div class="badge badge-success">
              ✓ {{ i18n.t('settings.pwa_installed') }}
            </div>
          } @else if (pwa.canInstall()) {
            <button type="button" class="btn btn-primary" (click)="installPwa()">
              📲 {{ i18n.t('settings.pwa_install_btn') }}
            </button>
          } @else {
            <span class="pwa-hint">
              {{ i18n.currentLang() === 'ar'
                ? '💡 يمكنك إضافة دارنا إلى شاشتك الرئيسية عبر خيار «Ajouter à l’écran d’accueil» من متصفحك.'
                : '💡 Pour installer l’application, utilisez l’option « Ajouter à l’écran d’accueil » de votre navigateur.' }}
            </span>
          }
        </div>
      </section>

      <!-- Data Backup & Reset Card -->
      <section class="settings-card card">
        <div class="card-header">
          <div class="header-icon">💾</div>
          <div>
            <h2>{{ i18n.t('settings.data_section') }}</h2>
            <p>{{ i18n.t('settings.data_desc') }}</p>
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

          <button type="button" class="btn btn-subtle" (click)="onResetStarter()">
            🔄 {{ i18n.t('settings.reset_starter') }}
          </button>
        </div>
      </section>

      <!-- About Darna Section -->
      <section class="about-card card">
        <h3>{{ i18n.t('settings.about_title') }}</h3>
        <p>{{ i18n.t('settings.about_text') }}</p>
        <div class="culture-footer">
          <span>Made with ❤️ for Tunisian Brides • Darna v1.0.0</span>
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
      h1 {
        font-size: 1.85rem;
        margin-bottom: 4px;
      }
      p {
        color: var(--color-text-muted);
      }
    }

    .settings-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);

      .card-header {
        display: flex;
        gap: 14px;
        align-items: flex-start;

        .header-icon {
          font-size: 1.8rem;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--color-surface-subtle);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        h2 {
          font-size: 1.25rem;
          margin-bottom: 2px;
        }

        p {
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }
      }
    }

    /* Language choices */
    .language-choices {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;

      @media (min-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .lang-box {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      background: var(--color-surface-subtle);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      text-align: start;
      transition: all 0.2s;

      .flag {
        font-size: 2rem;
      }

      .lang-meta {
        flex: 1;
        display: flex;
        flex-direction: column;

        strong {
          font-size: 1rem;
          color: var(--color-text-main);
        }

        small {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }
      }

      .check-mark {
        font-size: 1.25rem;
        font-weight: 800;
        color: var(--color-primary);
      }

      &.active {
        background: #fff;
        border-color: var(--color-primary);
        box-shadow: 0 4px 12px rgba(179, 107, 92, 0.12);
      }

      &:hover:not(.active) {
        border-color: var(--color-border-strong);
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
    }

    /* PWA */
    .pwa-actions-row {
      display: flex;
      align-items: center;

      .pwa-hint {
        font-size: 0.88rem;
        color: var(--color-text-muted);
      }
    }

    /* Backup */
    .backup-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .file-btn {
        margin: 0;
      }
    }

    .about-card {
      background: var(--color-surface-subtle);
      border: 1px dashed var(--color-border-strong);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: 10px;

      h3 {
        font-size: 1.1rem;
        color: var(--color-primary);
      }

      p {
        font-size: 0.9rem;
        line-height: 1.6;
      }

      .culture-footer {
        font-size: 0.8rem;
        color: var(--color-text-light);
        margin-top: 8px;
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
    this.toast.show(
      lang === 'ar' ? 'تم تفعيل اللغة العربية (RTL) ✨' : 'Langue française activée (LTR) ✨'
    );
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
      'darna_lang_pref'
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
