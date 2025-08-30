import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses">
      <img 
        [src]="getServiceIconUrl()"
        [alt]="'Ícone do serviço ' + serviceId"
        class="w-full h-full object-cover rounded-lg"
        (error)="onImageError($event)"
      />
    </div>
  `
})
export class ServiceIconComponent {
  @Input() serviceId: string = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  
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
    }
    
    return classes;
  }

  getServiceIconUrl(): string {
    // Map service ID to category to get appropriate icon
    const serviceCategoryMap: Record<string, string> = {
      '1': 'limpeza', // Limpeza (categoryId: 1)
      '2': 'manutencao', // Manutenção - Ar Condicionado (categoryId: 2)  
      '3': 'beleza', // Beleza - Manicure (categoryId: 3)
      '4': 'saude', // Saúde - Personal Trainer (categoryId: 4)
      '5': 'tecnologia', // Tecnologia - Formatação (categoryId: 5)
      '6': 'educacao', // Educação - Inglês (categoryId: 6)
    };

    const category = serviceCategoryMap[this.serviceId];
    return this.getCategoryIconUrl(category || 'default');
  }

  private getCategoryIconUrl(category: string): string {
    const categoryIcons: Record<string, string> = {
      'limpeza': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=200&h=200',
      'beleza': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=200&h=200',
      'tecnologia': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200&h=200',
      'educacao': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
      'saude': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200&h=200',
      'manutencao': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=200&h=200',
      'transporte': 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=200&h=200',
      'eventos': 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=200&h=200',
      'default': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&q=80&w=200&h=200'
    };

    return categoryIcons[category] || categoryIcons['default'];
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Fallback to a solid color placeholder
    img.src = 'https://via.placeholder.com/200x200/6366f1/ffffff?text=Serviço';
  }
}