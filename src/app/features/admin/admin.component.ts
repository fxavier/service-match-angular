import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CatalogService } from '../../core/services';
import { Category, ServiceItem, Provider } from '../../core/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Administrativo
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gerencie categorias, serviços e prestadores da plataforma
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5m14 14H5"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Categorias</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ categories().length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg class="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Serviços</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ services().length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Prestadores</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ providers().length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <svg class="w-6 h-6 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Avaliações</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalReviews() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Categories Management -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Categorias</h2>
              <button 
                (click)="showCategoryForm = true"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Adicionar
              </button>
            </div>
            
            <div class="space-y-3 max-h-64 overflow-y-auto">
              @for (category of categories(); track category.id) {
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 class="font-medium text-gray-900 dark:text-white">{{ category.name }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.description }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      (click)="editCategory(category)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      (click)="deleteCategory(category.id)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Services Management -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Serviços</h2>
              <button 
                (click)="showServiceForm = true"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Adicionar
              </button>
            </div>
            
            <div class="space-y-3 max-h-64 overflow-y-auto">
              @for (service of services().slice(0, 5); track service.id) {
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900 dark:text-white">{{ service.title }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">€{{ service.price }}</p>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      (click)="editService(service)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      (click)="deleteService(service.id)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Providers Management -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Prestadores</h2>
              <button 
                (click)="showProviderForm = true"
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                Adicionar
              </button>
            </div>
            
            <div class="space-y-3 max-h-64 overflow-y-auto">
              @for (provider of providers().slice(0, 5); track provider.id) {
                <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <img [src]="provider.avatar" [alt]="provider.name" class="w-8 h-8 rounded-full">
                    <div>
                      <h3 class="font-medium text-gray-900 dark:text-white">{{ provider.name }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ provider.rating }} ⭐</p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      (click)="editProvider(provider)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button 
                      (click)="deleteProvider(provider.id)"
                      class="text-red-600 hover:text-red-800 dark:text-red-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Category Form Modal -->
      @if (showCategoryForm) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ editingCategory ? 'Editar' : 'Adicionar' }} Categoria
                </h3>
                <button (click)="closeCategoryForm()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form (ngSubmit)="saveCategory()" #categoryForm="ngForm" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                  <input 
                    [(ngModel)]="categoryFormData.name" 
                    name="categoryName"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                  <textarea 
                    [(ngModel)]="categoryFormData.description"
                    name="categoryDescription"
                    required
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ícone</label>
                  <select 
                    [(ngModel)]="categoryFormData.icon"
                    name="categoryIcon"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    <option value="sparkles">Sparkles (Limpeza)</option>
                    <option value="wrench">Wrench (Manutenção)</option>
                    <option value="sparkle">Sparkle (Beleza)</option>
                    <option value="heart">Heart (Saúde)</option>
                    <option value="laptop">Laptop (Tecnologia)</option>
                    <option value="graduation-cap">Graduation Cap (Educação)</option>
                    <option value="car">Car (Transporte)</option>
                    <option value="calendar">Calendar (Eventos)</option>
                  </select>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    (click)="closeCategoryForm()"
                    class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    [disabled]="!categoryForm.valid"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors">
                    {{ editingCategory ? 'Atualizar' : 'Criar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }

      <!-- Service Form Modal -->
      @if (showServiceForm) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ editingService ? 'Editar' : 'Adicionar' }} Serviço
                </h3>
                <button (click)="closeServiceForm()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form (ngSubmit)="saveService()" #serviceForm="ngForm" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
                  <input 
                    [(ngModel)]="serviceFormData.title" 
                    name="serviceTitle"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
                  <select 
                    [(ngModel)]="serviceFormData.categoryId"
                    name="serviceCategoryId"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white">
                    @for (category of categories(); track category.id) {
                      <option [value]="category.id">{{ category.name }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
                  <textarea 
                    [(ngModel)]="serviceFormData.description"
                    name="serviceDescription"
                    required
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preço (€)</label>
                    <input 
                      [(ngModel)]="serviceFormData.price" 
                      name="servicePrice"
                      type="number"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duração (min)</label>
                    <input 
                      [(ngModel)]="serviceFormData.duration" 
                      name="serviceDuration"
                      type="number"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unidade</label>
                    <select 
                      [(ngModel)]="serviceFormData.priceUnit"
                      name="servicePriceUnit"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white">
                      <option value="hour">Por Hora</option>
                      <option value="project">Por Projeto</option>
                      <option value="visit">Por Visita</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prestador</label>
                  <select 
                    [(ngModel)]="serviceFormData.providerId"
                    name="serviceProviderId"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white">
                    @for (provider of providers(); track provider.id) {
                      <option [value]="provider.id">{{ provider.name }}</option>
                    }
                  </select>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    (click)="closeServiceForm()"
                    class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    [disabled]="!serviceForm.valid"
                    class="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors">
                    {{ editingService ? 'Atualizar' : 'Criar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }

      <!-- Provider Form Modal -->
      @if (showProviderForm) {
        <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ editingProvider ? 'Editar' : 'Adicionar' }} Prestador
                </h3>
                <button (click)="closeProviderForm()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form (ngSubmit)="saveProvider()" #providerForm="ngForm" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                  <input 
                    [(ngModel)]="providerFormData.name" 
                    name="providerName"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input 
                    [(ngModel)]="providerFormData.email" 
                    name="providerEmail"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefone</label>
                  <input 
                    [(ngModel)]="providerFormData.phone" 
                    name="providerPhone"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Biografia</label>
                  <textarea 
                    [(ngModel)]="providerFormData.bio"
                    name="providerBio"
                    required
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cidade</label>
                    <input 
                      [(ngModel)]="providerFormData.city" 
                      name="providerCity"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bairro</label>
                    <input 
                      [(ngModel)]="providerFormData.neighborhood" 
                      name="providerNeighborhood"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                  </div>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    (click)="closeProviderForm()"
                    class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    [disabled]="!providerForm.valid"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors">
                    {{ editingProvider ? 'Atualizar' : 'Criar' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private http = inject(HttpClient);

  categories = signal<Category[]>([]);
  services = signal<ServiceItem[]>([]);
  providers = signal<Provider[]>([]);

  // Form visibility
  showCategoryForm = false;
  showServiceForm = false; 
  showProviderForm = false;

  // Editing states
  editingCategory: Category | null = null;
  editingService: ServiceItem | null = null;
  editingProvider: Provider | null = null;

  // Form data
  categoryFormData = { name: '', description: '', icon: 'sparkles' };
  serviceFormData = { 
    title: '', 
    categoryId: '', 
    description: '', 
    price: 0, 
    duration: 60,
    providerId: '',
    priceUnit: 'visit' as 'hour' | 'project' | 'visit'
  };
  providerFormData = {
    name: '',
    email: '',
    phone: '',
    bio: '',
    city: '',
    neighborhood: ''
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Load categories from signal
    this.categories.set(this.catalogService.categories());

    // Load services from signal  
    this.services.set(this.catalogService.services());

    // Load providers via HTTP
    this.http.get<Provider[]>('assets/data/providers.json').subscribe(providers => {
      this.providers.set(providers);
    });
  }

  totalReviews() {
    return this.services().reduce((total, service) => total + service.reviewsCount, 0);
  }

  // Category methods
  editCategory(category: Category) {
    this.editingCategory = category;
    this.categoryFormData = { 
      name: category.name, 
      description: category.description || '',
      icon: category.icon 
    };
    this.showCategoryForm = true;
  }

  deleteCategory(id: string) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      const updated = this.categories().filter(c => c.id !== id);
      this.categories.set(updated);
    }
  }

  saveCategory() {
    if (this.editingCategory) {
      // Update existing
      const updated = this.categories().map(c => 
        c.id === this.editingCategory!.id 
          ? { ...this.editingCategory!, ...this.categoryFormData }
          : c
      );
      this.categories.set(updated);
    } else {
      // Create new
      const newId = (this.categories().length + 1).toString();
      const newCategory: Category = {
        id: newId,
        ...this.categoryFormData
      };
      this.categories.set([...this.categories(), newCategory]);
    }
    this.closeCategoryForm();
  }

  closeCategoryForm() {
    this.showCategoryForm = false;
    this.editingCategory = null;
    this.categoryFormData = { name: '', description: '', icon: 'sparkles' };
  }

  // Service methods
  editService(service: ServiceItem) {
    this.editingService = service;
    this.serviceFormData = {
      title: service.title,
      categoryId: service.categoryId,
      description: service.description,
      price: service.price,
      duration: service.duration || 60,
      providerId: service.providerId,
      priceUnit: service.priceUnit
    };
    this.showServiceForm = true;
  }

  deleteService(id: string) {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      const updated = this.services().filter(s => s.id !== id);
      this.services.set(updated);
    }
  }

  saveService() {
    if (this.editingService) {
      // Update existing
      const updated = this.services().map(s => 
        s.id === this.editingService!.id 
          ? { ...this.editingService!, ...this.serviceFormData, updatedAt: new Date().toISOString() }
          : s
      );
      this.services.set(updated);
    } else {
      // Create new
      const newId = (this.services().length + 1).toString();
      const newService: ServiceItem = {
        id: newId,
        ...this.serviceFormData,
        rating: 0,
        reviewsCount: 0,
        distanceKm: Math.random() * 10,
        images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=600&h=400'],
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.services.set([...this.services(), newService]);
    }
    this.closeServiceForm();
  }

  closeServiceForm() {
    this.showServiceForm = false;
    this.editingService = null;
    this.serviceFormData = { 
      title: '', 
      categoryId: '', 
      description: '', 
      price: 0, 
      duration: 60,
      providerId: '',
      priceUnit: 'visit' as 'hour' | 'project' | 'visit'
    };
  }

  // Provider methods
  editProvider(provider: Provider) {
    this.editingProvider = provider;
    this.providerFormData = {
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      bio: provider.bio,
      city: provider.city,
      neighborhood: provider.neighborhood
    };
    this.showProviderForm = true;
  }

  deleteProvider(id: string) {
    if (confirm('Tem certeza que deseja excluir este prestador?')) {
      const updated = this.providers().filter(p => p.id !== id);
      this.providers.set(updated);
    }
  }

  saveProvider() {
    if (this.editingProvider) {
      // Update existing
      const updated = this.providers().map(p => 
        p.id === this.editingProvider!.id 
          ? { ...this.editingProvider!, ...this.providerFormData }
          : p
      );
      this.providers.set(updated);
    } else {
      // Create new
      const newId = (this.providers().length + 1).toString();
      const newProvider: Provider = {
        id: newId,
        ...this.providerFormData,
        avatar: `https://i.pravatar.cc/150?img=${newId}`,
        rating: 0,
        reviewsCount: 0,
        completedJobs: 0,
        responseTime: '1 hora',
        skills: [],
        portfolio: [],
        certifications: [],
        verified: false,
        memberSince: new Date().toISOString().split('T')[0]
      };
      this.providers.set([...this.providers(), newProvider]);
    }
    this.closeProviderForm();
  }

  closeProviderForm() {
    this.showProviderForm = false;
    this.editingProvider = null;
    this.providerFormData = {
      name: '',
      email: '',
      phone: '',
      bio: '',
      city: '',
      neighborhood: ''
    };
  }
}