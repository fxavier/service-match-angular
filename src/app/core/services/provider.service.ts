import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, map, tap } from 'rxjs';
import { Provider, ProviderAvailability, Review } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private http = inject(HttpClient);
  
  private _providers = signal<Provider[]>([]);
  private _availability = signal<ProviderAvailability[]>([]);
  private _reviews = signal<Review[]>([]);
  private _loading = signal<boolean>(false);
  
  readonly providers = computed(() => this._providers());
  readonly availability = computed(() => this._availability());
  readonly reviews = computed(() => this._reviews());
  readonly loading = computed(() => this._loading());
  
  constructor() {
    this.loadData();
  }
  
  private loadData() {
    this._loading.set(true);
    
    combineLatest([
      this.http.get<Provider[]>('assets/data/providers.json'),
      this.http.get<ProviderAvailability[]>('assets/data/availability.json'),
      this.http.get<Review[]>('assets/data/reviews.json')
    ]).pipe(
      tap(([providers, availability, reviews]) => {
        this._providers.set(providers);
        this._availability.set(availability);
        this._reviews.set(reviews);
        this._loading.set(false);
      })
    ).subscribe();
  }
  
  getProviderById(id: string): Provider | undefined {
    return this._providers().find(provider => provider.id === id);
  }
  
  getProviderAvailability(providerId: string, date: string): Observable<string[]> {
    return new Observable(observer => {
      const availability = this._availability().find(
        avail => avail.providerId === providerId && avail.date === date
      );
      observer.next(availability?.slots || []);
      observer.complete();
    });
  }
  
  getProviderReviews(providerId: string): Observable<Review[]> {
    return new Observable(observer => {
      // Find services by this provider first, then get reviews for those services
      const providerReviews = this._reviews().filter(review => {
        // In a real app, we'd have service-provider mapping
        // For now, we'll use a simple mapping based on service IDs
        const serviceProviderMap: Record<string, string> = {
          '1': '1', // Service 1 belongs to provider 1
          '2': '2', // Service 2 belongs to provider 2
          '3': '3', // etc.
        };
        return serviceProviderMap[review.serviceId] === providerId;
      });
      
      observer.next(providerReviews);
      observer.complete();
    });
  }
  
  searchProviders(query: string): Observable<Provider[]> {
    return new Observable(observer => {
      const filtered = this._providers().filter(provider =>
        provider.name.toLowerCase().includes(query.toLowerCase()) ||
        provider.bio.toLowerCase().includes(query.toLowerCase()) ||
        provider.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
      observer.next(filtered);
      observer.complete();
    });
  }
  
  getTopRatedProviders(limit: number = 10): Observable<Provider[]> {
    return new Observable(observer => {
      const topRated = this._providers()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
      observer.next(topRated);
      observer.complete();
    });
  }
  
  getProvidersNearby(maxDistanceKm: number = 10): Observable<Provider[]> {
    return new Observable(observer => {
      // In a real app, this would use geolocation and calculate distances
      // For now, we'll return all providers as they're all "nearby"
      observer.next(this._providers());
      observer.complete();
    });
  }
  
  getProvidersBySkill(skill: string): Observable<Provider[]> {
    return new Observable(observer => {
      const filtered = this._providers().filter(provider =>
        provider.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
      observer.next(filtered);
      observer.complete();
    });
  }
  
  updateProviderAvailability(providerId: string, date: string, slots: string[]): Observable<void> {
    return new Observable(observer => {
      // Simulate API call
      const current = this._availability();
      const existingIndex = current.findIndex(
        avail => avail.providerId === providerId && avail.date === date
      );
      
      if (existingIndex >= 0) {
        current[existingIndex].slots = slots;
      } else {
        current.push({ providerId, date, slots });
      }
      
      this._availability.set([...current]);
      observer.next();
      observer.complete();
    });
  }
}