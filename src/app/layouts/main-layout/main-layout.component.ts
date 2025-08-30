import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService, ThemeService, LoadingService } from '../../core/services';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink, 
    ToastComponent, 
    LoadingSpinnerComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Logo -->
            <div class="flex items-center gap-4">
              <a routerLink="/" class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-sm">SM</span>
                </div>
                <span class="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  ServiMatch
                </span>
              </a>
            </div>
            
            <!-- Navigation -->
            <nav class="hidden md:flex items-center space-x-6">
              <a 
                routerLink="/services" 
                class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Serviços
              </a>
              <a 
                routerLink="/providers" 
                class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Profissionais
              </a>
              <a 
                routerLink="/how-it-works" 
                class="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                Como Funciona
              </a>
            </nav>
            
            <!-- Right Side -->
            <div class="flex items-center gap-4">
              <!-- Theme Toggle -->
              <button
                (click)="toggleTheme()"
                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                [title]="'Alternar tema para ' + getNextThemeLabel()"
              >
                @switch (currentTheme()) {
                  @case ('light') {
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  }
                  @case ('dark') {
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                    </svg>
                  }
                  @default {
                    <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  }
                }
              </button>
              
              @if (isAuthenticated()) {
                <!-- User Menu -->
                <div class="relative">
                  <button class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div class="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-medium">
                        {{ getUserInitials() }}
                      </span>
                    </div>
                    <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                      {{ currentUser()?.name }}
                    </span>
                  </button>
                </div>
                
                <button
                  (click)="logout()"
                  class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Sair
                </button>
              } @else {
                <!-- Auth Buttons -->
                <a
                  routerLink="/auth/login"
                  class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Entrar
                </a>
                <a
                  routerLink="/auth/register"
                  class="px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Registar
                </a>
              }
            </div>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="flex-1">
        <router-outlet />
      </main>
      
      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="col-span-1 md:col-span-2">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-sm">SM</span>
                </div>
                <span class="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  ServiMatch
                </span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                Conectamos-lhe aos melhores profissionais da sua região com ajuda de inteligência artificial.
              </p>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Serviços</h3>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Limpeza</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Manutenção</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Beleza</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Saúde</a></li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Empresa</h3>
              <ul class="space-y-2 text-sm">
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Sobre Nós</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Contacto</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Política de Privacidade</a></li>
                <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">Termos de Uso</a></li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
            <p class="text-center text-sm text-gray-600 dark:text-gray-400">
              © 2024 ServiMatch. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
    
    <!-- Global Components -->
    <app-toast />
    
    @if (isLoading()) {
      <app-loading-spinner 
        [overlay]="true" 
        size="lg" 
        text="A carregar..."
        color="primary"
      />
    }
  `
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private loadingService = inject(LoadingService);
  private router = inject(Router);
  
  isAuthenticated = computed(() => this.authService.isAuthenticated());
  currentUser = computed(() => this.authService.currentUser());
  currentTheme = computed(() => this.themeService.theme());
  isLoading = computed(() => this.loadingService.isLoading());
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  
  getNextThemeLabel(): string {
    const current = this.currentTheme();
    switch (current) {
      case 'light': return 'escuro';
      case 'dark': return 'sistema';
      default: return 'claro';
    }
  }
  
  getUserInitials(): string {
    const user = this.currentUser();
    if (!user?.name) return '?';
    
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  
  logout() {
    this.authService.logout();
  }
}