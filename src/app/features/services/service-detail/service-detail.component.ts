import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../../core/services/catalog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ServiceDetails } from '../../../core/models/service.model';
import { ImageCarouselComponent } from '../../../shared/components/image-carousel/image-carousel.component';
import { ServiceIconComponent } from '../../../shared/components/service-icon/service-icon.component';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ImageCarouselComponent, ServiceIconComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      @if (service()) {
        <div class="max-w-6xl mx-auto">
          <!-- Header Section -->
          <div class="mb-6">
            <button (click)="goBack()" class="flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Voltar
            </button>
            
            <div class="flex items-start gap-4 mb-6">
              <app-service-icon [serviceId]="service()!.id" size="lg"></app-service-icon>
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ service()!.title }}</h1>
                <div class="flex items-center gap-4 text-gray-600">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="font-medium">{{ service()!.rating }}/5</span>
                    <span class="text-sm">({{ service()!.reviewsCount }} avaliações)</span>
                  </div>
                  <span>•</span>
                  <span>{{ service()!.distanceKm }}km de distância</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-blue-600">€{{ service()!.price }}</div>
                <div class="text-sm text-gray-500">por {{ getProjectUnitLabel(service()!.priceUnit) }}</div>
              </div>
            </div>
          </div>

          <div class="grid lg:grid-cols-3 gap-8">
            <!-- Left Column - Images and Description -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Image Carousel -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Galeria de Imagens</h2>
                <app-image-carousel [images]="service()!.images" [autoPlay]="true"></app-image-carousel>
              </div>

              <!-- Description -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Descrição</h2>
                <p class="text-gray-700 leading-relaxed">{{ service()!.longDescription }}</p>
              </div>

              <!-- Features -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">O que está incluído</h2>
                <ul class="space-y-2">
                  @for (feature of service()!.features; track feature) {
                    <li class="flex items-start">
                      <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-gray-700">{{ feature }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Requirements -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold mb-4">Requisitos</h2>
                <ul class="space-y-2">
                  @for (requirement of service()!.requirements; track requirement) {
                    <li class="flex items-start">
                      <svg class="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-gray-700">{{ requirement }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>

            <!-- Right Column - Booking and Info -->
            <div class="lg:col-span-1 space-y-6">
              <!-- Booking Card -->
              <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div class="text-center mb-6">
                  <div class="text-3xl font-bold text-blue-600 mb-2">€{{ service()!.price }}</div>
                  <div class="text-gray-500">por {{ getProjectUnitLabel(service()!.priceUnit) }}</div>
                </div>
                
                <button class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold mb-4">
                  Reservar Agora
                </button>
                
                <button class="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Contactar Prestador
                </button>
              </div>

              <!-- Service Info -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4">Informações do Serviço</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Duração:</span>
                    <span class="font-medium">{{ service()!.duration }} min</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Disponibilidade:</span>
                    <div class="text-right">
                      @for (availability of service()!.availability; track availability) {
                        <div class="font-medium">{{ availability }}</div>
                      }
                    </div>
                  </div>
                  <div class="border-t pt-3">
                    <div class="text-gray-600 mb-2">Política de Cancelamento:</div>
                    <div class="text-sm text-gray-700">{{ service()!.cancellationPolicy }}</div>
                  </div>
                  <div class="border-t pt-3">
                    <div class="text-gray-600 mb-2">Garantia:</div>
                    <div class="text-sm text-gray-700">{{ service()!.warranty }}</div>
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-4">Tags</h3>
                <div class="flex flex-wrap gap-2">
                  @for (tag of service()!.tags; track tag) {
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{{ tag }}</span>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <!-- Loading State -->
        <div class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }
    </div>
  `
})
export class ServiceDetailComponent implements OnInit {
  service = signal<ServiceDetails | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalogService: CatalogService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadServiceDetails(id);
    }
  }

  private loadServiceDetails(id: string) {
    this.loadingService.show();
    this.catalogService.getServiceDetails(id).subscribe({
      next: (service) => {
        this.service.set(service);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading service details:', error);
        this.loadingService.hide();
        this.router.navigate(['/services']);
      }
    });
  }

  getProjectUnitLabel(unit: string): string {
    switch (unit) {
      case 'hour': return 'hora';
      case 'project': return 'projeto';
      case 'visit': return 'visita';
      default: return unit;
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}