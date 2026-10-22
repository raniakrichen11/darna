import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  icon?: string;
  type?: 'success' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly currentToast = signal<ToastMessage | null>(null);
  private timeoutId: any = null;

  show(text: string, icon: string = '✓', durationMs: number = 2800): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.currentToast.set({
      id: Date.now(),
      text,
      icon,
      type: 'success'
    });

    this.timeoutId = setTimeout(() => {
      this.currentToast.set(null);
      this.timeoutId = null;
    }, durationMs);
  }

  hide(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.currentToast.set(null);
  }
}
