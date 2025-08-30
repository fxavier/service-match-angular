import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Painel Administrativo
      </h1>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Esta página está em desenvolvimento.
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-500">
          Em breve você poderá acessar o dashboard administrativo.
        </p>
      </div>
    </div>
  `
})
export class AdminComponent {}