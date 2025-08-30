import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DashboardKpi, ChartData, ServiceRanking } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  
  private _kpis = signal<DashboardKpi | null>(null);
  private _loading = signal<boolean>(false);
  
  readonly kpis = computed(() => this._kpis());
  readonly loading = computed(() => this._loading());
  
  loadDashboardKpis(): Observable<DashboardKpi> {
    this._loading.set(true);
    
    return this.http.get<DashboardKpi>('assets/data/dashboard-kpis.json').pipe(
      tap(kpis => {
        this._kpis.set(kpis);
        this._loading.set(false);
      })
    );
  }
  
  getRevenueChart(period: 'week' | 'month' | 'year' = 'month'): Observable<ChartData> {
    return new Observable(observer => {
      const kpis = this._kpis();
      if (!kpis) {
        observer.next({ labels: [], datasets: [] });
        observer.complete();
        return;
      }
      
      let labels: string[];
      let data: number[];
      
      switch (period) {
        case 'week':
          labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
          data = [18000, 22000, 19000, 25000, 28000, 15000, 12000];
          break;
        case 'year':
          labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          data = [980000, 1050000, 1120000, 1180000, 1240000, 1300000, 1180000, 1220000, 1280000, 1340000, 1200000, 1250000];
          break;
        default: // month
          labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
          data = kpis.revenue.sparkline;
      }
      
      const chartData: ChartData = {
        labels,
        datasets: [{
          label: 'Receita',
          data,
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderColor: 'rgb(37, 99, 235)',
          borderWidth: 2
        }]
      };
      
      observer.next(chartData);
      observer.complete();
    });
  }
  
  getOrdersChart(period: 'week' | 'month' | 'year' = 'month'): Observable<ChartData> {
    return new Observable(observer => {
      const kpis = this._kpis();
      if (!kpis) {
        observer.next({ labels: [], datasets: [] });
        observer.complete();
        return;
      }
      
      let labels: string[];
      let data: number[];
      
      switch (period) {
        case 'week':
          labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
          data = [45, 52, 48, 58, 62, 38, 32];
          break;
        case 'year':
          labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          data = [2800, 3100, 3350, 3200, 3400, 3600, 3200, 3300, 3500, 3700, 3400, 3420];
          break;
        default: // month
          labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
          data = kpis.orders.sparkline;
      }
      
      const chartData: ChartData = {
        labels,
        datasets: [{
          label: 'Pedidos',
          data,
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2
        }]
      };
      
      observer.next(chartData);
      observer.complete();
    });
  }
  
  getCategoryDistribution(): Observable<ChartData> {
    return new Observable(observer => {
      const chartData: ChartData = {
        labels: ['Limpeza', 'Manutenção', 'Beleza', 'Saúde', 'Tecnologia', 'Educação', 'Transporte', 'Eventos'],
        datasets: [{
          label: 'Serviços por Categoria',
          data: [28, 22, 18, 12, 8, 6, 4, 2],
          backgroundColor: [
            'rgba(37, 99, 235, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(107, 114, 128, 0.8)'
          ],
          borderWidth: 0
        }]
      };
      
      observer.next(chartData);
      observer.complete();
    });
  }
  
  getTopServices(limit: number = 10): Observable<ServiceRanking[]> {
    return new Observable(observer => {
      const rankings: ServiceRanking[] = [
        { serviceId: '1', title: 'Limpeza Residencial Completa', category: 'Limpeza', revenue: 45000, bookings: 127, rating: 4.8 },
        { serviceId: '2', title: 'Instalação de Ar Condicionado', category: 'Manutenção', revenue: 38000, bookings: 89, rating: 4.9 },
        { serviceId: '3', title: 'Manicure e Pedicure', category: 'Beleza', revenue: 28000, bookings: 234, rating: 4.7 },
        { serviceId: '4', title: 'Personal Trainer', category: 'Saúde', revenue: 32000, bookings: 156, rating: 4.9 },
        { serviceId: '5', title: 'Formatação de Computador', category: 'Tecnologia', revenue: 15000, bookings: 78, rating: 4.6 },
        { serviceId: '6', title: 'Aulas de Inglês', category: 'Educação', revenue: 22000, bookings: 98, rating: 4.8 }
      ].slice(0, limit);
      
      observer.next(rankings);
      observer.complete();
    });
  }
  
  getMonthlyGrowth(): Observable<{ month: string; growth: number }[]> {
    return new Observable(observer => {
      const growthData = [
        { month: 'Jan', growth: 8.2 },
        { month: 'Fev', growth: 12.1 },
        { month: 'Mar', growth: 15.3 },
        { month: 'Abr', growth: 9.8 },
        { month: 'Mai', growth: 18.7 },
        { month: 'Jun', growth: 22.4 },
        { month: 'Jul', growth: 5.9 },
        { month: 'Ago', growth: 11.2 },
        { month: 'Set', growth: 16.8 },
        { month: 'Out', growth: 20.1 },
        { month: 'Nov', growth: 7.3 },
        { month: 'Dez', growth: 12.5 }
      ];
      
      observer.next(growthData);
      observer.complete();
    });
  }
  
  getProviderPerformance(limit: number = 10): Observable<any[]> {
    return new Observable(observer => {
      const performance = [
        { providerId: '1', name: 'Maria Silva', revenue: 18000, bookings: 127, rating: 4.8, completionRate: 98 },
        { providerId: '2', name: 'João Santos', revenue: 15500, bookings: 89, rating: 4.9, completionRate: 100 },
        { providerId: '3', name: 'Ana Costa', revenue: 12000, bookings: 234, rating: 4.7, completionRate: 95 },
        { providerId: '4', name: 'Carlos Ferreira', revenue: 20500, bookings: 156, rating: 4.9, completionRate: 97 },
        { providerId: '5', name: 'Lucas Oliveira', revenue: 8000, bookings: 78, rating: 4.6, completionRate: 92 },
        { providerId: '6', name: 'Patricia Mendes', revenue: 11200, bookings: 98, rating: 4.8, completionRate: 96 }
      ].slice(0, limit);
      
      observer.next(performance);
      observer.complete();
    });
  }
}