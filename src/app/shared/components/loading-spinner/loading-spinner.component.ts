import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      <div [class]="spinnerClasses" role="status" [attr.aria-label]="ariaLabel">
        <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
          <circle 
            class="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            stroke-width="4"
          ></circle>
          <path 
            class="opacity-75" 
            fill="currentColor" 
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span class="sr-only">{{ ariaLabel }}</span>
      </div>
      @if (text) {
        <p [class]="textClasses">{{ text }}</p>
      }
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() text?: string;
  @Input() centered = false;
  @Input() overlay = false;
  @Input() color: 'primary' | 'secondary' | 'white' | 'gray' = 'primary';
  @Input() ariaLabel = 'Carregando...';
  
  get containerClasses(): string {
    let classes = 'flex items-center gap-3';
    
    if (this.centered) {
      classes += ' justify-center';
    }
    
    if (this.overlay) {
      classes += ' fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50';
    }
    
    return classes;
  }
  
  get spinnerClasses(): string {
    let classes = '';
    
    // Size
    switch (this.size) {
      case 'sm':
        classes += 'w-4 h-4';
        break;
      case 'md':
        classes += 'w-6 h-6';
        break;
      case 'lg':
        classes += 'w-8 h-8';
        break;
      case 'xl':
        classes += 'w-12 h-12';
        break;
    }
    
    // Color
    switch (this.color) {
      case 'primary':
        classes += ' text-primary-600';
        break;
      case 'secondary':
        classes += ' text-secondary-600';
        break;
      case 'white':
        classes += ' text-white';
        break;
      case 'gray':
        classes += ' text-gray-600';
        break;
    }
    
    return classes;
  }
  
  get textClasses(): string {
    let classes = 'text-sm font-medium';
    
    switch (this.color) {
      case 'primary':
        classes += ' text-primary-600 dark:text-primary-400';
        break;
      case 'secondary':
        classes += ' text-secondary-600 dark:text-secondary-400';
        break;
      case 'white':
        classes += ' text-white';
        break;
      case 'gray':
        classes += ' text-gray-600 dark:text-gray-400';
        break;
    }
    
    return classes;
  }
}