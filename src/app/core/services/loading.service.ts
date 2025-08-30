import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _activeRequests = signal<number>(0);
  
  readonly isLoading = computed(() => this._activeRequests() > 0);
  readonly activeRequests = computed(() => this._activeRequests());
  
  show() {
    this._activeRequests.update(count => count + 1);
  }
  
  hide() {
    this._activeRequests.update(count => Math.max(0, count - 1));
  }
  
  reset() {
    this._activeRequests.set(0);
  }
}