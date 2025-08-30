export interface DashboardKpi {
  revenue: KpiMetric;
  orders: KpiMetric;
  avgTicket: KpiMetric;
  churn: KpiMetric;
  newCustomers: KpiMetric;
  satisfaction: KpiMetric;
}

export interface KpiMetric {
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  sparkline: number[];
  period: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ServiceRanking {
  serviceId: string;
  title: string;
  category: string;
  revenue: number;
  bookings: number;
  rating: number;
}