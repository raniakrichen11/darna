import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  readonly isOnline = signal<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  readonly canInstall = signal<boolean>(false);
  readonly isInstalled = signal<boolean>(false);

  private deferredPrompt: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.isOnline.set(true));
      window.addEventListener('offline', () => this.isOnline.set(false));

      window.addEventListener('beforeinstallprompt', (e: Event) => {
        // Prevent default mini-infobar
        e.preventDefault();
        this.deferredPrompt = e;
        this.canInstall.set(true);
      });

      window.addEventListener('appinstalled', () => {
        this.canInstall.set(false);
        this.isInstalled.set(true);
        this.deferredPrompt = null;
      });

      // Check if running in standalone mode (installed)
      if (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      ) {
        this.isInstalled.set(true);
      }
    }
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }
    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    this.deferredPrompt = null;
    this.canInstall.set(false);
    return outcome === 'accepted';
  }
}
