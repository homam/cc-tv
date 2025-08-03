import { Chart, ChartConfiguration } from 'chart.js/auto';
import { chartConfigs } from '../config/data.js';

export class ChartsComponent {
  private charts: Record<string, Chart> = {};

  init(): void {
    for (const [id, config] of Object.entries(chartConfigs)) {
      const ctx = document.getElementById(`${id}Chart`) as HTMLCanvasElement;
      if (ctx) {
        this.charts[id] = new Chart(ctx.getContext('2d')!, config as ChartConfiguration);
      }
    }
  }

  updatePaymentMethods(data: Record<string, number>): void {
    if (this.charts.paymentMethods) {
      this.charts.paymentMethods.data.datasets[0].data = Object.values(data);
      this.charts.paymentMethods.update('none');
    }
  }

  updateOffers(data: Record<string, number>): void {
    if (this.charts.offers) {
      this.charts.offers.data.datasets[0].data = Object.values(data);
      this.charts.offers.update('none');
    }
  }

  updateWeeklyTrends(sales: number, revenue: number): void {
    if (this.charts.weeklyTrends) {
      this.charts.weeklyTrends.data.datasets[0].data[6] = sales;
      this.charts.weeklyTrends.data.datasets[1].data[6] = revenue;
      this.charts.weeklyTrends.update('none');
    }
  }

  updateTopCountries(countries: Record<string, any>): void {
    if (this.charts.topCountries) {
      const sortedCountries = Object.entries(countries)
        .sort((a, b) => b[1].sales - a[1].sales)
        .slice(0, 5);
      
      this.charts.topCountries.data.labels = sortedCountries.map(c => c[0]);
      this.charts.topCountries.data.datasets[0].data = sortedCountries.map(c => c[1].sales);
      this.charts.topCountries.update('none');
    }
  }

  updateFocusCountry(weeklySales: number[]): void {
    if (this.charts.focusCountry) {
      this.charts.focusCountry.data.datasets[0].data = weeklySales;
      this.charts.focusCountry.update();
    }
  }

  updateStreamingData(streamData: any): void {
    // Update charts with streaming data if needed
    if (streamData && this.charts.weeklyTrends) {
      // Update with real-time data
      const recentEvents = streamData.realTimeEvents?.slice(-7) || [];
      if (recentEvents.length > 0) {
        // Process streaming events for chart updates
        this.processStreamingEvents(recentEvents);
      }
    }
  }

  private processStreamingEvents(events: any[]): void {
    // Process streaming events to update charts
    events.forEach(event => {
      switch (event.type) {
        case 'sale':
          // Update sales-related charts
          this.updateSalesCharts();
          break;
        case 'transaction':
          // Update transaction-related charts
          this.updateTransactionCharts(event);
          break;
      }
    });
  }

  private updateSalesCharts(): void {
    // Update sales-related charts with new data
    if (this.charts.weeklyTrends) {
      const currentSales = this.charts.weeklyTrends.data.datasets[0].data[6] as number;
      this.charts.weeklyTrends.data.datasets[0].data[6] = currentSales + 1;
      this.charts.weeklyTrends.update('none');
    }
  }

  private updateTransactionCharts(event: any): void {
    // Update transaction-related charts with new data
    if (this.charts.weeklyTrends) {
      const currentRevenue = this.charts.weeklyTrends.data.datasets[1].data[6] as number;
      this.charts.weeklyTrends.data.datasets[1].data[6] = currentRevenue + (event.value || 0);
      this.charts.weeklyTrends.update('none');
    }
  }

  // Method to get chart instance for external access
  getChart(chartId: string): Chart | undefined {
    return this.charts[chartId];
  }

  // Method to destroy all charts (cleanup)
  destroy(): void {
    Object.values(this.charts).forEach(chart => {
      chart.destroy();
    });
    this.charts = {};
  }
} 