// Type definitions for the dashboard

export interface MetricData {
  current: number;
  trend: number;
  hourly: HourlyData[];
}

export interface HourlyData {
  hour: number;
  value: number;
}

export interface CountryData {
  sales: number;
  revenue: number;
  lat: number;
  lon: number;
  weeklySales: number[];
  metrics: {
    views: MetricData;
    leads: MetricData;
    sales: MetricData;
    transactions: MetricData;
    revenue: MetricData;
    cost: MetricData;
    ecpa: MetricData;
    conversionRate: MetricData;
  };
}

export interface BankData {
  lat: number;
  lon: number;
}

export interface GlobalMetrics {
  views: MetricData;
  leads: MetricData;
  sales: MetricData;
  transactions: MetricData;
  revenue: MetricData;
  cost: MetricData;
  ecpa: MetricData;
  conversionRate: MetricData;
}

export interface StreamingEvent {
  id: string;
  timestamp: number;
  type: 'view' | 'lead' | 'sale' | 'transaction';
  country: string;
  location: { lat: number; lon: number };
  value: number;
  metadata?: EventMetadata;
}

export interface EventMetadata {
  country: string;
  timestamp: number;
  paymentMethod?: string;
  offer?: string;
  customerSegment?: string;
  source?: string;
  quality?: string;
  device?: string;
  referrer?: string;
}

export interface Alert {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  timestamp: number;
}

export interface StreamData {
  realTimeEvents: StreamingEvent[];
  hourlyAggregates: any[];
  dailyAggregates: any[];
  alerts: Alert[];
}

export interface DashboardState {
  views: number;
  leads: number;
  sales: number;
  cost: number;
  transactions: number;
  revenue: number;
  cr24h: number;
  cpa24h: number;
  cr7d_avg: number;
  cpa7d_avg: number;
  paymentMethods: Record<string, number>;
  offers: Record<string, number>;
  banks: Record<string, BankData>;
  countries: Record<string, CountryData>;
  weeklySales: number[];
  weeklyRevenue: number[];
  globalMetrics: GlobalMetrics;
  streamData: StreamData;
}

export interface ChartConfig {
  type: string;
  data: {
    labels: string[];
    datasets: Array<{
      label?: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      tension?: number;
      hoverOffset?: number;
    }>;
  };
  options: {
    responsive: boolean;
    maintainAspectRatio: boolean;
    indexAxis?: string;
    plugins: {
      legend?: {
        display?: boolean;
        position?: string;
        labels?: {
          color?: string;
          boxWidth?: number;
        };
      };
    };
    scales?: {
      x?: {
        ticks?: { color: string };
        grid?: { color: string; display?: boolean };
      };
      y?: {
        ticks?: { color: string };
        grid?: { color: string; display?: boolean };
      };
    };
  };
}

export interface FormattedMetric {
  current: number;
  trend: number;
  formatted: string;
}

export interface GlobalMetricsFormatted {
  views: FormattedMetric;
  leads: FormattedMetric;
  sales: FormattedMetric;
  transactions: FormattedMetric;
  revenue: FormattedMetric;
  cost: FormattedMetric;
  ecpa: FormattedMetric;
  conversionRate: FormattedMetric;
}

export interface PerformanceIndicators {
  roi: number;
  profitMargin: number;
  averageOrderValue: number;
  leadToSaleRatio: number;
}

export interface TopCountry {
  name: string;
  value: number;
  trend: number;
  lat: number;
  lon: number;
}

export interface FormattedEvent extends StreamingEvent {
  timeAgo: string;
  formattedValue: string;
}

export interface FormattedAlert extends Alert {
  timeAgo: string;
}

export interface AnalyticsReport {
  summary: {
    totalRevenue: string;
    totalSales: string;
    conversionRate: string;
    averageOrderValue: string;
    roi: string;
  };
  topPerformers: Array<{
    name: string;
    revenue: string;
    trend: string;
  }>;
  recentActivity: FormattedEvent[];
  alerts: FormattedAlert[];
} 