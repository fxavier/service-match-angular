import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg">SM</span>
            </div>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            Bem-vindo de volta
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Faça login na sua conta ServiMatch
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="seu@email.com"
              />
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  E-mail é obrigatório e deve ser válido
                </p>
              }
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Palavra-passe
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="A sua palavra-passe"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Palavra-passe é obrigatória e deve ter pelo menos 6 caracteres
                </p>
              }
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label for="remember" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Lembrar de mim
                </label>
              </div>
              
              <a href="#" class="text-sm text-primary-600 hover:text-primary-500">
                Esqueceu a palavra-passe?
              </a>
            </div>
            
            <button
              type="submit"
              [disabled]="loginForm.invalid || loading()"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-primary hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              } @else {
                Entrar
              }
            </button>
          </form>
          
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Não tem uma conta?
                </span>
              </div>
            </div>
            
            <div class="mt-6">
              <a
                routerLink="/auth/register"
                class="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Criar nova conta
              </a>
            </div>
          </div>
          
          <!-- Demo Credentials -->
          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Credenciais de demonstração:
            </h4>
            <div class="text-xs text-blue-700 dark:text-blue-200 space-y-1">
              <p><strong>Admin:</strong> admin&#64;servimatch.com / admin123</p>
              <p><strong>Cliente:</strong> cliente&#64;example.com / cliente123</p>
              <p><strong>Prestador:</strong> prestador&#64;example.com / prestador123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  
  loading = signal(false);
  
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    
    const credentials = this.loginForm.value;
    
    this.authService.login(credentials).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.toastService.showSuccess(`Bem-vindo, ${user.name}!`);
        
        // The AuthService now handles redirection based on role
        // Only use returnUrl if specified
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          this.router.navigate([returnUrl]);
        }
        // Otherwise, let AuthService handle the redirection
      },
      error: (error) => {
        this.loading.set(false);
        this.toastService.showError(error.message || 'Erro ao fazer login');
      }
    });
  }
}