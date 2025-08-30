import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, map } from 'rxjs';
import { Booking, BookingStatus } from '../models';
import { AuthService } from './auth.service';

export interface CreateBookingRequest {
  providerId: string;
  serviceId: string;
  startsAt: string;
  endsAt: string;
  notes?: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  private _bookings = signal<Booking[]>([]);
  private _loading = signal<boolean>(false);
  
  readonly bookings = computed(() => this._bookings());
  readonly userBookings = computed(() => {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return [];
    
    return this._bookings().filter(booking => booking.userId === currentUser.id);
  });
  readonly loading = computed(() => this._loading());
  
  constructor() {
    this.loadBookings();
  }
  
  private loadBookings() {
    this._loading.set(true);
    
    this.http.get<Booking[]>('assets/data/bookings.json').pipe(
      tap(bookings => {
        this._bookings.set(bookings);
        this._loading.set(false);
      })
    ).subscribe();
  }
  
  createBooking(request: CreateBookingRequest): Observable<Booking> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      throw new Error('User must be authenticated to create booking');
    }
    
    const newBooking: Booking = {
      id: Date.now().toString(),
      userId: currentUser.id,
      providerId: request.providerId,
      serviceId: request.serviceId,
      startsAt: request.startsAt,
      endsAt: request.endsAt,
      status: 'pending',
      total: 0, // This would be calculated based on service price
      notes: request.notes,
      address: request.address,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return of(newBooking).pipe(
      tap(booking => {
        const current = this._bookings();
        this._bookings.set([...current, booking]);
      })
    );
  }
  
  updateBookingStatus(bookingId: string, status: BookingStatus): Observable<Booking> {
    return of(null as any).pipe(
      tap(() => {
        const current = this._bookings();
        const index = current.findIndex(b => b.id === bookingId);
        
        if (index >= 0) {
          const updated = {
            ...current[index],
            status,
            updatedAt: new Date().toISOString()
          };
          
          current[index] = updated;
          this._bookings.set([...current]);
        }
      })
    );
  }
  
  cancelBooking(bookingId: string, reason?: string): Observable<void> {
    return this.updateBookingStatus(bookingId, 'cancelled').pipe(
      tap(() => {
        // In a real app, this would also handle refunds, notifications, etc.
        console.log(`Booking ${bookingId} cancelled. Reason: ${reason || 'No reason provided'}`);
      }),
      map(() => void 0)
    );
  }
  
  getBookingById(id: string): Booking | undefined {
    return this._bookings().find(booking => booking.id === id);
  }
  
  getUserBookings(userId: string): Observable<Booking[]> {
    return new Observable(observer => {
      const userBookings = this._bookings().filter(booking => booking.userId === userId);
      observer.next(userBookings);
      observer.complete();
    });
  }
  
  getProviderBookings(providerId: string): Observable<Booking[]> {
    return new Observable(observer => {
      const providerBookings = this._bookings().filter(booking => booking.providerId === providerId);
      observer.next(providerBookings);
      observer.complete();
    });
  }
  
  getUpcomingBookings(): Observable<Booking[]> {
    return new Observable(observer => {
      const now = new Date();
      const upcoming = this._bookings().filter(booking => {
        const startDate = new Date(booking.startsAt);
        return startDate > now && ['confirmed', 'pending'].includes(booking.status);
      });
      observer.next(upcoming);
      observer.complete();
    });
  }
  
  getPastBookings(): Observable<Booking[]> {
    return new Observable(observer => {
      const now = new Date();
      const past = this._bookings().filter(booking => {
        const endDate = new Date(booking.endsAt);
        return endDate < now;
      });
      observer.next(past);
      observer.complete();
    });
  }
  
  rescheduleBooking(bookingId: string, newStartsAt: string, newEndsAt: string): Observable<Booking> {
    return of(null as any).pipe(
      tap(() => {
        const current = this._bookings();
        const index = current.findIndex(b => b.id === bookingId);
        
        if (index >= 0) {
          const updated = {
            ...current[index],
            startsAt: newStartsAt,
            endsAt: newEndsAt,
            updatedAt: new Date().toISOString()
          };
          
          current[index] = updated;
          this._bookings.set([...current]);
        }
      })
    );
  }
}