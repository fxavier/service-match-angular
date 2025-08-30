import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  
  readonly toasts = computed(() => this._toasts());
  
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  private addToast(toast: Omit<Toast, 'id'>): string {
    const id = this.generateId();
    const newToast: Toast = {
      id,
      duration: 5000,
      dismissible: true,
      ...toast
    };
    
    this._toasts.update(toasts => [...toasts, newToast]);
    
    // Auto dismiss
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.duration);
    }
    
    return id;
  }
  
  showSuccess(message: string, title?: string, duration?: number): string {
    return this.addToast({
      type: 'success',
      message,
      title,
      duration
    });
  }
  
  showError(message: string, title?: string, duration?: number): string {
    return this.addToast({
      type: 'error',
      message,
      title,
      duration: duration || 7000 // Errors stay longer
    });
  }
  
  showWarning(message: string, title?: string, duration?: number): string {
    return this.addToast({
      type: 'warning',
      message,
      title,
      duration
    });
  }
  
  showInfo(message: string, title?: string, duration?: number): string {
    return this.addToast({
      type: 'info',
      message,
      title,
      duration
    });
  }
  
  dismiss(id: string) {
    this._toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }
  
  dismissAll() {
    this._toasts.set([]);
  }
}