import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
      @if (images && images.length > 0) {
        <div class="relative w-full h-full">
          <!-- Images -->
          @for (image of images; track image; let i = $index) {
            <img 
              [src]="image" 
              [alt]="'Imagem ' + (i + 1)"
              [class]="'absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ' + (currentIndex === i ? 'opacity-100' : 'opacity-0')"
              (error)="onImageError($event)"
            />
          }
          
          <!-- Navigation arrows -->
          @if (images.length > 1) {
            <button 
              (click)="previousImage()"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <button 
              (click)="nextImage()"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          }
          
          <!-- Dots indicator -->
          @if (images.length > 1) {
            <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              @for (image of images; track image; let i = $index) {
                <button 
                  (click)="goToImage(i)"
                  [class]="'w-2 h-2 rounded-full transition-all ' + (currentIndex === i ? 'bg-white' : 'bg-white bg-opacity-50')"
                ></button>
              }
            </div>
          }
        </div>
      } @else {
        <div class="flex items-center justify-center h-full">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <p class="text-gray-500 ml-2">Sem imagens</p>
        </div>
      }
    </div>
  `
})
export class ImageCarouselComponent implements OnInit, OnDestroy {
  @Input() images: string[] = [];
  @Input() autoPlay: boolean = false;
  @Input() autoPlayInterval: number = 5000;
  
  currentIndex = 0;
  private intervalId?: number;

  ngOnInit() {
    if (this.autoPlay && this.images.length > 1) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  previousImage() {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
  }

  nextImage() {
    this.currentIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
  }

  goToImage(index: number) {
    this.currentIndex = index;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Imagem+Indispon%C3%ADvel';
  }

  private startAutoPlay() {
    this.intervalId = window.setInterval(() => {
      this.nextImage();
    }, this.autoPlayInterval);
  }

  private stopAutoPlay() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}