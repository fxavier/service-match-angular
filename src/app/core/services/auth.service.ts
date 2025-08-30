import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, map, tap, catchError } from 'rxjs';
import { User, AuthState, LoginRequest, RegisterRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private _authState = signal<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false
  });
  
  readonly authState = computed(() => this._authState());
  readonly currentUser = computed(() => this._authState().user);
  readonly isAuthenticated = computed(() => this._authState().isAuthenticated);
  readonly userRole = computed(() => this._authState().user?.role || null);
  
  constructor() {
    this.loadAuthState();
  }
  
  login(credentials: LoginRequest): Observable<User> {
    return this.http.get<User[]>('assets/data/users.json').pipe(
      map(users => {
        const user = users.find(u => 
          u.email === credentials.email && 
          (u as any).password === credentials.password
        );
        
        if (!user) {
          throw new Error('Credenciais inválidas');
        }
        
        return user;
      }),
      tap(user => {
        const token = this.generateMockToken();
        const authState: AuthState = {
          user,
          token,
          isAuthenticated: true
        };
        
        this._authState.set(authState);
        this.saveAuthState(authState);
        
        // Auto-redirect based on user role
        this.redirectBasedOnRole(user.role);
      }),
      catchError(error => {
        throw error;
      })
    );
  }
  
  register(data: RegisterRequest): Observable<User> {
    // Simulate API call delay
    return of({
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).pipe(
      tap(user => {
        const token = this.generateMockToken();
        const authState: AuthState = {
          user,
          token,
          isAuthenticated: true
        };
        
        this._authState.set(authState);
        this.saveAuthState(authState);
      })
    );
  }
  
  private redirectBasedOnRole(role: string) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'provider':
        this.router.navigate(['/profile']);
        break;
      case 'customer':
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  logout() {
    this._authState.set({
      user: null,
      token: null,
      isAuthenticated: false
    });
    
    this.clearAuthState();
    this.router.navigate(['/auth/login']);
  }
  
  refreshToken(): Observable<boolean> {
    // Mock token refresh
    const currentState = this._authState();
    if (currentState.user) {
      const newToken = this.generateMockToken();
      const newState = { ...currentState, token: newToken };
      this._authState.set(newState);
      this.saveAuthState(newState);
      return of(true);
    }
    
    return of(false);
  }
  
  private generateMockToken(): string {
    return btoa(JSON.stringify({
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      iat: Date.now(),
      sub: this._authState().user?.id || 'unknown'
    }));
  }
  
  private loadAuthState() {
    try {
      const saved = localStorage.getItem('servimatch-auth');
      if (saved) {
        const authState = JSON.parse(saved) as AuthState;
        
        // Check if token is still valid
        if (this.isTokenValid(authState.token)) {
          this._authState.set(authState);
        } else {
          this.clearAuthState();
        }
      }
    } catch (error) {
      this.clearAuthState();
    }
  }
  
  private saveAuthState(state: AuthState) {
    try {
      localStorage.setItem('servimatch-auth', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save auth state:', error);
    }
  }
  
  private clearAuthState() {
    localStorage.removeItem('servimatch-auth');
  }
  
  private isTokenValid(token: string | null): boolean {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token));
      return payload.exp > Date.now();
    } catch {
      return false;
    }
  }
}