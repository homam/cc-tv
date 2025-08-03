// Enhanced helper functions for streaming analytics
import * as THREE from 'three';
import type {
  GlobalMetricsFormatted,
  TopCountry,
  FormattedEvent,
  FormattedAlert,
  PerformanceIndicators,
  AnalyticsReport,
  StreamingEvent
} from '../types/index.js';
import { state } from '../config/data.js';

// Original utility functions for animations and calculations
export function countUp(el: HTMLElement, end: number, duration = 1500, prefix = '', decimals = 0): void {
  const startText = el.innerText.replace(/[^0-9.]/g, '');
  let start = parseFloat(startText) || 0;
  if (start === end) return;
  
  const startTime = Date.now();
  const frame = () => {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const current = start + (end - start) * progress;
    el.innerText = prefix + current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function latLonToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

export function tween(
  start: Record<string, number>, 
  end: Record<string, number>, 
  duration: number, 
  onUpdate: (interpolated: Record<string, number>) => void, 
  onComplete?: () => void, 
  easing: (t: number) => number = (t) => t
): void {
  const startTime = Date.now();
  function frame() {
    const elapsed = Date.now() - startTime;
    let progress = Math.min(elapsed / duration, 1);
    progress = easing(progress);

    const interpolated: Record<string, number> = {};
    for (const key in start) {
      interpolated[key] = start[key] + (end[key] - start[key]) * progress;
    }
    onUpdate(interpolated);

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(frame);
}

export const easeInOutCubic = (t: number): number => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Enhanced AnalyticsHelpers class for streaming analytics
export class AnalyticsHelpers {
  static formatNumber(num: number): string {
    // Show full numbers without K/M abbreviations
    return num.toLocaleString();
  }

  static formatCurrency(amount: number, currency = '$'): string {
    return currency + amount.toLocaleString();
  }

  static formatPercentage(value: number, decimals = 1): string {
    return value.toFixed(decimals) + '%';
  }

  static calculateTrend(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  static getMetricTrend(metric: { hourly: Array<{ value: number }> }): number {
    if (!metric || !metric.hourly || metric.hourly.length < 2) {
      return 0;
    }
    
    const current = metric.hourly[metric.hourly.length - 1]?.value || 0;
    const previous = metric.hourly[metric.hourly.length - 2]?.value || 0;
    
    return this.calculateTrend(current, previous);
  }

  static getTopCountries(metric = 'sales', limit = 5): TopCountry[] {
    return Object.entries(state.countries)
      .map(([name, data]) => ({
        name,
        value: (data as any)[metric] || 0,
        trend: 0,
        lat: data.lat,
        lng: data.lng
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }

  static getGlobalMetrics(): GlobalMetricsFormatted {
    return {
      views: {
        current: state.globalMetrics.views.current,
        trend: state.globalMetrics.views.trend,
        formatted: this.formatNumber(state.globalMetrics.views.current)
      },
      leads: {
        current: state.globalMetrics.leads.current,
        trend: state.globalMetrics.leads.trend,
        formatted: this.formatNumber(state.globalMetrics.leads.current)
      },
      sales: {
        current: state.globalMetrics.sales.current,
        trend: state.globalMetrics.sales.trend,
        formatted: this.formatNumber(state.globalMetrics.sales.current)
      },
      transactions: {
        current: state.globalMetrics.transactions.current,
        trend: state.globalMetrics.transactions.trend,
        formatted: this.formatNumber(state.globalMetrics.transactions.current)
      },
      revenue: {
        current: state.globalMetrics.revenue.current,
        trend: state.globalMetrics.revenue.trend,
        formatted: this.formatCurrency(state.globalMetrics.revenue.current)
      },
      cost: {
        current: state.globalMetrics.cost.current,
        trend: state.globalMetrics.cost.trend,
        formatted: this.formatCurrency(state.globalMetrics.cost.current)
      },
      ecpa: {
        current: state.globalMetrics.ecpa.current,
        trend: state.globalMetrics.ecpa.trend,
        formatted: this.formatCurrency(state.globalMetrics.ecpa.current)
      },
      conversionRate: {
        current: state.globalMetrics.conversionRate.current,
        trend: state.globalMetrics.conversionRate.trend,
        formatted: this.formatPercentage(state.globalMetrics.conversionRate.current)
      }
    };
  }

  static getCountryMetrics(countryKey: string): GlobalMetricsFormatted | null {
    const country = state.countries[countryKey];
    if (!country || !country.metrics) return null;

    return {
      views: {
        current: country.metrics.views.current,
        trend: country.metrics.views.trend,
        formatted: this.formatNumber(country.metrics.views.current)
      },
      leads: {
        current: country.metrics.leads.current,
        trend: country.metrics.leads.trend,
        formatted: this.formatNumber(country.metrics.leads.current)
      },
      sales: {
        current: country.metrics.sales.current,
        trend: country.metrics.sales.trend,
        formatted: this.formatNumber(country.metrics.sales.current)
      },
      transactions: {
        current: country.metrics.transactions.current,
        trend: country.metrics.transactions.trend,
        formatted: this.formatNumber(country.metrics.transactions.current)
      },
      revenue: {
        current: country.metrics.revenue.current,
        trend: country.metrics.revenue.trend,
        formatted: this.formatCurrency(country.metrics.revenue.current)
      },
      cost: {
        current: country.metrics.cost.current,
        trend: country.metrics.cost.trend,
        formatted: this.formatCurrency(country.metrics.cost.current)
      },
      ecpa: {
        current: country.metrics.ecpa.current,
        trend: country.metrics.ecpa.trend,
        formatted: this.formatCurrency(country.metrics.ecpa.current)
      },
      conversionRate: {
        current: country.metrics.conversionRate.current,
        trend: country.metrics.conversionRate.trend,
        formatted: this.formatPercentage(country.metrics.conversionRate.current)
      }
    };
  }

  static getStreamingEvents(limit = 10): FormattedEvent[] {
    return state.streamData.realTimeEvents
      .slice(-limit)
      .reverse()
      .map(event => ({
        ...event,
        timeAgo: this.getTimeAgo(event.timestamp),
        formattedValue: this.formatEventValue(event)
      }));
  }

  static getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    return Math.floor(diff / 86400000) + 'd ago';
  }

  static formatEventValue(event: StreamingEvent): string {
    switch (event.type) {
      case 'view':
        return `${event.value} views`;
      case 'lead':
        return `${event.value} leads`;
      case 'sale':
        return this.formatCurrency(event.value);
      case 'transaction':
        return this.formatCurrency(event.value);
      default:
        return event.value.toString();
    }
  }

  static getAlerts(limit = 5): FormattedAlert[] {
    return state.streamData.alerts
      .slice(-limit)
      .reverse()
      .map(alert => ({
        ...alert,
        timeAgo: this.getTimeAgo(alert.timestamp)
      }));
  }

  static getHourlyData(metric: { hourly: Array<{ hour: number; value: number }> }, hours = 24): Array<{ hour: number; value: number; label: string }> {
    if (!metric || !metric.hourly) return [];
    
    return metric.hourly
      .slice(-hours)
      .map((data) => ({
        hour: data.hour,
        value: data.value,
        label: this.formatHour(data.hour)
      }));
  }

  static formatHour(hour: number): string {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true 
    });
  }

  static getPerformanceIndicators(): PerformanceIndicators {
    const global = state.globalMetrics;
    
    return {
      roi: global.revenue.current > 0 ? 
        ((global.revenue.current - global.cost.current) / global.cost.current) * 100 : 0,
      profitMargin: global.revenue.current > 0 ? 
        ((global.revenue.current - global.cost.current) / global.revenue.current) * 100 : 0,
      averageOrderValue: global.sales.current > 0 ? 
        global.revenue.current / global.sales.current : 0,
      leadToSaleRatio: global.leads.current > 0 ? 
        (global.sales.current / global.leads.current) * 100 : 0
    };
  }

  static getCountryPerformance(countryKey: string): PerformanceIndicators | null {
    const country = state.countries[countryKey];
    if (!country || !country.metrics) return null;

    const metrics = country.metrics;
    
    return {
      roi: metrics.revenue.current > 0 ? 
        ((metrics.revenue.current - metrics.cost.current) / metrics.cost.current) * 100 : 0,
      profitMargin: metrics.revenue.current > 0 ? 
        ((metrics.revenue.current - metrics.cost.current) / metrics.revenue.current) * 100 : 0,
      averageOrderValue: metrics.sales.current > 0 ? 
        metrics.revenue.current / metrics.sales.current : 0,
      leadToSaleRatio: metrics.leads.current > 0 ? 
        (metrics.sales.current / metrics.leads.current) * 100 : 0
    };
  }

  static getEventTypeColor(type: string): string {
    const colors: Record<string, string> = {
      view: '#38bdf8',
      lead: '#fbbf24',
      sale: '#34d399',
      transaction: '#a78bfa'
    };
    return colors[type] || '#94a3b8';
  }

  static getAlertTypeColor(type: string): string {
    const colors: Record<string, string> = {
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#38bdf8'
    };
    return colors[type] || '#94a3b8';
  }

  static getTrendIndicator(trend: number): string {
    if (trend > 0) return '↗️';
    if (trend < 0) return '↘️';
    return '→';
  }

  static getTrendColor(trend: number): string {
    if (trend > 0) return '#34d399';
    if (trend < 0) return '#f87171';
    return '#94a3b8';
  }

  // Data export utilities
  static exportMetricsData(): any {
    return {
      timestamp: Date.now(),
      global: this.getGlobalMetrics(),
      countries: Object.keys(state.countries).reduce((acc, key) => {
        acc[key] = this.getCountryMetrics(key);
        return acc;
      }, {} as Record<string, GlobalMetricsFormatted | null>),
      performance: this.getPerformanceIndicators(),
      events: this.getStreamingEvents(50),
      alerts: this.getAlerts(10)
    };
  }

  static generateReport(): AnalyticsReport {
    const global = this.getGlobalMetrics();
    const topCountries = this.getTopCountries('revenue', 5);
    const performance = this.getPerformanceIndicators();
    
    return {
      summary: {
        totalRevenue: global.revenue.formatted,
        totalSales: global.sales.formatted,
        conversionRate: global.conversionRate.formatted,
        averageOrderValue: this.formatCurrency(performance.averageOrderValue),
        roi: this.formatPercentage(performance.roi)
      },
      topPerformers: topCountries.map(country => ({
        name: country.name,
        revenue: this.formatCurrency(country.value),
        trend: this.getTrendIndicator(country.trend)
      })),
      recentActivity: this.getStreamingEvents(5),
      alerts: this.getAlerts(3)
    };
  }
} 