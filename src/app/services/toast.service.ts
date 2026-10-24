import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  icon?: string;
  type?: 'success' | 'info' | 'warning';
  actionLabel?: string;
  onAction?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly currentToast = signal<ToastMessage | null>(null);
  private timeoutId: any = null;

  show(
    text: string,
    icon: string = '✓',
    durationMs: number = 3200,
    action?: { label: string; onAction: () => void }
  ): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.currentToast.set({
      id: Date.now(),
      text,
      icon,
      type: 'success',
      actionLabel: action?.label,
      onAction: action?.onAction
    });

    this.timeoutId = setTimeout(() => {
      this.currentToast.set(null);
      this.timeoutId = null;
    }, durationMs);
  }

  triggerAction(): void {
    const toast = this.currentToast();
    if (toast?.onAction) {
      toast.onAction();
    }
    this.hide();
  }

  hide(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.currentToast.set(null);
  }
}

