import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, tap } from 'rxjs';
import { Category, ServiceItem, ServiceDetails } from '../models';

export interface ServiceFilters {
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  distanceMax?: number;
  searchQuery?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  
  private _categories = signal<Category[]>([]);
  private _services = signal<ServiceItem[]>([]);
  private _serviceDetails = signal<Record<string, ServiceDetails>>({});
  private _filters = signal<ServiceFilters>({});
  private _loading = signal<boolean>(false);
  
  readonly categories = computed(() => this._categories());
  readonly services = computed(() => this._services());
  readonly filteredServices = computed(() => this.filterServices());
  readonly filters = computed(() => this._filters());
  readonly loading = computed(() => this._loading());
  
  constructor() {
    this.loadData();
  }
  
  private loadData() {
    this._loading.set(true);
    
    combineLatest([
      this.http.get<Category[]>('assets/data/categories.json'),
      this.http.get<ServiceItem[]>('assets/data/services.json'),
      this.http.get<Record<string, ServiceDetails>>('assets/data/service-details.json')
    ]).pipe(
      tap(([categories, services, serviceDetails]) => {
        this._categories.set(categories);
        this._services.set(services);
        this._serviceDetails.set(serviceDetails);
        this._loading.set(false);
      })
    ).subscribe();
  }
  
  setFilters(filters: ServiceFilters) {
    this._filters.set({ ...this._filters(), ...filters });
  }
  
  clearFilters() {
    this._filters.set({});
  }
  
  getServiceById(id: string): ServiceItem | undefined {
    return this._services().find(service => service.id === id);
  }
  
  getServiceDetails(id: string): Observable<ServiceDetails> {
    const cached = this._serviceDetails()[id];
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }
    
    // In a real app, this would fetch from an API
    return this.http.get<Record<string, ServiceDetails>>('assets/data/service-details.json')
      .pipe(
        map(details => details[id]),
        tap(detail => {
          if (detail) {
            const current = this._serviceDetails();
            this._serviceDetails.set({ ...current, [id]: detail });
          }
        })
      );
  }
  
  getServicesByCategory(categoryId: string): Observable<ServiceItem[]> {
    return new Observable(observer => {
      const filtered = this._services().filter(service => service.categoryId === categoryId);
      observer.next(filtered);
      observer.complete();
    });
  }
  
  searchServices(query: string): Observable<ServiceItem[]> {
    return new Observable(observer => {
      const filtered = this._services().filter(service =>
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      observer.next(filtered);
      observer.complete();
    });
  }
  
  private filterServices(): ServiceItem[] {
    const services = this._services();
    const filters = this._filters();
    
    if (!services.length || !Object.keys(filters).length) {
      return services;
    }
    
    return services.filter(service => {
      // Category filter
      if (filters.categoryId && service.categoryId !== filters.categoryId) {
        return false;
      }
      
      // Price range filter
      if (filters.priceMin !== undefined && service.price < filters.priceMin) {
        return false;
      }
      
      if (filters.priceMax !== undefined && service.price > filters.priceMax) {
        return false;
      }
      
      // Rating filter
      if (filters.rating !== undefined && service.rating < filters.rating) {
        return false;
      }
      
      // Distance filter
      if (filters.distanceMax !== undefined && service.distanceKm > filters.distanceMax) {
        return false;
      }
      
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = service.title.toLowerCase().includes(query);
        const matchesDescription = service.description.toLowerCase().includes(query);
        const matchesTags = service.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDescription && !matchesTags) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  getFeaturedServices(limit: number = 6): Observable<ServiceItem[]> {
    return new Observable(observer => {
      const featured = this._services()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
      observer.next(featured);
      observer.complete();
    });
  }
  
  getPopularCategories(limit: number = 8): Observable<Category[]> {
    return new Observable(observer => {
      // In a real app, this would be based on actual usage data
      const popular = this._categories().slice(0, limit);
      observer.next(popular);
      observer.complete();
    });
  }
}