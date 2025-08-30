import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../core/services';
import { Category, ServiceItem } from '../../core/models';
import { CategoryIconComponent } from '../../shared/components/category-icon/category-icon.component';
import { ServiceIconComponent } from '../../shared/components/service-icon/service-icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CategoryIconComponent, ServiceIconComponent],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Encontre os melhores
            <span class="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              profissionais
            </span>
            da sua região
          </h1>
          <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Com inteligência artificial, conectamos-lhe aos prestadores de serviços ideais para as suas necessidades
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              routerLink="/services"
              class="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Encontrar Serviços
            </a>
            <a
              routerLink="/auth/register"
              class="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Tornar-se Prestador
            </a>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Categories Section -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-4">
            <span class="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold rounded-full">
              Populares
            </span>
          </div>
          <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Categorias em Destaque
            </span>
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore os serviços mais procurados e bem avaliados na sua região. 
            <span class="font-semibold text-gray-700 dark:text-gray-300">Qualidade garantida</span> 
            em cada categoria.
          </p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          @for (category of categories(); track category.id) {
            <div class="group cursor-pointer transform transition-all duration-300 hover:scale-105">
              <div class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-80">
                <!-- Background Gradient Overlay -->
                <div [class]="getCategoryGradientClass(category.icon)" class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                
                <!-- Large Icon Background -->
                <div class="absolute inset-0 flex items-center justify-center p-4">
                  <div class="relative w-full h-full transform group-hover:-translate-y-2 transition-transform duration-300">
                    <!-- Glow Effect -->
                    <div [class]="getCategoryGlowClass(category.icon)" class="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <!-- Large Icon -->
                    <app-category-icon 
                      [icon]="category.icon"
                      size="full"
                      class="relative z-10 opacity-90"
                    />
                  </div>
                </div>
                
                <!-- Content Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                
                <!-- Text Content -->
                <div class="absolute bottom-0 left-0 right-0 p-6 text-center text-white">
                  <!-- Category Name -->
                  <h3 class="text-2xl font-bold mb-2 drop-shadow-lg">
                    {{ category.name }}
                  </h3>
                  
                  <!-- Description -->
                  <p class="text-sm opacity-90 leading-relaxed mb-4 drop-shadow">
                    {{ category.description }}
                  </p>
                  
                  <!-- Action Indicator -->
                  <div class="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span class="text-xs font-semibold bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                      Explorar
                      <svg class="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                
                <!-- Decorative Elements -->
                <div class="absolute top-4 right-4 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300" [class]="getCategoryGradientClass(category.icon)"></div>
                <div class="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300" [class]="getCategoryGradientClass(category.icon)"></div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
    
    <!-- Featured Services -->
    <section class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Serviços em Destaque
          </h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Os profissionais mais bem avaliados da plataforma
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (service of featuredServices(); track service.id) {
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
              <div class="relative">
                @if (service.id === '1' || service.id === '2' || service.id === '3' || service.id === '5' || service.id === '6') {
                  <!-- Image Carousel for Multiple Featured Services -->
                  <div class="relative overflow-hidden rounded-t-xl">
                    <div 
                      class="flex transition-transform duration-300 ease-in-out"
                      [style.transform]="'translateX(-' + getCurrentImageIndex(service.id) * 100 + '%)'"
                    >
                      @for (image of service.images; track $index) {
                        <img
                          [src]="image"
                          [alt]="service.title + ' - Imagem ' + ($index + 1)"
                          class="w-full h-48 object-cover flex-shrink-0"
                          (error)="onImageError($event)"
                        />
                      }
                    </div>
                    
                    <!-- Navigation Dots -->
                    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      @for (image of service.images; track $index) {
                        <button
                          (click)="setCurrentImage(service.id, $index)"
                          [class]="'w-2 h-2 rounded-full transition-colors ' + (getCurrentImageIndex(service.id) === $index ? 'bg-white' : 'bg-white/50')"
                          [attr.aria-label]="'Ver imagem ' + ($index + 1)"
                        ></button>
                      }
                    </div>
                    
                    <!-- Navigation Arrows -->
                    <button
                      (click)="previousImage(service.id)"
                      class="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                      aria-label="Imagem anterior"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>
                    <button
                      (click)="nextImage(service.id)"
                      class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                      aria-label="Próxima imagem"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>
                } @else {
                  <!-- Single Image for Other Services -->
                  <img
                    [src]="service.images[0]"
                    [alt]="service.title"
                    class="w-full h-48 object-cover rounded-t-xl"
                    (error)="onImageError($event)"
                  />
                }
                
                <div class="absolute top-4 left-4 flex items-center gap-2">
                  <app-service-icon [serviceId]="service.id" size="sm"></app-service-icon>
                  <span class="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                    {{ service.distanceKm }}km
                  </span>
                </div>
                <div class="absolute top-4 right-4">
                  <div class="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                    <span class="text-yellow-500">⭐</span>
                    {{ service.rating }}
                  </div>
                </div>
              </div>
              
              <div class="p-6">
                <h3 class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ service.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {{ service.description }}
                </p>
                
                <div class="flex items-center justify-between mb-4">
                  <div class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ service.price }}€
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      /{{ getPriceUnitLabel(service.priceUnit) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ service.reviewsCount }} avaliações
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-4">
                  @for (tag of service.tags.slice(0, 3); track tag) {
                    <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {{ tag }}
                    </span>
                  }
                </div>
                
                <a
                  [routerLink]="['/services', service.id]"
                  class="w-full block text-center px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Ver Detalhes
                </a>
              </div>
            </div>
          }
        </div>
        
        <div class="text-center mt-12">
          <a
            routerLink="/services"
            class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Ver Todos os Serviços
            <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
    
    <!-- How It Works -->
    <section class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Como Funciona
          </h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Três passos simples para encontrar o profissional ideal
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Descreva sua necessidade
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Conte-nos que tipo de serviço você precisa e onde você está localizado
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Receba recomendações
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Nossa IA analisa e seleciona os melhores profissionais para você
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contrate com segurança
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Compare preços, avaliações e contrate o profissional ideal
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">
          Pronto para encontrar o profissional ideal?
        </h2>
        <p class="text-xl mb-8 text-teal-100">
          Mais de 10.000 profissionais cadastrados em toda a região
        </p>
        <a
          routerLink="/services"
          class="inline-block px-8 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
        >
          Começar Agora
        </a>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private catalogService = inject(CatalogService);
  
  categories = computed(() => this.catalogService.categories().slice(0, 8));
  featuredServices = computed(() => this.catalogService.services().slice(0, 6));
  
  // Image carousel state for cleaning service
  private currentImageIndexes = new Map<string, number>();
  
  ngOnInit() {
    // Services are loaded automatically by CatalogService
    // Initialize carousel for multiple services
    this.currentImageIndexes.set('1', 0); // Cleaning service
    this.currentImageIndexes.set('2', 0); // Maintenance service
    this.currentImageIndexes.set('3', 0); // Beauty service (manicure/pedicure)
    this.currentImageIndexes.set('5', 0); // Computer formatting service
    this.currentImageIndexes.set('6', 0); // English tutoring service
  }
  
  getPriceUnitLabel(unit: string): string {
    const labels: Record<string, string> = {
      'hour': 'hora',
      'project': 'projecto',
      'visit': 'visita'
    };
    return labels[unit] || unit;
  }

  // Image carousel methods
  getCurrentImageIndex(serviceId: string): number {
    return this.currentImageIndexes.get(serviceId) || 0;
  }

  setCurrentImage(serviceId: string, index: number): void {
    this.currentImageIndexes.set(serviceId, index);
  }

  nextImage(serviceId: string): void {
    const service = this.featuredServices().find(s => s.id === serviceId);
    if (service && service.images.length > 0) {
      const currentIndex = this.getCurrentImageIndex(serviceId);
      const nextIndex = (currentIndex + 1) % service.images.length;
      this.setCurrentImage(serviceId, nextIndex);
    }
  }

  previousImage(serviceId: string): void {
    const service = this.featuredServices().find(s => s.id === serviceId);
    if (service && service.images.length > 0) {
      const currentIndex = this.getCurrentImageIndex(serviceId);
      const previousIndex = currentIndex === 0 ? service.images.length - 1 : currentIndex - 1;
      this.setCurrentImage(serviceId, previousIndex);
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Imagem+Indispon%C3%ADvel';
  }

  getCategoryGradientClass(icon: string): string {
    const gradients: Record<string, string> = {
      'sparkles': 'bg-gradient-to-br from-blue-500 to-cyan-500', // Limpeza
      'wrench': 'bg-gradient-to-br from-orange-500 to-red-500', // Manutenção
      'sparkle': 'bg-gradient-to-br from-pink-500 to-rose-500', // Beleza
      'heart': 'bg-gradient-to-br from-red-500 to-pink-500', // Saúde
      'laptop': 'bg-gradient-to-br from-purple-500 to-indigo-500', // Tecnologia
      'graduation-cap': 'bg-gradient-to-br from-green-500 to-emerald-500', // Educação
      'car': 'bg-gradient-to-br from-yellow-500 to-amber-500', // Transporte
      'calendar': 'bg-gradient-to-br from-violet-500 to-purple-500' // Eventos
    };
    return gradients[icon] || 'bg-gradient-to-br from-blue-500 to-purple-500';
  }

  getCategoryGlowClass(icon: string): string {
    const glowColors: Record<string, string> = {
      'sparkles': 'bg-cyan-400', // Limpeza
      'wrench': 'bg-orange-400', // Manutenção
      'sparkle': 'bg-pink-400', // Beleza
      'heart': 'bg-red-400', // Saúde
      'laptop': 'bg-purple-400', // Tecnologia
      'graduation-cap': 'bg-green-400', // Educação
      'car': 'bg-yellow-400', // Transporte
      'calendar': 'bg-violet-400' // Eventos
    };
    return glowColors[icon] || 'bg-blue-400';
  }

  getCategoryTextGradient(icon: string): string {
    const textGradients: Record<string, string> = {
      'sparkles': 'group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-500', // Limpeza
      'wrench': 'group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500', // Manutenção
      'sparkle': 'group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-rose-500', // Beleza
      'heart': 'group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-pink-500', // Saúde
      'laptop': 'group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-indigo-500', // Tecnologia
      'graduation-cap': 'group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-500', // Educação
      'car': 'group-hover:bg-gradient-to-r group-hover:from-yellow-500 group-hover:to-amber-500', // Transporte
      'calendar': 'group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-purple-500' // Eventos
    };
    return textGradients[icon] || 'group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500';
  }
}