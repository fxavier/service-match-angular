import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      <img 
        [src]="getCategoryIconUrl()"
        [alt]="'Ícone da categoria ' + icon"
        class="w-full h-full object-cover rounded-lg"
        (error)="onImageError($event)"
      />
    </div>
  `
})
export class CategoryIconComponent {
  @Input() icon: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' = 'md';
  @Input() variant: 'filled' | 'outlined' = 'filled';
  
  get containerClasses(): string {
    let classes = 'flex items-center justify-center overflow-hidden rounded-lg border-2 border-white shadow-lg';
    
    // Size classes
    switch (this.size) {
      case 'sm':
        classes += ' w-8 h-8';
        break;
      case 'md':
        classes += ' w-12 h-12';
        break;
      case 'lg':
        classes += ' w-16 h-16';
        break;
      case 'xl':
        classes += ' w-20 h-20';
        break;
      case '2xl':
        classes += ' w-32 h-32';
        break;
      case '3xl':
        classes += ' w-48 h-48';
        break;
      case 'full':
        classes += ' w-full h-full min-h-48';
        break;
    }
    
    return classes;
  }

  getCategoryIconUrl(): string {
    const categoryIcons: Record<string, string> = {
      'sparkles': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=200&h=200', // Limpeza
      'sparkle': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=200&h=200', // Beleza - homem spa/cuidados
      'laptop': 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=200&h=200', // Tecnologia - mulher com laptop
      'graduation-cap': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=200&h=200', // Educação - pessoas estudando
      'heart': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200&h=200', // Saúde
      'wrench': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=200&h=200', // Manutenção - homem com ferramenta
      'car': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=200&h=200', // Transporte - caminhão
      'calendar': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=200&h=200' // Eventos - pessoas reunidas
    };

    return categoryIcons[this.icon] || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=200&h=200';
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Fallback to a solid color placeholder
    img.src = 'https://via.placeholder.com/200x200/6366f1/ffffff?text=Categoria';
  }
}