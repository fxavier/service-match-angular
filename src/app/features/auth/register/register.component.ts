import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserRole } from '../../../core/models';

@Component({
  selector: 'app-register',
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
            Criar nova conta
          </h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Junte-se à comunidade ServiMatch
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Seu nome completo"
              />
              @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Nome é obrigatório
                </p>
              }
            </div>
            
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
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  E-mail é obrigatório e deve ser válido
                </p>
              }
            </div>
            
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefone <span class="text-gray-400">(opcional)</span>
              </label>
              <input
                id="phone"
                type="tel"
                formControlName="phone"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de conta
              </label>
              <select
                id="role"
                formControlName="role"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione o tipo de conta</option>
                <option value="customer">Cliente - Contratar serviços</option>
                <option value="provider">Prestador - Oferecer serviços</option>
              </select>
              @if (registerForm.get('role')?.invalid && registerForm.get('role')?.touched) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Tipo de conta é obrigatório
                </p>
              }
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Mínimo 6 caracteres"
              />
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  Senha é obrigatória e deve ter pelo menos 6 caracteres
                </p>
              }
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                placeholder="Confirme sua senha"
              />
              @if (registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched) {
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  As senhas não coincidem
                </p>
              }
            </div>
            
            <div class="flex items-start">
              <input
                id="terms"
                type="checkbox"
                formControlName="terms"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              />
              <label for="terms" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Aceito os
                <a href="#" class="text-primary-600 hover:text-primary-500">Termos de Uso</a>
                e a
                <a href="#" class="text-primary-600 hover:text-primary-500">Política de Privacidade</a>
              </label>
            </div>
            @if (registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched) {
              <p class="text-sm text-red-600 dark:text-red-400">
                Você deve aceitar os termos para continuar
              </p>
            }
            
            <button
              type="submit"
              [disabled]="registerForm.invalid || loading()"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-primary hover:opacity-90 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              @if (loading()) {
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando conta...
              } @else {
                Criar conta
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
                  Já tem uma conta?
                </span>
              </div>
            </div>
            
            <div class="mt-6">
              <a
                routerLink="/auth/login"
                class="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Fazer login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  
  loading = signal(false);
  
  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    role: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  }, {
    validators: this.passwordMatchValidator
  });
  
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }
  
  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    this.loading.set(true);
    
    const formValue = this.registerForm.value;
    const registerData = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      role: formValue.role as UserRole,
      password: formValue.password
    };
    
    this.authService.register(registerData).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.toastService.showSuccess(`Conta criada com sucesso! Bem-vindo, ${user.name}!`);
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.loading.set(false);
        this.toastService.showError(error.message || 'Erro ao criar conta');
      }
    });
  }
}