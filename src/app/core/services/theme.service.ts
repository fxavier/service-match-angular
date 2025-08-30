import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private readonly THEME_KEY = 'servimatch-theme';
  
  private _theme = signal<Theme>('system');
  private _isDarkMode = signal<boolean>(false);
  
  readonly theme = computed(() => this._theme());
  readonly isDarkMode = computed(() => this._isDarkMode());
  
  initTheme() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('system');
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this._theme() === 'system') {
          this.updateDarkMode();
        }
      });
  }
  
  setTheme(theme: Theme) {
    this._theme.set(theme);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.THEME_KEY, theme);
      this.updateDarkMode();
    }
  }
  
  toggleTheme() {
    const current = this._theme();
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('system');
    } else {
      this.setTheme('light');
    }
  }
  
  private updateDarkMode() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const theme = this._theme();
    let isDark = false;
    
    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    this._isDarkMode.set(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}