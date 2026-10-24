import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PreferencesService } from '../../services/preferences.service';
import { I18nService } from '../../services/i18n.service';
import { ToastService } from '../../services/toast.service';
import { AppLanguage } from '../../models/user-preferences.model';

@Component({
  selector: 'app-onboarding-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" [attr.dir]="i18n.dir()">
      <div class="modal-card onboarding-card text-center" (click)="$event.stopPropagation()">
        <!-- Header Emblem & Stepper -->
        <div class="onboarding-header">
          <div class="brand-emblem-wrap">
            <svg viewBox="0 0 100 100" fill="none" class="brand-arch-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M 22 84 L 22 56 C 22 36, 34 20, 50 12 C 66 20, 78 36, 78 56 L 78 84 L 70 84 L 70 56 C 70 39, 60 26, 50 20 C 40 26, 30 39, 30 56 L 30 84 Z" fill="currentColor" />
              <path d="M 36 84 L 36 52 C 36 45, 41 40, 47 40 C 47.5 40, 48 40.5, 48 41 L 48 84 Z" fill="currentColor" />
              <path d="M 48 70 Q 52 58, 62 48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              <path d="M 58 46 C 60 38, 68 36, 72 38 C 70 45, 63 48, 58 46 Z" fill="currentColor" />
            </svg>
          </div>

          <div class="step-indicator-row">
            <span class="step-dot" [class.active]="step === 1" [class.done]="step > 1"></span>
            <span class="step-line" [class.done]="step > 1"></span>
            <span class="step-dot" [class.active]="step === 2" [class.done]="step > 2"></span>
            <span class="step-line" [class.done]="step > 2"></span>
            <span class="step-dot" [class.active]="step === 3"></span>
          </div>
        </div>

        <!-- STEP 1: Language & Names -->
        @if (step === 1) {
          <div class="step-content">
            <h2 class="step-title">
              {{ i18n.currentLang() === 'ar' ? 'مرحباً بكِ في دارنا 🕊️' : (i18n.currentLang() === 'en' ? 'Welcome to Darna 🕊️' : 'Bienvenue sur Darna 🕊️') }}
            </h2>
            <p class="step-subtitle">
              {{ i18n.currentLang() === 'ar' ? 'رفيقكِ الأمثل لإعداد جهاز العروس وتأثيث بيتك الجديد بكل هدوء.' : (i18n.currentLang() === 'en' ? 'Your serene companion to plan your bridal trousseau and furnish your future home.' : 'Le planificateur d’exception pour préparer votre trousseau et votre nouveau foyer avec sérénité.') }}
            </p>

            <!-- Language Buttons -->
            <div class="lang-selection-grid">
              <button
                type="button"
                class="lang-choice-card"
                [class.selected]="selectedLang === 'fr'"
                (click)="onChooseLanguage('fr')"
              >
                <span class="flag-icon">🇫🇷</span>
                <span class="lang-name">Français</span>
              </button>

              <button
                type="button"
                class="lang-choice-card"
                [class.selected]="selectedLang === 'ar'"
                (click)="onChooseLanguage('ar')"
              >
                <span class="flag-icon">🇹🇳</span>
                <span class="lang-name">العربية (تونس)</span>
              </button>

              <button
                type="button"
                class="lang-choice-card"
                [class.selected]="selectedLang === 'en'"
                (click)="onChooseLanguage('en')"
              >
                <span class="flag-icon">🇬🇧</span>
                <span class="lang-name">English</span>
              </button>
            </div>

            <!-- Optional Names -->
            <div class="form-section-boxed">
              <div class="form-row-duo">
                <div class="field-item">
                  <label for="onboardingBride">{{ i18n.currentLang() === 'ar' ? 'اسم العروس (اختياري)' : 'Prénom de la mariée (optionnel)' }}</label>
                  <input
                    id="onboardingBride"
                    type="text"
                    [(ngModel)]="brideName"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'مثال: مريم' : 'Ex: Mariem, Yasmine...'"
                    class="input-custom"
                  />
                </div>
                <div class="field-item">
                  <label for="onboardingGroom">{{ i18n.currentLang() === 'ar' ? 'اسم الخطيب / الزوج (اختياري)' : 'Prénom du conjoint (optionnel)' }}</label>
                  <input
                    id="onboardingGroom"
                    type="text"
                    [(ngModel)]="groomName"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'مثال: أحمد' : 'Ex: Ahmed, Mehdi...'"
                    class="input-custom"
                  />
                </div>
              </div>
            </div>

            <div class="step-footer-actions">
              <button type="button" class="btn btn-primary btn-block" (click)="goToStep(2)">
                <span>{{ i18n.currentLang() === 'ar' ? 'متابعة' : 'Continuer' }}</span>
                <span>{{ i18n.isRtl() ? '←' : '→' }}</span>
              </button>
            </div>
          </div>
        }

        <!-- STEP 2: Wedding Date & Future Home -->
        @if (step === 2) {
          <div class="step-content">
            <h2 class="step-title">
              {{ i18n.currentLang() === 'ar' ? 'موعد الزفاف والبيت الجديد 🏡' : 'Votre Date & Votre Futur Foyer 🏡' }}
            </h2>
            <p class="step-subtitle">
              {{ i18n.currentLang() === 'ar' ? 'يساعدنا ذلك في ترتيب جدول المشتريات وتذكيرك بالأولويات.' : 'Pour organiser votre rétro-planning et vous suggérer les bons achats au bon moment.' }}
            </p>

            <div class="form-section-boxed">
              <div class="field-item mb-3">
                <label for="onboardingDate">{{ i18n.currentLang() === 'ar' ? 'تاريخ الزفاف أو الانتقال (اختياري)' : 'Date du mariage ou emménagement (optionnelle)' }}</label>
                <input
                  id="onboardingDate"
                  type="date"
                  [(ngModel)]="weddingDate"
                  class="input-custom"
                />
              </div>

              <div class="field-item mb-3">
                <label>{{ i18n.currentLang() === 'ar' ? 'نوع السكن' : 'Type de logement' }}</label>
                <div class="pill-options-grid">
                  <button
                    type="button"
                    class="pill-option"
                    [class.active]="homeType === 'apartment'"
                    (click)="homeType = 'apartment'"
                  >
                    🏢 {{ i18n.currentLang() === 'ar' ? 'شقة' : 'Appartement' }}
                  </button>
                  <button
                    type="button"
                    class="pill-option"
                    [class.active]="homeType === 'house'"
                    (click)="homeType = 'house'"
                  >
                    🏡 {{ i18n.currentLang() === 'ar' ? 'منزل مستقل' : 'Maison' }}
                  </button>
                  <button
                    type="button"
                    class="pill-option"
                    [class.active]="homeType === 'villa'"
                    (click)="homeType = 'villa'"
                  >
                    🏛️ {{ i18n.currentLang() === 'ar' ? 'فيلا' : 'Villa' }}
                  </button>
                </div>
              </div>

              <div class="field-item">
                <label>{{ i18n.currentLang() === 'ar' ? 'عدد الغرف الرئيسية' : 'Nombre de pièces' }}</label>
                <div class="pill-options-grid">
                  <button
                    type="button"
                    class="pill-option"
                    [class.active]="roomCount === 2"
                    (click)="roomCount = 2"
                  >
                    S+1 (2)
                  </button>
                  <button
                    type="button"
                    class="pill-option"
                    [class.active]="roomCount === 3"
                    (click)="roomCount = 3"
                  >
                    S+2 (3)
                  </button>
                  <button
                    type="button"
                    class="pill-option"
                    [class.active]="roomCount === 4"
                    (click)="roomCount = 4"
                  >
                    S+3+ (4+)
                  </button>
                </div>
              </div>
            </div>

            <div class="step-footer-actions">
              <button type="button" class="btn btn-outline" (click)="goToStep(1)">
                <span>{{ i18n.isRtl() ? '→' : '←' }}</span>
                <span>{{ i18n.currentLang() === 'ar' ? 'السابق' : 'Retour' }}</span>
              </button>
              <button type="button" class="btn btn-primary" (click)="goToStep(3)">
                <span>{{ i18n.currentLang() === 'ar' ? 'متابعة' : 'Continuer' }}</span>
                <span>{{ i18n.isRtl() ? '←' : '→' }}</span>
              </button>
            </div>
          </div>
        }

        <!-- STEP 3: Budget & Pace -->
        @if (step === 3) {
          <div class="step-content">
            <h2 class="step-title">
              {{ i18n.currentLang() === 'ar' ? 'سقف الميزانية ووتيرة التجهيز 🎯' : 'Budget Cible & Rythme 🎯' }}
            </h2>
            <p class="step-subtitle">
              {{ i18n.currentLang() === 'ar' ? 'حددي ميزانيتكِ الإجمالية بالدينار التونسي لتفادي المصاريف غير المدروسة.' : 'Fixez un repère en Dinars Tunisiens (TND) pour garder le contrôle de vos dépenses.' }}
            </p>

            <div class="form-section-boxed">
              <div class="field-item mb-3">
                <label for="onboardingBudget">{{ i18n.currentLang() === 'ar' ? 'الميزانية المستهدفة (دينار تونسي)' : 'Budget global indicatif (en DT)' }}</label>
                <div class="input-with-currency">
                  <input
                    id="onboardingBudget"
                    type="number"
                    min="0"
                    step="100"
                    [(ngModel)]="totalBudget"
                    [placeholder]="i18n.currentLang() === 'ar' ? 'مثال: 15000' : 'Ex: 15000'"
                    class="input-custom"
                  />
                  <span class="currency-badge">{{ i18n.currency() }}</span>
                </div>
              </div>

              <!-- Quick Budget Presets -->
              <div class="budget-presets-row">
                <button type="button" class="preset-btn" (click)="totalBudget = 8000">8 000 {{ i18n.currency() }}</button>
                <button type="button" class="preset-btn" (click)="totalBudget = 15000">15 000 {{ i18n.currency() }}</button>
                <button type="button" class="preset-btn" (click)="totalBudget = 25000">25 000 {{ i18n.currency() }}</button>
              </div>

              <div class="field-item mt-3">
                <label>{{ i18n.currentLang() === 'ar' ? 'وتيرة التجهيز المفضلة' : 'Rythme de préparation' }}</label>
                <div class="pill-options-grid">
                  <button
                    type="button"
                    class="pill-option"
                    [class.active]="pacePreference === 'relaxed'"
                    (click)="pacePreference = 'relaxed'"
                  >
                    🕊️ {{ i18n.currentLang() === 'ar' ? 'هادئة (على مهل)' : 'Serein (à son rythme)' }}
                  </button>
                  <button
                    type="button"
                    class="pill-option"
                    [class.active]="pacePreference === 'moderate'"
                    (click)="pacePreference = 'moderate'"
                  >
                    ⚖️ {{ i18n.currentLang() === 'ar' ? 'متوازنة' : 'Équilibré' }}
                  </button>
                  <button
                    type="button"
                    class="pill-option"
                    [class.active]="pacePreference === 'express'"
                    (click)="pacePreference = 'express'"
                  >
                    ⚡ {{ i18n.currentLang() === 'ar' ? 'سريعة ومكثفة' : 'Express' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="step-footer-actions">
              <button type="button" class="btn btn-outline" (click)="goToStep(2)">
                <span>{{ i18n.isRtl() ? '→' : '←' }}</span>
                <span>{{ i18n.currentLang() === 'ar' ? 'السابق' : 'Retour' }}</span>
              </button>
              <button type="button" class="btn btn-primary" (click)="finishOnboarding()">
                ✨ {{ i18n.currentLang() === 'ar' ? 'اكتشاف تروستكِ والبدء' : 'Découvrir mon trousseau' }}
              </button>
            </div>
          </div>
        }

        <!-- Bottom Skip Link -->
        <div class="skip-link-container">
          <button type="button" class="skip-btn" (click)="skipOnboarding()">
            {{ i18n.currentLang() === 'ar' ? 'تخطي والبدء مباشرة ←' : 'Passer et explorer directement →' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-card {
      max-width: 580px;
      width: 92%;
      padding: 32px 28px;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--color-border);
      animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .onboarding-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .brand-emblem-wrap {
      width: 48px;
      height: 48px;
      color: var(--color-primary);
    }

    .brand-arch-svg {
      width: 100%;
      height: 100%;
    }

    .step-indicator-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .step-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-border);
      transition: all 0.3s ease;

      &.active {
        background: var(--color-primary);
        transform: scale(1.25);
      }

      &.done {
        background: var(--color-success);
      }
    }

    .step-line {
      width: 32px;
      height: 2px;
      background: var(--color-border);
      transition: background 0.3s ease;

      &.done {
        background: var(--color-success);
      }
    }

    .step-title {
      font-family: var(--font-serif);
      font-size: 1.55rem;
      color: var(--color-text-main);
      margin-bottom: 8px;
      line-height: 1.25;
    }

    .step-subtitle {
      font-size: 0.9rem;
      color: var(--color-text-muted);
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .lang-selection-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }

    .lang-choice-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px 10px;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      cursor: pointer;
      transition: all 0.2s ease;

      .flag-icon {
        font-size: 1.6rem;
      }

      .lang-name {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--color-text-main);
      }

      &:hover {
        border-color: var(--color-primary);
        background: var(--color-surface-hover);
      }

      &.selected {
        border-color: var(--color-primary);
        background: var(--color-primary-light);
        box-shadow: 0 0 0 2px var(--color-primary);
      }
    }

    .form-section-boxed {
      background: var(--color-surface-subtle);
      border: 1px solid var(--color-border-subtle);
      border-radius: var(--radius-md);
      padding: 18px 16px;
      text-align: start;
      margin-bottom: 24px;
    }

    .form-row-duo {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;

      @media (min-width: 520px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .field-item {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.78rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--color-text-muted);
      }
    }

    .input-custom {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      font-family: inherit;
      font-size: 0.95rem;
      color: var(--color-text-main);
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px rgba(113, 59, 72, 0.12);
      }
    }

    .pill-options-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .pill-option {
      flex: 1;
      min-width: 80px;
      padding: 8px 12px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      background: var(--color-surface);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        border-color: var(--color-primary);
        color: var(--color-text-main);
      }

      &.active {
        background: var(--color-primary);
        color: #FFFFFF;
        border-color: var(--color-primary);
      }
    }

    .input-with-currency {
      position: relative;
      display: flex;
      align-items: center;

      input {
        padding-inline-end: 48px;
      }

      .currency-badge {
        position: absolute;
        inset-inline-end: 12px;
        font-size: 0.82rem;
        font-weight: 700;
        color: var(--color-text-muted);
      }
    }

    .budget-presets-row {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .preset-btn {
      flex: 1;
      padding: 5px 8px;
      border: 1px dashed var(--color-border-strong);
      border-radius: var(--radius-sm);
      background: transparent;
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--color-text-muted);
      cursor: pointer;

      &:hover {
        background: var(--color-bg-sand);
        color: var(--color-primary);
        border-color: var(--color-primary);
      }
    }

    .step-footer-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;

      .btn {
        flex: 1;
        justify-content: center;
        padding: 12px 18px;
      }
    }

    .skip-link-container {
      margin-top: 16px;
      text-align: center;
    }

    .skip-btn {
      background: none;
      border: none;
      color: var(--color-text-muted);
      font-size: 0.82rem;
      text-decoration: underline;
      cursor: pointer;
      padding: 4px;

      &:hover {
        color: var(--color-primary);
      }
    }

    @media (max-width: 520px) {
      .onboarding-card {
        padding: 24px 16px;
      }

      .lang-selection-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OnboardingModalComponent {
  @Output() completed = new EventEmitter<void>();

  preferences = inject(PreferencesService);
  i18n = inject(I18nService);
  toast = inject(ToastService);

  step = 1;
  selectedLang: AppLanguage = this.i18n.currentLang();
  brideName = this.preferences.preferences().brideName || '';
  groomName = this.preferences.preferences().groomName || '';
  weddingDate = this.preferences.preferences().weddingDate || '';
  homeType: 'apartment' | 'house' | 'villa' | 'other' = this.preferences.preferences().homeType || 'apartment';
  roomCount: number = this.preferences.preferences().roomCount || 3;
  totalBudget: number | undefined = this.preferences.preferences().totalBudget;
  pacePreference: 'relaxed' | 'moderate' | 'express' = this.preferences.preferences().pacePreference || 'moderate';

  onChooseLanguage(lang: AppLanguage): void {
    this.selectedLang = lang;
    this.i18n.setLanguage(lang);
  }

  goToStep(s: number): void {
    this.step = s;
  }

  finishOnboarding(): void {
    this.preferences.completeOnboarding({
      brideName: this.brideName.trim(),
      groomName: this.groomName.trim(),
      weddingDate: this.weddingDate,
      totalBudget: this.totalBudget && this.totalBudget > 0 ? this.totalBudget : undefined,
      homeType: this.homeType,
      roomCount: this.roomCount,
      pacePreference: this.pacePreference
    });

    const isAr = this.i18n.currentLang() === 'ar';
    this.toast.show(
      isAr ? 'تم حفظ تفضيلاتك وتجهيز قائمتك بنجاح 🕊️' : 'Vos préférences sont enregistrées, bienvenue sur Darna 🕊️'
    );
    this.completed.emit();
  }

  skipOnboarding(): void {
    this.preferences.updatePreferences({
      hasChosenLanguage: true,
      hasCompletedOnboarding: true
    });
    this.completed.emit();
  }
}
